// src/components/payment/PaymentModal.jsx
// Reusable payment modal — works for property bookings, service bookings, and rent
//
// Props:
//   isOpen        {boolean}
//   onClose       {function}
//   onSuccess     {function(paymentId)} — called after successful payment
//   paymentType   {"booking" | "service_booking" | "rent"}
//   referenceId   {string}  — bookingId | serviceBookingId | unitId
//   amount        {number}  — display only
//   currency      {string}  — default "KES"
//   title         {string}  — modal heading e.g. "Pay for Booking"
//   description   {string}  — subtitle e.g. "Nairobi Heights — Unit 3A"
//   tenantId      {string}  — only for rent payments
//   rentMonth     {string}  — only for rent payments e.g. "2025-06"

import { useState, useEffect, useRef } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { initiatePayment, getPaymentStatus } from "../../utils/paymentService";
import { Smartphone, CreditCard, Banknote, X, CheckCircle, Loader2, AlertCircle } from "lucide-react";

// ── Init Stripe (replace with your publishable key) ───────────────────────────
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_REPLACE_ME");

// ── Stripe card form (inner component, must be inside <Elements>) ─────────────
function StripeForm({ onSuccess, onError }) {
  const stripe   = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg]     = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setErrorMsg("");

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/client/bookings`,
      },
      redirect: "if_required",
    });

    if (error) {
      setErrorMsg(error.message);
      onError?.(error.message);
    } else {
      onSuccess?.();
    }
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {errorMsg && (
        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
          <AlertCircle size={16} />
          {errorMsg}
        </div>
      )}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-xl font-semibold transition flex items-center justify-center gap-2"
      >
        {processing ? (
          <><Loader2 size={18} className="animate-spin" /> Processing...</>
        ) : (
          "Pay Now"
        )}
      </button>
    </form>
  );
}

// ── Main Modal ────────────────────────────────────────────────────────────────
export default function PaymentModal({
  isOpen,
  onClose,
  onSuccess,
  paymentType,
  referenceId,
  amount,
  currency = "KES",
  title = "Complete Payment",
  description = "",
  tenantId,
  rentMonth,
}) {
  const [method, setMethod]               = useState("mpesa");
  const [phone, setPhone]                 = useState("");
  const [step, setStep]                   = useState("choose");
  // step: "choose" | "mpesa_waiting" | "stripe_form" | "cash_done" | "success" | "failed"
  const [paymentId, setPaymentId]         = useState(null);
  const [clientSecret, setClientSecret]   = useState(null);
  const [statusMsg, setStatusMsg]         = useState("");
  const [error, setError]                 = useState("");
  const pollRef                           = useRef(null);

  // Cleanup polling on unmount / close
  useEffect(() => {
    if (!isOpen) {
      clearInterval(pollRef.current);
      setStep("choose");
      setError("");
      setStatusMsg("");
      setPaymentId(null);
      setClientSecret(null);
    }
  }, [isOpen]);

  // ── Build the payload for initiatePayment ─────────────────────────────────
  const buildPayload = () => {
    const base = { paymentType, method, currency };
    if (paymentType === "booking")         return { ...base, bookingId: referenceId };
    if (paymentType === "service_booking") return { ...base, serviceBookingId: referenceId };
    if (paymentType === "rent")            return { ...base, unitId: referenceId, tenantId, rentMonth };
    return base;
  };

  // ── Handle Pay button ─────────────────────────────────────────────────────
  const handlePay = async () => {
    setError("");
    try {
      if (method === "mpesa") {
        if (!phone || phone.length < 9) {
          setError("Please enter a valid phone number");
          return;
        }
        // Format: 254XXXXXXXXX
        const formatted = phone.startsWith("0")
          ? "254" + phone.slice(1)
          : phone.startsWith("+")
          ? phone.slice(1)
          : phone;

        const result = await initiatePayment({ ...buildPayload(), phone: formatted });
        setPaymentId(result.paymentId);
        setStep("mpesa_waiting");
        startPolling(result.paymentId);
      }

      if (method === "stripe") {
        const result = await initiatePayment(buildPayload());
        setPaymentId(result.paymentId);
        setClientSecret(result.clientSecret);
        setStep("stripe_form");
      }

      if (method === "cash") {
        const result = await initiatePayment(buildPayload());
        setPaymentId(result.paymentId);
        setStep("cash_done");
      }
    } catch (err) {
      setError(err.message || "Payment failed. Please try again.");
    }
  };

  // ── Poll M-Pesa status every 5s (max 2 min) ───────────────────────────────
  const startPolling = (pid) => {
    let attempts = 0;
    const MAX    = 24; // 24 × 5s = 2 minutes

    pollRef.current = setInterval(async () => {
      attempts++;
      try {
        const { status, receiptNumber } = await getPaymentStatus(pid);

        if (status === "paid") {
          clearInterval(pollRef.current);
          setStatusMsg(`Payment confirmed! Receipt: ${receiptNumber || pid}`);
          setStep("success");
          onSuccess?.(pid);
        } else if (status === "failed") {
          clearInterval(pollRef.current);
          setStep("failed");
          setError("Payment was declined or cancelled. Please try again.");
        } else if (attempts >= MAX) {
          clearInterval(pollRef.current);
          setStep("failed");
          setError("Payment timed out. If you paid, please contact support with your M-Pesa receipt.");
        }
      } catch {
        // ignore poll errors — keep trying
      }
    }, 5000);
  };

  if (!isOpen) return null;

  // ── Formatting ─────────────────────────────────────────────────────────────
  const formatAmount = (amt, cur) => {
    const symbols = { KES: "KSh", UGX: "UGX", TZS: "TZS", USD: "$", BIF: "BIF" };
    return `${symbols[cur] || cur} ${amt?.toLocaleString()}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">

        {/* ── Header ── */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">

          {/* ── Amount ── */}
          <div className="bg-gray-50 rounded-xl p-4 text-center mb-6">
            <p className="text-sm text-gray-500 mb-1">Amount to Pay</p>
            <p className="text-3xl font-bold text-gray-900">{formatAmount(amount, currency)}</p>
          </div>

          {/* ══════════════════════════════════════════════════════════
              STEP: choose method
          ══════════════════════════════════════════════════════════ */}
          {step === "choose" && (
            <div className="space-y-4">
              {/* Method selector */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">Choose payment method</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "mpesa",  label: "M-Pesa",  icon: Smartphone,  color: "green"  },
                    { id: "stripe", label: "Card",    icon: CreditCard,  color: "blue"   },
                    { id: "cash",   label: "Cash",    icon: Banknote,    color: "yellow" },
                  ].map(({ id, label, icon: Icon, color }) => (
                    <button
                      key={id}
                      onClick={() => setMethod(id)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition ${
                        method === id
                          ? `border-${color}-500 bg-${color}-50`
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Icon size={24} className={method === id ? `text-${color}-600` : "text-gray-400"} />
                      <span className={`text-sm font-medium ${method === id ? `text-${color}-700` : "text-gray-600"}`}>
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* M-Pesa phone input */}
              {method === "mpesa" && (
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    M-Pesa Phone Number
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500">
                    <span className="px-3 py-3 bg-gray-50 text-gray-500 text-sm border-r border-gray-300">
                      +254
                    </span>
                    <input
                      type="tel"
                      value={phone.startsWith("254") ? phone.slice(3) : phone.startsWith("0") ? phone.slice(1) : phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="7XXXXXXXX"
                      className="flex-1 px-3 py-3 outline-none text-sm"
                      maxLength={9}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    You'll receive an STK push prompt on this number
                  </p>
                </div>
              )}

              {/* Cash info */}
              {method === "cash" && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
                  Cash payment will be recorded and confirmed by the property manager after you pay in person.
                </div>
              )}

              {/* Card info */}
              {method === "stripe" && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
                  You'll be asked to enter your card details on the next step.
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <button
                onClick={handlePay}
                className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-semibold transition"
              >
                {method === "mpesa"  && "Send STK Push"}
                {method === "stripe" && "Continue to Card Payment"}
                {method === "cash"   && "Record Cash Payment"}
              </button>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              STEP: M-Pesa waiting
          ══════════════════════════════════════════════════════════ */}
          {step === "mpesa_waiting" && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Smartphone size={32} className="text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">Check Your Phone</h3>
                <p className="text-gray-500 text-sm mt-1">
                  An M-Pesa prompt has been sent to your phone.<br />
                  Enter your PIN to complete the payment.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 text-green-600 text-sm">
                <Loader2 size={16} className="animate-spin" />
                Waiting for confirmation...
              </div>
              <button
                onClick={() => { clearInterval(pollRef.current); setStep("choose"); }}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Cancel and choose another method
              </button>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              STEP: Stripe card form
          ══════════════════════════════════════════════════════════ */}
          {step === "stripe_form" && clientSecret && (
            <Elements
              stripe={stripePromise}
              options={{ clientSecret, appearance: { theme: "stripe" } }}
            >
              <StripeForm
                onSuccess={() => { setStep("success"); onSuccess?.(paymentId); }}
                onError={(msg) => setError(msg)}
              />
            </Elements>
          )}

          {/* ══════════════════════════════════════════════════════════
              STEP: Cash recorded
          ══════════════════════════════════════════════════════════ */}
          {step === "cash_done" && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                <Banknote size={32} className="text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">Cash Payment Recorded</h3>
                <p className="text-gray-500 text-sm mt-1">
                  Your cash payment has been recorded.<br />
                  It will be confirmed by the property manager.
                </p>
              </div>
              <button
                onClick={() => { onSuccess?.(paymentId); onClose(); }}
                className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold"
              >
                Done
              </button>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              STEP: Success
          ══════════════════════════════════════════════════════════ */}
          {step === "success" && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">Payment Successful!</h3>
                {statusMsg && <p className="text-gray-500 text-sm mt-1">{statusMsg}</p>}
              </div>
              <button
                onClick={onClose}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition"
              >
                Done
              </button>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              STEP: Failed
          ══════════════════════════════════════════════════════════ */}
          {step === "failed" && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle size={32} className="text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">Payment Failed</h3>
                <p className="text-gray-500 text-sm mt-1">{error}</p>
              </div>
              <button
                onClick={() => { setStep("choose"); setError(""); }}
                className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold"
              >
                Try Again
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
