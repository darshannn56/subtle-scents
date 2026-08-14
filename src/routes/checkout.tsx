import { useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Reveal } from "@/components/site/Reveal";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/format";
import { shippingFeeFor } from "@/lib/shop-config";
import { checkoutSchema, type CheckoutDetails } from "@/lib/checkout-schema";
import {
  createCheckoutOrder,
  verifyCheckoutPayment,
  failCheckoutPayment,
} from "@/lib/checkout.functions";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Secure Checkout — Subtle Scents" },
      {
        name: "description",
        content:
          "Complete your Subtle Scents order with secure Razorpay payments — UPI, cards, netbanking and wallets, in Indian Rupees.",
      },
      { property: "og:title", content: "Secure Checkout — Subtle Scents" },
      {
        property: "og:description",
        content: "Pay securely for your hand-poured candles.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CheckoutPage,
});

type FieldErrors = Partial<Record<keyof CheckoutDetails, string>>;

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: (response: unknown) => void) => void;
    };
  }
}

function loadRazorpayScript() {
  return new Promise<boolean>((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function CheckoutPage() {
  const { items, subtotal, lines } = useStore();
  const navigate = useNavigate();
  const createOrder = useServerFn(createCheckoutOrder);
  const verifyPayment = useServerFn(verifyCheckoutPayment);
  const failPayment = useServerFn(failCheckoutPayment);

  const [errors, setErrors] = useState<FieldErrors>({});
  const [busy, setBusy] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const shipping = shippingFeeFor(subtotal);
  const total = subtotal + shipping;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setPaymentError(null);

    const form = new FormData(event.currentTarget);
    const parsed = checkoutSchema.safeParse({
      customer_name: form.get("customer_name"),
      email: form.get("email"),
      phone: form.get("phone"),
      address: form.get("address"),
      city: form.get("city"),
      state: form.get("state"),
      pincode: form.get("pincode"),
    });

    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof CheckoutDetails;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});

    if (items.length === 0) {
      setPaymentError("Your cart is empty.");
      return;
    }

    setBusy(true);
    try {
      const scriptReady = await loadRazorpayScript();
      if (!scriptReady || !window.Razorpay) {
        throw new Error("Could not load the payment window. Check your connection.");
      }

      // The server recalculates every amount — nothing here is trusted.
      const order = await createOrder({
        data: { ...parsed.data, lines },
      });

      const rzp = new window.Razorpay({
        key: order.razorpay_key_id,
        amount: order.amount,
        currency: order.currency,
        order_id: order.razorpay_order_id,
        name: "Subtle Scents",
        description: `Order ${order.order_number}`,
        prefill: {
          name: order.customer.name,
          email: order.customer.email,
          contact: order.customer.phone,
        },
        notes: { order_number: order.order_number },
        theme: { color: "#8a6f5f" },
        modal: {
          ondismiss: () => {
            setBusy(false);
            setPaymentError(
              "Payment was cancelled. Your cart and details are saved — you can try again.",
            );
            void failPayment({
              data: {
                razorpay_order_id: order.razorpay_order_id,
                reason: "Customer closed the payment window",
              },
            });
          },
        },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verified = await verifyPayment({ data: response });
            toast("Payment confirmed 🤍", {
              description: "Your order is on its way.",
            });
            void navigate({
              to: "/order/$orderNumber",
              params: { orderNumber: verified.order_number },
              search: { token: verified.access_token },
            });
          } catch (error) {
            setBusy(false);
            setPaymentError(
              error instanceof Error
                ? error.message
                : "We couldn't verify your payment. Please contact us before paying again.",
            );
          }
        },
      });

      rzp.on("payment.failed", (raw: unknown) => {
        const detail = raw as { error?: { description?: string } };
        setBusy(false);
        setPaymentError(
          detail.error?.description ??
            "Payment was unsuccessful. Please try again.",
        );
        void failPayment({
          data: {
            razorpay_order_id: order.razorpay_order_id,
            reason: detail.error?.description ?? "Payment failed",
          },
        });
      });

      rzp.open();
    } catch (error) {
      setBusy(false);
      setPaymentError(
        error instanceof Error
          ? error.message
          : "Something went wrong starting your payment.",
      );
    }
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-[700px] flex-col items-center justify-center px-5 py-24 text-center">
        <div className="relative">
          <div className="candle-glow absolute -inset-8" aria-hidden />
          <span className="relative text-4xl">🕯️</span>
        </div>
        <h1 className="display mt-8 text-4xl sm:text-5xl">
          Nothing to check out yet.
        </h1>
        <p className="mt-5 text-sm text-muted-foreground">
          Add a candle to your collection and come back — we'll be here.
        </p>
        <Link to="/shop" className="hairline-btn mt-8">
          Shop the collection
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 md:py-24">
      <Reveal>
        <p className="eyebrow">Checkout</p>
        <h1 className="display mt-5 text-4xl sm:text-5xl">
          Almost yours.
        </h1>
      </Reveal>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <Reveal>
          <form onSubmit={onSubmit} className="space-y-6" noValidate>
            <div>
              <p className="eyebrow">Delivery details</p>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <Field
                  label="Full name"
                  name="customer_name"
                  autoComplete="name"
                  error={errors.customer_name}
                  className="sm:col-span-2"
                />
                <Field
                  label="Email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  error={errors.email}
                />
                <Field
                  label="Phone number"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="10-digit mobile"
                  error={errors.phone}
                />
                <Field
                  label="Complete delivery address"
                  name="address"
                  autoComplete="street-address"
                  textarea
                  error={errors.address}
                  className="sm:col-span-2"
                />
                <Field
                  label="City"
                  name="city"
                  autoComplete="address-level2"
                  error={errors.city}
                />
                <Field
                  label="State"
                  name="state"
                  autoComplete="address-level1"
                  error={errors.state}
                />
                <Field
                  label="Pincode"
                  name="pincode"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  error={errors.pincode}
                />
              </div>
            </div>

            {paymentError ? (
              <div
                role="alert"
                className="border border-clay/40 bg-cream px-5 py-4 text-sm"
              >
                <p className="font-medium">Payment unsuccessful</p>
                <p className="mt-1 text-muted-foreground">{paymentError}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Nothing has been lost — your cart and details are still here.
                  Press “Pay Securely” to retry.
                </p>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={busy}
              className="solid-btn w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" strokeWidth={1.4} />
                  Opening secure payment…
                </span>
              ) : (
                `Pay Securely · ${formatPrice(total)}`
              )}
            </button>

            <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="size-3.5" strokeWidth={1.3} />
              Payments processed by Razorpay · UPI, cards, netbanking & wallets
            </p>
          </form>
        </Reveal>

        <Reveal delay={120}>
          <aside className="bg-cream p-6 sm:p-8">
            <p className="eyebrow">Order summary</p>
            <ul className="mt-6 divide-y divide-border">
              {items.map(({ product, qty }) => (
                <li key={product.id} className="flex gap-4 py-4">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    loading="lazy"
                    className="h-20 w-16 object-cover"
                  />
                  <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
                    <div>
                      <p className="font-serif text-lg leading-tight">
                        {product.name}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Qty {qty} · {formatPrice(product.price)} each
                      </p>
                    </div>
                    <span className="text-sm">
                      {formatPrice(product.price * qty)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <dl className="mt-6 space-y-3 border-t border-border pt-6 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd>{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Delivery</dt>
                <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-border pt-4">
                <dt className="eyebrow">Total</dt>
                <dd className="font-serif text-2xl">{formatPrice(total)}</dd>
              </div>
            </dl>

            <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
              <Lock className="mt-0.5 size-3.5 shrink-0" strokeWidth={1.3} />
              Your total is calculated and verified on our server before payment
              — prices can't be altered in the browser.
            </p>
          </aside>
        </Reveal>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  error,
  textarea,
  className,
  ...rest
}: {
  label: string;
  name: string;
  error?: string | undefined;
  textarea?: boolean | undefined;
  className?: string | undefined;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const inputClass =
    "mt-3 w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-clay";
  return (
    <div className={className}>
      <label htmlFor={name} className="eyebrow">
        {label}
      </label>
      {textarea ? (
        <textarea
          id={name}
          name={name}
          rows={3}
          className={`${inputClass} resize-none`}
        />
      ) : (
        <input id={name} name={name} className={inputClass} {...rest} />
      )}
      {error ? (
        <p className="mt-2 text-xs text-clay">{error}</p>
      ) : null}
    </div>
  );
}
