// src/services/paymentService.js
// Handles all payment API calls from the frontend

const API = `${import.meta.env.VITE_API_URL}/api`;

function getHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
}

// ── Initiate a payment ────────────────────────────────────────────────────────
// paymentType: "booking" | "service_booking" | "rent"
// method:      "mpesa"   | "stripe"          | "cash"
export async function initiatePayment({
  paymentType,
  bookingId,
  serviceBookingId,
  unitId,
  tenantId,
  rentMonth,
  method,
  phone,
  currency = "KES",
}) {
  const res = await fetch(`${API}/payments/initiate`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      paymentType,
      bookingId,
      serviceBookingId,
      unitId,
      tenantId,
      rentMonth,
      method,
      phone,
      currency,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Payment initiation failed");
  return data;
  // Returns: { paymentId, clientSecret? (Stripe), checkoutRequestId? (M-Pesa) }
}

// ── Poll payment status (used while waiting for M-Pesa callback) ──────────────
export async function getPaymentStatus(paymentId) {
  const res = await fetch(`${API}/payments/status/${paymentId}`, {
    headers: getHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to get payment status");
  return data;
  // Returns: { status: "pending"|"paid"|"failed", paidAt, receiptNumber }
}

// ── Client payment history ────────────────────────────────────────────────────
export async function getMyPayments() {
  const res = await fetch(`${API}/payments/history`, {
    headers: getHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to load payments");
  return data;
}