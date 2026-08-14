/**
 * Server-only order logic. Prices are ALWAYS resolved from the catalogue on
 * the server — the browser never sends amounts, so a tampered frontend can
 * not change what the customer is charged.
 */
import { PRODUCTS } from "@/data/products";
import { shippingFeeFor } from "@/lib/shop-config";
import type { CheckoutDetails } from "@/lib/checkout-schema";

export type OrderItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  qty: number;
  line_total: number;
};

export type PricedCart = {
  items: OrderItem[];
  subtotal: number;
  shipping_fee: number;
  total: number;
};

export function priceCart(lines: { id: string; qty: number }[]): PricedCart {
  const items: OrderItem[] = [];
  for (const line of lines) {
    const product = PRODUCTS.find((p) => p.id === line.id);
    if (!product) continue;
    items.push({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      qty: line.qty,
      line_total: product.price * line.qty,
    });
  }
  if (items.length === 0) throw new Error("No valid products in your cart.");

  const subtotal = items.reduce((n, i) => n + i.line_total, 0);
  const shipping_fee = shippingFeeFor(subtotal);
  return { items, subtotal, shipping_fee, total: subtotal + shipping_fee };
}

export function generateOrderNumber() {
  const now = new Date();
  const stamp = [
    String(now.getUTCFullYear()).slice(2),
    String(now.getUTCMonth() + 1).padStart(2, "0"),
    String(now.getUTCDate()).padStart(2, "0"),
  ].join("");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `SS-${stamp}-${rand}`;
}

/** Shape safe to hand back to the customer's browser. */
export type PublicOrder = {
  order_number: string;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  items: OrderItem[];
  subtotal: number;
  shipping_fee: number;
  total: number;
  payment_status: string;
  order_status: string;
  created_at: string;
};

export function toPublicOrder(row: Record<string, unknown>): PublicOrder {
  return {
    order_number: row["order_number"] as string,
    razorpay_order_id: (row["razorpay_order_id"] as string) ?? null,
    razorpay_payment_id: (row["razorpay_payment_id"] as string) ?? null,
    customer_name: row["customer_name"] as string,
    email: row["email"] as string,
    phone: row["phone"] as string,
    address: row["address"] as string,
    city: row["city"] as string,
    state: row["state"] as string,
    pincode: row["pincode"] as string,
    items: (row["items"] as OrderItem[]) ?? [],
    subtotal: row["subtotal"] as number,
    shipping_fee: row["shipping_fee"] as number,
    total: row["total"] as number,
    payment_status: row["payment_status"] as string,
    order_status: row["order_status"] as string,
    created_at: row["created_at"] as string,
  };
}

export function orderRowFromCheckout(
  details: CheckoutDetails,
  cart: PricedCart,
  orderNumber: string,
) {
  return {
    order_number: orderNumber,
    customer_name: details.customer_name,
    email: details.email,
    phone: details.phone,
    address: details.address,
    city: details.city,
    state: details.state,
    pincode: details.pincode,
    items: cart.items,
    subtotal: cart.subtotal,
    shipping_fee: cart.shipping_fee,
    total: cart.total,
    payment_status: "pending",
    order_status: "Pending Payment",
  };
}
