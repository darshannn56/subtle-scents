/**
 * Checkout server functions.
 *
 * Everything money-related happens here, on the server:
 *  - the cart total is recalculated from the catalogue (never trusted from the client)
 *  - the Razorpay order is created with the server-side amount
 *  - the payment signature is verified with RAZORPAY_KEY_SECRET before an
 *    order is ever marked as paid
 *
 * Required environment variables (backend secrets, never `VITE_`-prefixed):
 *   RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
 */
import { createServerFn } from "@tanstack/react-start";
import {
  createOrderInputSchema,
  verifyPaymentInputSchema,
  failPaymentInputSchema,
  lookupOrderInputSchema,
} from "@/lib/checkout-schema";

export const createCheckoutOrder = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => createOrderInputSchema.parse(input))
  .handler(async ({ data }) => {
    const { priceCart, generateOrderNumber, orderRowFromCheckout } =
      await import("@/lib/orders.server");
    const { createRazorpayOrder, getRazorpayCredentials } = await import(
      "@/lib/razorpay.server"
    );
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );

    const { lines, ...details } = data;
    const cart = priceCart(lines);
    const { keyId } = getRazorpayCredentials();
    const orderNumber = generateOrderNumber();

    const { data: inserted, error } = await supabaseAdmin
      .from("orders")
      .insert(orderRowFromCheckout(details, cart, orderNumber))
      .select("id, order_number, access_token")
      .single();

    if (error || !inserted) {
      console.error("Order insert failed:", error);
      throw new Error("We couldn't start your order. Please try again.");
    }

    const rzpOrder = await createRazorpayOrder({
      // Razorpay works in the smallest currency unit (paise).
      amountPaise: cart.total * 100,
      receipt: orderNumber,
      notes: { order_number: orderNumber, email: details.email },
    });

    await supabaseAdmin
      .from("orders")
      .update({ razorpay_order_id: rzpOrder.id })
      .eq("id", inserted.id);

    return {
      order_number: inserted.order_number,
      access_token: inserted.access_token as string,
      razorpay_order_id: rzpOrder.id,
      razorpay_key_id: keyId, // public key id — safe in the browser
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      subtotal: cart.subtotal,
      shipping_fee: cart.shipping_fee,
      total: cart.total,
      customer: {
        name: details.customer_name,
        email: details.email,
        phone: details.phone,
      },
    };
  });

export const verifyCheckoutPayment = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => verifyPaymentInputSchema.parse(input))
  .handler(async ({ data }) => {
    const { verifyRazorpaySignature, fetchRazorpayPayment } = await import(
      "@/lib/razorpay.server"
    );
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );

    const valid = verifyRazorpaySignature({
      razorpayOrderId: data.razorpay_order_id,
      razorpayPaymentId: data.razorpay_payment_id,
      signature: data.razorpay_signature,
    });

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("id, order_number, access_token, total, payment_status")
      .eq("razorpay_order_id", data.razorpay_order_id)
      .single();

    if (error || !order) {
      console.error("Order lookup failed during verification:", error);
      throw new Error("We couldn't find that order.");
    }

    if (!valid) {
      await supabaseAdmin
        .from("orders")
        .update({
          payment_status: "failed",
          order_status: "Pending Payment",
          failure_reason: "Signature verification failed",
        })
        .eq("id", order.id);
      throw new Error("Payment could not be verified. You have not been charged twice — please retry.");
    }

    // Second, independent check against Razorpay itself.
    const payment = await fetchRazorpayPayment(data.razorpay_payment_id);
    const captured =
      payment &&
      payment.order_id === data.razorpay_order_id &&
      (payment.status === "captured" || payment.status === "authorized") &&
      payment.amount === order.total * 100;

    if (!captured) {
      await supabaseAdmin
        .from("orders")
        .update({
          payment_status: "failed",
          failure_reason: "Payment not captured or amount mismatch",
        })
        .eq("id", order.id);
      throw new Error("Payment was not completed. Please try again.");
    }

    if (order.payment_status !== "paid") {
      const { error: updateError } = await supabaseAdmin
        .from("orders")
        .update({
          razorpay_payment_id: data.razorpay_payment_id,
          razorpay_signature: data.razorpay_signature,
          payment_status: "paid",
          order_status: "Paid",
          failure_reason: null,
        })
        .eq("id", order.id);
      if (updateError) {
        console.error("Failed to mark order paid:", updateError);
        throw new Error("Payment succeeded but we couldn't save your order. Please contact us.");
      }
    }

    return {
      order_number: order.order_number,
      access_token: order.access_token as string,
    };
  });

export const failCheckoutPayment = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => failPaymentInputSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    await supabaseAdmin
      .from("orders")
      .update({
        payment_status: "failed",
        order_status: "Pending Payment",
        failure_reason: data.reason ?? "Payment failed or was cancelled",
      })
      .eq("razorpay_order_id", data.razorpay_order_id)
      .neq("payment_status", "paid");
    return { ok: true };
  });

/** Confirmation lookup — requires the private access token issued at checkout. */
export const getOrderForConfirmation = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => lookupOrderInputSchema.parse(input))
  .handler(async ({ data }) => {
    const { toPublicOrder } = await import("@/lib/orders.server");
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );

    const { data: row, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("order_number", data.order_number)
      .eq("access_token", data.token)
      .maybeSingle();

    if (error) console.error("Order confirmation lookup failed:", error);
    if (!row) return null;
    return toPublicOrder(row as unknown as Record<string, unknown>);
  });
