import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CATEGORIES, PRODUCTS, type Category } from "@/data/products";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { Newsletter } from "@/components/site/Newsletter";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop Handcrafted Candles — Subtle Scents" },
      {
        name: "description",
        content:
          "Browse the Subtle Scents collection of hand-poured, paraffin-free candles — floral, sweet, fresh, woody and gifting.",
      },
      { property: "og:title", content: "Shop Handcrafted Candles — Subtle Scents" },
      {
        property: "og:description",
        content:
          "Hand-poured, paraffin-free candles in floral, sweet, fresh and woody scents.",
      },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const [active, setActive] = useState<Category>("All");

  const products = useMemo(
    () =>
      active === "All"
        ? PRODUCTS
        : PRODUCTS.filter((p) => p.category === active),
    [active],
  );

  return (
    <>
      <section className="mx-auto max-w-[1400px] px-5 pb-16 pt-16 sm:px-8 md:pt-24">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">The Collection</p>
          <h1 className="display mt-5 text-5xl sm:text-6xl">Find your scent.</h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
            Small batches, hand-poured in our studio. Each one made to sit
            quietly in the background of a good day.
          </p>
        </Reveal>

        <Reveal className="mt-12 flex flex-wrap gap-2 md:mt-16" delay={80}>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActive(c)}
              aria-pressed={active === c}
              className={cn(
                "border px-4 py-2 text-[0.68rem] uppercase tracking-[0.18em] transition-colors duration-300",
                active === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-clay hover:text-foreground",
              )}
            >
              {c}
            </button>
          ))}
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 md:mt-14 md:grid-cols-3 md:gap-x-8 md:gap-y-16">
          {products.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 90}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>

        {products.length === 0 && (
          <p className="py-20 text-center text-sm text-muted-foreground">
            Nothing in this scent family just yet — more coming soon.
          </p>
        )}
      </section>

      <Newsletter />
    </>
  );
}
