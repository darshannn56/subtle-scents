/**
 * Server-only Razorpay helpers.
 *
 * ── Environment variables ────────────────────────────────────────────────
 * RAZORPAY_KEY_ID      – Razorpay Key ID   (may reach the browser; it is public)
 * RAZORPAY_KEY_SECRET  – Razorpay Key Secret (SERVER ONLY — never exposed)
 *
 * Both are configured as encrypted backend secrets/environment variables and
 * are read at request time inside server handlers. They are never prefixed
 * with `VITE_`, so they can never be bundled into client-side JavaScript.
 * For self-hosted deployments, set the same two variables in the hosting
 * provider's environment configuration.
 * ─────────────────────────────────────────────────────────────────────────
 */
import { createHmac, timingSafeEqual } from "crypto";

const RAZORPAY_API = "https://api.razorpay.com/v1";

export function getRazorpayCredentials() {
  const keyId = process.env["RAZORPAY_KEY_ID"];
  const keySecret = process.env["RAZORPAY_KEY_SECRET"];
  if (!keyId || !keySecret) {
    throw new Error(
      "Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.",
    );
  }
  return { keyId, keySecret };
}

export type RazorpayOrder = {
  id: string;
  amount: number;
  currency: string;
  status: string;
};

/** Creates an order with Razorpay. `amountPaise` must be computed server-side. */
export async function createRazorpayOrder(input: {
  amountPaise: number;
  receipt: string;
  notes?: Record<string, string>;
}): Promise<RazorpayOrder> {
  const { keyId, keySecret } = getRazorpayCredentials();
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

  const res = await fetch(`${RAZORPAY_API}/orders`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: input.amountPaise,
      currency: "INR",
      receipt: input.receipt,
      notes: input.notes ?? {},
      payment_capture: 1,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error("Razorpay order creation failed:", res.status, detail);
    throw new Error("Could not reach the payment gateway. Please try again.");
  }

  return (await res.json()) as RazorpayOrder;
}

/**
 * Verifies the Razorpay checkout signature:
 * HMAC_SHA256(razorpay_order_id + "|" + razorpay_payment_id, KEY_SECRET)
 */
export function verifyRazorpaySignature(input: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  signature: string;
}): boolean {
  const { keySecret } = getRazorpayCredentials();
  const expected = createHmac("sha256", keySecret)
    .update(`${input.razorpayOrderId}|${input.razorpayPaymentId}`)
    .digest("hex");

  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(input.signature, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Double-check with Razorpay that the payment is actually captured/authorized. */
export async function fetchRazorpayPayment(paymentId: string) {
  const { keyId, keySecret } = getRazorpayCredentials();
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const res = await fetch(`${RAZORPAY_API}/payments/${paymentId}`, {
    headers: { Authorization: `Basic ${auth}` },
  });
  if (!res.ok) return null;
  return (await res.json()) as {
    id: string;
    order_id: string;
    status: string;
    amount: number;
    currency: string;
    method?: string;
  };
}
