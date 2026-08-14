import { z } from "zod";

/** Shared checkout validation — used by the form and re-run on the server. */
export const checkoutSchema = z.object({
  customer_name: z.string().trim().min(2, "Please enter your full name").max(80),
  email: z.string().trim().email("Enter a valid email address").max(160),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  address: z.string().trim().min(8, "Please enter your full address").max(300),
  city: z.string().trim().min(2, "Enter your city").max(80),
  state: z.string().trim().min(2, "Enter your state").max(80),
  pincode: z.string().trim().regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
});

export type CheckoutDetails = z.infer<typeof checkoutSchema>;

/** Cart lines sent to the server — only ids and quantities, never prices. */
export const cartLinesSchema = z
  .array(
    z.object({
      id: z.string().min(1).max(40),
      qty: z.number().int().min(1).max(20),
    }),
  )
  .min(1, "Your cart is empty")
  .max(30);

export const createOrderInputSchema = checkoutSchema.extend({
  lines: cartLinesSchema,
});

export const verifyPaymentInputSchema = z.object({
  razorpay_order_id: z.string().min(4).max(80),
  razorpay_payment_id: z.string().min(4).max(80),
  razorpay_signature: z.string().min(4).max(200),
});

export const failPaymentInputSchema = z.object({
  razorpay_order_id: z.string().min(4).max(80),
  reason: z.string().trim().max(300).optional(),
});

export const lookupOrderInputSchema = z.object({
  order_number: z.string().trim().min(4).max(40),
  token: z.string().trim().min(10).max(80),
});
