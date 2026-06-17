// backend/services/paymentService.js
// CREATE this file — place it in backend/services/ (create the folder if it doesn't exist)
//
// Contains ALL gateway communication.
// Controllers call this; they never talk to Stripe/M-Pesa directly.

const axios  = require("axios");
const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function mpesaBaseUrl() {
  return process.env.MPESA_ENV === "live"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";
}

function mpesaTimestamp() {
  // Format: YYYYMMDDHHmmss
  return new Date()
    .toISOString()
    .replace(/[^0-9]/g, "")
    .slice(0, 14);
}

// ─────────────────────────────────────────────────────────────────────────────
// M-PESA — Get OAuth token
// ─────────────────────────────────────────────────────────────────────────────
async function getMpesaToken() {
  const credentials = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString("base64");

  const { data } = await axios.get(
    `${mpesaBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`,
    { headers: { Authorization: `Basic ${credentials}` } }
  );

  return data.access_token;
}

// ─────────────────────────────────────────────────────────────────────────────
// M-PESA — STK Push (sends payment prompt to client's phone)
//
// @param {string} phone     - Phone number in format 254XXXXXXXXX
// @param {number} amount    - Amount in KES (will be rounded up to whole number)
// @param {string} reference - Short reference shown on phone e.g. "BK-12345"
// @param {string} description
// @returns { CheckoutRequestID, MerchantRequestID, ResponseCode, ... }
// ─────────────────────────────────────────────────────────────────────────────
async function initiateMpesaSTK({ phone, amount, reference, description }) {
  const token     = await getMpesaToken();
  const timestamp = mpesaTimestamp();
  const password  = Buffer.from(
    `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
  ).toString("base64");

  const { data } = await axios.post(
    `${mpesaBaseUrl()}/mpesa/stkpush/v1/processrequest`,
    {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password:          password,
      Timestamp:         timestamp,
      TransactionType:   "CustomerPayBillOnline",
      Amount:            Math.ceil(amount),         // M-Pesa requires integer
      PartyA:            phone,
      PartyB:            process.env.MPESA_SHORTCODE,
      PhoneNumber:       phone,
      CallBackURL:       process.env.MPESA_CALLBACK_URL,
      AccountReference:  reference.slice(0, 12),    // max 12 chars
      TransactionDesc:   (description || "Hostein Payment").slice(0, 13),
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  // data.ResponseCode === "0" means STK push was sent successfully
  if (data.ResponseCode !== "0") {
    throw new Error(`M-Pesa STK failed: ${data.ResponseDescription}`);
  }

  return data;
  // Returns: { MerchantRequestID, CheckoutRequestID, ResponseCode,
  //            ResponseDescription, CustomerMessage }
}

// ─────────────────────────────────────────────────────────────────────────────
// STRIPE — Create Payment Intent
//
// Frontend uses the returned clientSecret to render the card form.
//
// @param {number} amount      - Amount in the base currency unit (e.g. KES)
// @param {string} currency    - ISO currency code e.g. "kes", "usd"
// @param {string} description
// @param {object} metadata    - Extra info stored on the intent { bookingId, type }
// @returns { clientSecret, paymentIntentId }
// ─────────────────────────────────────────────────────────────────────────────
async function createStripePaymentIntent({ amount, currency, description, metadata }) {
  // Stripe uses smallest currency unit (cents for USD, cents-equivalent for KES)
  // KES is a zero-decimal currency in Stripe — pass the amount directly
  const stripeAmount = currency.toLowerCase() === "kes"
    ? Math.round(amount)          // KES — no conversion needed
    : Math.round(amount * 100);   // USD, EUR etc — convert to cents

  const intent = await stripe.paymentIntents.create({
    amount,
    currency:    currency.toLowerCase(),
    description: description || "Hostein Payment",
    metadata:    metadata || {},
    automatic_payment_methods: { enabled: true },
  });

  return {
    clientSecret:    intent.client_secret,
    paymentIntentId: intent.id,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// STRIPE — Construct and verify webhook event
// (called from the webhook route handler)
// ─────────────────────────────────────────────────────────────────────────────
function constructStripeEvent(rawBody, signature) {
  return stripe.webhooks.constructEvent(
    rawBody,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );
}

module.exports = {
  initiateMpesaSTK,
  createStripePaymentIntent,
  constructStripeEvent,
};