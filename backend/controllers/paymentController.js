// backend/controllers/paymentController.js
// REPLACES the paymentController folder entirely.
// Delete the old folder and create this single file.
//
// Handles:
//   POST /api/payments/initiate          — start a payment (M-Pesa or Stripe)
//   POST /api/payments/mpesa/callback    — M-Pesa webhook (public, no auth)
//   POST /api/payments/stripe/webhook    — Stripe webhook  (public, no auth)
//   GET  /api/payments/status/:paymentId — poll payment status
//   GET  /api/payments/history           — client's payment history
//   GET  /api/payments/admin             — admin: all payments

const Payment        = require("../models/Payment");
const Booking        = require("../models/Booking");
const ServiceBooking = require("../models/ServiceBooking");
const Unit           = require("../models/Unit");
const {
  initiateMpesaSTK,
  createStripePaymentIntent,
  constructStripeEvent,
} = require("../services/paymentService");

// ─────────────────────────────────────────────────────────────────────────────
// HELPER — mark a payment as paid and update the linked document
// ─────────────────────────────────────────────────────────────────────────────
async function markPaid(payment) {
  payment.status = "paid";
  payment.paidAt = new Date();
  await payment.save();

  // Update the linked document's paymentStatus
  if (payment.paymentType === "booking" && payment.booking) {
    await Booking.findByIdAndUpdate(payment.booking, {
      paymentStatus: "paid",
      status: "confirmed",   // auto-confirm property booking on payment
    });
  }

  if (payment.paymentType === "service_booking" && payment.serviceBooking) {
    await ServiceBooking.findByIdAndUpdate(payment.serviceBooking, {
      paymentStatus: "paid",
      status: "confirmed",   // auto-confirm service booking on payment
    });
  }

  if (payment.paymentType === "rent" && payment.unit) {
    // For rent we just mark payment paid — unit occupation is managed separately
    await Unit.findByIdAndUpdate(payment.unit, {
      lastRentPaidAt: new Date(),
    });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/payments/initiate
// Body: { paymentType, bookingId | serviceBookingId | unitId,
//         method, phone (M-Pesa), currency, rentMonth (rent only) }
// ─────────────────────────────────────────────────────────────────────────────
exports.initiatePayment = async (req, res) => {
  try {
    const {
      paymentType,      // "booking" | "service_booking" | "rent"
      bookingId,
      serviceBookingId,
      unitId,
      tenantId,
      rentMonth,
      method,           // "mpesa" | "stripe" | "cash"
      phone,            // required for M-Pesa, format: 254XXXXXXXXX
      currency = "KES",
    } = req.body;

    // ── 1. Resolve the amount and build the payment doc ───────────
    let amount, reference, description, extraFields = {};

    if (paymentType === "booking") {
      const doc = await Booking.findById(bookingId).populate("property", "title");
      if (!doc) return res.status(404).json({ message: "Booking not found" });
      // Prevent double-payment
      if (doc.paymentStatus === "paid")
        return res.status(400).json({ message: "Booking already paid" });

      amount      = doc.amount;
      reference   = `BK-${doc._id.toString().slice(-8).toUpperCase()}`;
      description = `Property booking: ${doc.property?.title || ""}`;
      extraFields = { booking: doc._id };

    } else if (paymentType === "service_booking") {
      const doc = await ServiceBooking.findById(serviceBookingId);
      if (!doc) return res.status(404).json({ message: "Service booking not found" });
      if (doc.paymentStatus === "paid")
        return res.status(400).json({ message: "Service booking already paid" });

      amount      = doc.price;
      reference   = `SB-${doc._id.toString().slice(-8).toUpperCase()}`;
      description = `Service: ${doc.serviceType}`;
      extraFields = { serviceBooking: doc._id };

    } else if (paymentType === "rent") {
      const doc = await Unit.findById(unitId);
      if (!doc) return res.status(404).json({ message: "Unit not found" });

      amount      = doc.totalMonthlyCost || doc.rentAmount;
      reference   = `RT-${doc._id.toString().slice(-8).toUpperCase()}`;
      description = `Rent: Unit ${doc.unitNumber} — ${rentMonth || ""}`;
      extraFields = { unit: unitId, tenant: tenantId, rentMonth };

    } else {
      return res.status(400).json({ message: "Invalid paymentType" });
    }

    // ── 2. Create the Payment record (status: pending) ─────────────
    const payment = await Payment.create({
      paidBy:      req.user._id,
      paymentType,
      amount,
      currency,
      method,
      status:      "pending",
      notes:       description,
      ...extraFields,
    });

    // ── 3. Trigger gateway ─────────────────────────────────────────

    // ── CASH ──────────────────────────────────────────────────────
    if (method === "cash") {
      // Cash is recorded but marked pending until admin confirms
      return res.status(201).json({
        message: "Cash payment recorded. Awaiting confirmation.",
        paymentId: payment._id,
        payment,
      });
    }

    // ── M-PESA ────────────────────────────────────────────────────
    if (method === "mpesa") {
      if (!phone) {
        await Payment.findByIdAndDelete(payment._id);
        return res.status(400).json({ message: "Phone number required for M-Pesa" });
      }

      const stkResponse = await initiateMpesaSTK({
        phone,
        amount,
        reference,
        description,
      });

      // Store M-Pesa identifiers so the callback can find this payment
      payment.mpesa.phone             = phone;
      payment.mpesa.checkoutRequestId = stkResponse.CheckoutRequestID;
      payment.mpesa.merchantRequestId = stkResponse.MerchantRequestID;
      await payment.save();

      return res.status(201).json({
        message: "STK push sent. Ask client to check their phone.",
        paymentId:         payment._id,
        checkoutRequestId: stkResponse.CheckoutRequestID,
      });
    }

    // ── STRIPE ────────────────────────────────────────────────────
    if (method === "stripe") {
      const { clientSecret, paymentIntentId } = await createStripePaymentIntent({
        amount,
        currency,
        description,
        metadata: {
          paymentId:   payment._id.toString(),
          paymentType,
        },
      });

      payment.stripe.paymentIntentId = paymentIntentId;
      payment.stripe.clientSecret    = clientSecret;
      await payment.save();

      return res.status(201).json({
        message:      "Stripe Payment Intent created.",
        paymentId:    payment._id,
        clientSecret, // frontend uses this to render the card form
      });
    }

    return res.status(400).json({ message: "Invalid payment method" });

  } catch (err) {
    console.error("initiatePayment error:", err);
    res.status(500).json({ message: err.message || "Payment initiation failed" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/payments/mpesa/callback
// Called by Safaricom — MUST be public (no auth middleware)
// MUST always respond with HTTP 200, even on errors
// ─────────────────────────────────────────────────────────────────────────────
exports.mpesaCallback = async (req, res) => {
  // Always send 200 to Safaricom first — they retry if they don't get it
  res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted" });

  try {
    const stk = req.body?.Body?.stkCallback;
    if (!stk) return;

    const { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = stk;

    // Find the payment by checkout ID
    const payment = await Payment.findOne({
      "mpesa.checkoutRequestId": CheckoutRequestID,
    });
    if (!payment) {
      console.warn("M-Pesa callback: no payment found for", CheckoutRequestID);
      return;
    }

    payment.mpesa.resultCode = ResultCode;
    payment.mpesa.resultDesc = ResultDesc;

    if (ResultCode === 0) {
      // ── SUCCESS ──
      // Extract the M-Pesa receipt number from metadata
      const items = CallbackMetadata?.Item || [];
      const get   = (name) => items.find((i) => i.Name === name)?.Value;

      payment.mpesa.receiptNumber = get("MpesaReceiptNumber");

      await markPaid(payment); // sets status=paid, updates Booking/ServiceBooking
      console.log(`✅ M-Pesa paid: ${payment.mpesa.receiptNumber} — Payment ${payment._id}`);
    } else {
      // ── FAILED / CANCELLED ──
      payment.status = "failed";
      await payment.save();
      console.warn(`❌ M-Pesa failed (${ResultCode}): ${ResultDesc}`);
    }
  } catch (err) {
    console.error("mpesaCallback processing error:", err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/payments/stripe/webhook
// Called by Stripe — MUST be public, MUST receive raw body (see paymentRoutes.js)
// ─────────────────────────────────────────────────────────────────────────────
exports.stripeWebhook = async (req, res) => {
  const signature = req.headers["stripe-signature"];

  let event;
  try {
    event = constructStripeEvent(req.body, signature);
  } catch (err) {
    console.error("Stripe webhook signature error:", err.message);
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  try {
    if (event.type === "payment_intent.succeeded") {
      const intent  = event.data.object;
      const payment = await Payment.findOne({
        "stripe.paymentIntentId": intent.id,
      });

      if (payment) {
        payment.stripe.chargeId = intent.latest_charge;
        await markPaid(payment);
        console.log(`✅ Stripe paid: ${intent.id} — Payment ${payment._id}`);
      }
    }

    if (event.type === "payment_intent.payment_failed") {
      const intent  = event.data.object;
      const payment = await Payment.findOne({
        "stripe.paymentIntentId": intent.id,
      });
      if (payment) {
        payment.status = "failed";
        await payment.save();
        console.warn(`❌ Stripe failed: ${intent.id}`);
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error("stripeWebhook processing error:", err);
    res.status(500).json({ message: "Webhook processing error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/payments/status/:paymentId
// Client polls this every 5s while waiting for M-Pesa confirmation
// ─────────────────────────────────────────────────────────────────────────────
exports.getPaymentStatus = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId).select(
      "status paymentType paidAt mpesa.receiptNumber mpesa.resultDesc stripe.paymentIntentId"
    );

    if (!payment) return res.status(404).json({ message: "Payment not found" });

    // Only the payer or admin can check status
    if (
      payment.paidBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json({
      status:        payment.status,       // "pending" | "paid" | "failed"
      paymentType:   payment.paymentType,
      paidAt:        payment.paidAt,
      receiptNumber: payment.mpesa?.receiptNumber,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/payments/history
// Returns the logged-in user's payment history
// ─────────────────────────────────────────────────────────────────────────────
exports.getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ paidBy: req.user._id })
      .populate("booking",        "checkIn checkOut amount property")
      .populate("serviceBooking", "serviceType scheduledDate price")
      .populate("unit",           "unitNumber unitType rentAmount")
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/payments/admin
// Admin: all payments with full detail
// ─────────────────────────────────────────────────────────────────────────────
exports.getAllPayments = async (req, res) => {
  try {
    if (!["admin", "landlord", "host"].includes(req.user.role)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { status, method, paymentType, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status)      filter.status      = status;
    if (method)      filter.method      = method;
    if (paymentType) filter.paymentType = paymentType;

    const payments = await Payment.find(filter)
      .populate("paidBy",         "name email")
      .populate("booking",        "checkIn checkOut property")
      .populate("serviceBooking", "serviceType scheduledDate")
      .populate("unit",           "unitNumber")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Payment.countDocuments(filter);

    res.json({ payments, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/payments/:paymentId/confirm-cash
// Admin manually confirms a cash payment
// ─────────────────────────────────────────────────────────────────────────────
exports.confirmCash = async (req, res) => {
  try {
    if (!["admin", "landlord", "host"].includes(req.user.role)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const payment = await Payment.findById(req.params.paymentId);
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    if (payment.method !== "cash")
      return res.status(400).json({ message: "Only cash payments can be manually confirmed" });
    if (payment.status === "paid")
      return res.status(400).json({ message: "Already paid" });

    await markPaid(payment);
    res.json({ message: "Cash payment confirmed", payment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};