import { useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { MessageCircle } from "lucide-react";
import { z } from "zod";
import { Reveal } from "@/components/site/Reveal";
import { formatPrice } from "@/lib/format";
import { whatsappOrderLink } from "@/lib/shop-config";
import { useStore } from "@/lib/store";
import { getOrderForConfirmation } from "@/lib/checkout.functions";

const searchSchema = z.object({ token: z.string().catch("") });

export const Route = createFileRoute("/order/$orderNumber")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Order Confirmed — Subtle Scents" },
      {
        name: "description",
        content:
          "Your Subtle Scents order is confirmed. View your order details, payment status and delivery information.",
      },
      { property: "og:title", content: "Order Confirmed — Subtle Scents" },
      {
        property: "og:description",
        content: "Your little moment is on its way. 🕯️",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: OrderPage,
});

function OrderPage() {
  const { orderNumber } = Route.useParams();
  const { token } = Route.useSearch();
  const fetchOrder = useServerFn(getOrderForConfirmation);

  const { data, isPending } = useQuery({
    queryKey: ["order", orderNumber, token],
    queryFn: () => fetchOrder({ data: { order_number: orderNumber, token } }),
    enabled: token.length > 10,
    retry: false,
  });

  const paid = data?.payment_status === "paid";
  const { lines, remove } = useStore();

  // Clear the cart once the order is confirmed paid.
  useEffect(() => {
    if (!paid) return;
    for (const line of lines) remove(line.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paid]);

  if (isPending && token.length > 10) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-[700px] items-center justify-center px-5 text-sm text-muted-foreground">
        Fetching your order…
      </section>
    );
  }

  if (!data) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-[700px] flex-col items-center justify-center px-5 py-24 text-center">
        <h1 className="display text-4xl">We couldn't find that order.</h1>
        <p className="mt-5 text-sm text-muted-foreground">
          The confirmation link may be incomplete. Message us on WhatsApp and
          we'll look it up for you.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href={whatsappOrderLink(orderNumber)}
            target="_blank"
            rel="noreferrer noopener"
            className="hairline-btn"
          >
            WhatsApp us
          </a>
          <Link to="/shop" className="solid-btn">
            Continue Shopping
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[900px] px-5 py-16 sm:px-8 md:py-24">
      <Reveal>
        <div className="text-center">
          <div className="relative inline-block">
            <div className="candle-glow absolute -inset-8" aria-hidden />
            <span className="relative text-4xl">🕯️</span>
          </div>
          <h1 className="display mt-8 text-4xl leading-tight sm:text-5xl">
            Your little moment
            <br />
            is on its way.
          </h1>
          <p className="mt-6 text-sm text-muted-foreground">
            A confirmation has been noted for {data.email}. We hand-pack every
            order with care.
          </p>
        </div>
      </Reveal>

      <Reveal delay={100}>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          <InfoCard label="Order ID" value={data.order_number} />
          <InfoCard
            label="Payment status"
            value={
              paid
                ? "Paid"
                : data.payment_status === "failed"
                  ? "Payment unsuccessful"
                  : "Pending payment"
            }
          />
          <InfoCard label="Order status" value={data.order_status} />
          <InfoCard
            label="Payment reference"
            value={data.razorpay_payment_id ?? "—"}
          />
        </div>
      </Reveal>

      <Reveal delay={160}>
        <div className="mt-10 bg-cream p-6 sm:p-8">
          <p className="eyebrow">Items purchased</p>
          <ul className="mt-5 divide-y divide-border text-sm">
            {data.items.map((item) => (
              <li
                key={item.id}
                className="flex items-baseline justify-between gap-4 py-3"
              >
                <span className="font-serif text-lg">
                  {item.name}{" "}
                  <span className="text-xs text-muted-foreground">
                    × {item.qty}
                  </span>
                </span>
                <span>{formatPrice(item.line_total)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-3 border-t border-border pt-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>{formatPrice(data.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Delivery</dt>
              <dd>
                {data.shipping_fee === 0
                  ? "Free"
                  : formatPrice(data.shipping_fee)}
              </dd>
            </div>
            <div className="flex items-baseline justify-between border-t border-border pt-4">
              <dt className="eyebrow">Total paid</dt>
              <dd className="font-serif text-2xl">{formatPrice(data.total)}</dd>
            </div>
          </dl>
        </div>
      </Reveal>

      <Reveal delay={220}>
        <div className="mt-10 border border-border p-6 sm:p-8">
          <p className="eyebrow">Delivering to</p>
          <address className="mt-4 text-sm not-italic leading-relaxed">
            {data.customer_name}
            <br />
            {data.address}
            <br />
            {data.city}, {data.state} {data.pincode}
            <br />
            {data.phone}
          </address>
        </div>
      </Reveal>

      <Reveal delay={280}>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <Link to="/shop" className="solid-btn">
            Continue Shopping
          </Link>
          <a
            href={whatsappOrderLink(data.order_number)}
            target="_blank"
            rel="noreferrer noopener"
            className="hairline-btn inline-flex items-center gap-2"
          >
            <MessageCircle className="size-4" strokeWidth={1.3} />
            Order help on WhatsApp
          </a>
        </div>
      </Reveal>
    </section>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border px-5 py-4">
      <p className="eyebrow">{label}</p>
      <p className="mt-2 break-all font-serif text-lg">{value}</p>
    </div>
  );
}
