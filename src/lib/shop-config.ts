/**
 * Shared, client-safe shop configuration.
 *
 * NOTE: these values are also used by the server when it recalculates the
 * order total. The client only ever *displays* them — the authoritative
 * amount charged to the customer is always computed server-side in
 * `src/lib/checkout.functions.ts`.
 */

/** Flat delivery charge, in INR. */
export const SHIPPING_FEE = 79;

/** Orders at or above this subtotal (INR) ship free. */
export const FREE_SHIPPING_THRESHOLD = 1500;

export function shippingFeeFor(subtotal: number) {
  if (subtotal <= 0) return 0;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
}

/** WhatsApp number used for order assistance (international format, no +). */
export const WHATSAPP_NUMBER = "919000000000";

export function whatsappOrderLink(orderNumber: string) {
  const text = `Hi Subtle Scents 🕯️ I need help with my order ${orderNumber}.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
