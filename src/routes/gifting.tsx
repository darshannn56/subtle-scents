import { createFileRoute, Link } from "@tanstack/react-router";
import { PRODUCTS } from "@/data/products";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { Newsletter } from "@/components/site/Newsletter";
import giftingImg from "@/assets/gifting.jpg";

export const Route = createFileRoute("/gifting")({
  head: () => ({
    meta: [
      { title: "Candle Gifting — Subtle Scents" },
      {
        name: "description",
        content:
          "Ribbon-tied candle gift sets for birthdays, housewarmings and festive celebrations. A little luxury, made to be gifted.",
      },
      { property: "og:title", content: "Candle Gifting — Subtle Scents" },
      {
        property: "og:description",
        content:
          "Ribbon-tied candle gift sets for birthdays, housewarmings and celebrations.",
      },
    ],
  }),
  component: GiftingPage,
});

const OCCASIONS = [
  {
    title: "Birthdays",
    body: "A scent chosen for someone, wrapped and ready before the day begins.",
  },
  {
    title: "Housewarmings",
    body: "The first warm thing in a brand-new room — a gift that stays.",
  },
  {
    title: "Festive celebrations",
    body: "Sets of three, tied in silk, for the people you see once a year.",
  },
  {
    title: "Thinking of you",
    body: "No occasion needed. Sometimes that's the loveliest reason of all.",
  },
];

function GiftingPage() {
  const giftable = PRODUCTS.filter(
    (p) => p.category === "Gifting" || p.category === "Floral",
  );

  return (
    <>
      <section className="mx-auto max-w-[1400px] px-5 pb-16 pt-16 sm:px-8 md:pt-24">
        <div className="grid items-center gap-12 md:grid-cols-[1.05fr_1fr] md:gap-16">
          <Reveal className="relative order-2 md:order-1">
            <div className="candle-glow pointer-events-none absolute -right-6 -top-8 size-48" aria-hidden />
            <img
              src={giftingImg}
              alt="Candle gift box with silk ribbon and dried blush flowers"
              loading="lazy"
              width={1408}
              height={1008}
              className="relative w-full object-cover"
            />
          </Reveal>
          <div className="order-1 md:order-2">
            <Reveal>
              <p className="eyebrow">Gifting</p>
              <h1 className="display mt-5 text-5xl sm:text-6xl lg:text-7xl">
                A little luxury,
                <br />
                made to be gifted.
              </h1>
              <p className="mt-7 max-w-md text-sm leading-[1.9] text-muted-foreground sm:text-base">
                Whether it's a birthday, housewarming, festive celebration or
                simply a quiet way of saying "thinking of you" — make the moment
                a little more special.
              </p>
              <p className="mt-5 max-w-md text-sm leading-[1.9] text-muted-foreground sm:text-base">
                Every gift order arrives nested in tissue, tied with silk ribbon
                and finished with a handwritten note card.
              </p>
              <Link to="/shop" className="solid-btn mt-9">
                Explore Gifting
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-cream">
        <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 md:py-24">
          <Reveal>
            <h2 className="display text-4xl sm:text-5xl">
              For every quiet occasion.
            </h2>
          </Reveal>
          <ul className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {OCCASIONS.map((o, i) => (
              <Reveal as="li" key={o.title} delay={i * 80}>
                <span className="eyebrow">0{i + 1}</span>
                <h3 className="mt-4 font-serif text-2xl">{o.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                  {o.body}
                </p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 md:py-24">
        <Reveal>
          <p className="eyebrow">Ready to gift</p>
          <h2 className="display mt-4 text-4xl sm:text-5xl">
            Wrapped and waiting.
          </h2>
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 md:gap-x-8">
          {giftable.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 90}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      <Newsletter />
    </>
  );
}
