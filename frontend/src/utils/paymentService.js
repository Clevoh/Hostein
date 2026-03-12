// src/utils/paymentService.js
// All payment API calls in one place

const BASE = "http://localhost:5000/api";

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

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
  const res = await fetch(`${BASE}/payments/initiate`, {
    method: "POST",
    headers: authHeaders(),
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
  // Returns:
  //   cash/mpesa: { paymentId, message, checkoutRequestId? }
  //   stripe:     { paymentId, clientSecret }
}

// ── Poll payment status (for M-Pesa waiting screen) ───────────────────────────
export async function getPaymentStatus(paymentId) {
  const res = await fetch(`${BASE}/payments/status/${paymentId}`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to get payment status");
  return data;
  // Returns: { status: "pending"|"paid"|"failed", paidAt, receiptNumber }
}

// ── Get payment history ───────────────────────────────────────────────────────
export async function getMyPayments() {
  const res = await fetch(`${BASE}/payments/history`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to load payments");
  return data;
}