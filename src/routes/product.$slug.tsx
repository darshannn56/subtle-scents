import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Heart, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { getProduct, PRODUCTS } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { useStore } from "@/lib/store";
import { Reveal } from "@/components/site/Reveal";
import { ProductCard } from "@/components/site/ProductCard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Candle not found — Subtle Scents" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { product } = loaderData;
    const title = `${product.name} — Subtle Scents`;
    return {
      meta: [
        { title },
        { name: "description", content: product.tagline },
        { property: "og:title", content: title },
        { property: "og:description", content: product.tagline },
      ],
    };
  },
  component: ProductPage,
});


function ProductPage() {
  const { product } = Route.useLoaderData();
  const { add, toggleWish, isWished, setCartOpen } = useStore();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [pop, setPop] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>("Candle Care");
  const wished = isWished(product.id);

  const related = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  const sections = [
    {
      title: "Candle Care",
      body: "On the first burn, let the wax pool reach the edge — about two hours. Trim the wick to 5mm before each light. Never burn for more than four hours, and always on a heat-safe surface, away from draughts.",
    },
    {
      title: "Shipping & Delivery",
      body: "Hand-packed within 2 working days. Delivery across India in 3–6 working days. Gift orders arrive ribbon-tied with a note card. Free shipping on orders above ₹1,500.",
    },
    {
      title: "Ingredients / Materials",
      body: product.materials,
    },
  ];


  function addToCart(openCart: boolean) {
    add(product.id, qty);
    if (openCart) setCartOpen(true);
    toast("Added to your little collection 🕯️", {
      description: `${product.name} × ${qty}`,
    });
  }

  return (
    <>
      <nav
        aria-label="Breadcrumb"
        className="mx-auto max-w-[1400px] px-5 pt-8 text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground sm:px-8"
      >
        <Link to="/shop" className="transition-colors hover:text-foreground">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <section className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8 md:py-14">
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          {/* Gallery */}
          <div>
            <div className="overflow-hidden bg-cream">
              <img
                src={product.images[activeImg]}
                alt={`${product.name} handcrafted candle`}
                width={1000}
                height={1200}
                className="aspect-[5/6] w-full object-cover"
              />
            </div>
            <div className="mt-3 flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setActiveImg(i)}
                  aria-label={`View image ${i + 1} of ${product.name}`}
                  aria-current={activeImg === i}
                  className={cn(
                    "w-20 overflow-hidden border transition-colors",
                    activeImg === i ? "border-clay" : "border-transparent",
                  )}
                >
                  <img
                    src={img}
                    alt=""
                    loading="lazy"
                    width={1000}
                    height={1200}
                    className="aspect-[5/6] w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="md:pt-4">
            <p className="eyebrow">{product.category}</p>
            <h1 className="display mt-4 text-4xl sm:text-5xl">{product.name}</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {formatPrice(product.price)}
            </p>
            <p className="mt-6 max-w-md text-sm leading-[1.9] text-muted-foreground">
              {product.description}
            </p>

            <div className="mt-8 border-y border-border py-6">
              <p className="eyebrow">Fragrance Notes</p>
              <dl className="mt-4 space-y-2.5 text-sm">
                <div className="flex gap-4">
                  <dt className="w-16 shrink-0 text-muted-foreground">Top</dt>
                  <dd>{product.notes.top}</dd>
                </div>
                <div className="flex gap-4">
                  <dt className="w-16 shrink-0 text-muted-foreground">Heart</dt>
                  <dd>{product.notes.heart}</dd>
                </div>
                <div className="flex gap-4">
                  <dt className="w-16 shrink-0 text-muted-foreground">Base</dt>
                  <dd>{product.notes.base}</dd>
                </div>
              </dl>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <div className="flex items-center border border-border">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-3.5 py-3.5 transition-opacity hover:opacity-60"
                >
                  <Minus className="size-3.5" strokeWidth={1.4} />
                </button>
                <span className="min-w-9 text-center text-sm" aria-live="polite">
                  {qty}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQty((q) => q + 1)}
                  className="px-3.5 py-3.5 transition-opacity hover:opacity-60"
                >
                  <Plus className="size-3.5" strokeWidth={1.4} />
                </button>
              </div>

              <button
                type="button"
                onClick={() => addToCart(false)}
                className="hairline-btn flex-1 min-w-40"
              >
                Add to Cart
              </button>

              <button
                type="button"
                aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
                aria-pressed={wished}
                onClick={() => {
                  toggleWish(product.id);
                  setPop(true);
                  setTimeout(() => setPop(false), 420);
                }}
                className="grid size-[50px] place-items-center border border-border transition-colors hover:border-clay"
              >
                <Heart
                  className={cn(
                    "size-4",
                    wished ? "fill-clay text-clay" : "text-foreground",
                    pop && "heart-pop",
                  )}
                  strokeWidth={1.2}
                />
              </button>
            </div>

            <button
              type="button"
              onClick={() => addToCart(true)}
              className="solid-btn mt-3 w-full"
            >
              Buy Now
            </button>

            <div className="mt-10">
              <p className="eyebrow">Why you'll love it</p>
              <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                {product.loveIt.map((l) => (
                  <li key={l} className="flex gap-3">
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-clay" />
                    {l}
                  </li>
                ))}
              </ul>
            </div>

            <dl className="mt-10 grid grid-cols-2 gap-y-4 border-t border-border pt-6 text-sm">
              {product.details.map((d) => (
                <div key={d.label}>
                  <dt className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    {d.label}
                  </dt>
                  <dd className="mt-1">{d.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-10 border-t border-border">
              {sections.map((s) => {
                const open = openSection === s.title;
                return (
                  <div key={s.title} className="border-b border-border">
                    <button
                      type="button"
                      onClick={() => setOpenSection(open ? null : s.title)}
                      aria-expanded={open}
                      className="flex w-full items-center justify-between py-5 text-left"
                    >
                      <span className="font-serif text-xl">{s.title}</span>
                      <Plus
                        className={cn(
                          "size-4 transition-transform duration-300",
                          open && "rotate-45",
                        )}
                        strokeWidth={1.2}
                      />
                    </button>
                    <div
                      className={cn(
                        "grid transition-all duration-500 ease-out",
                        open
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0",
                      )}
                    >
                      <div className="overflow-hidden">
                        <p className="pb-6 text-sm leading-[1.9] text-muted-foreground">
                          {s.body}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 md:py-24">
        <Reveal>
          <h2 className="display text-3xl sm:text-4xl">You may also love</h2>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 md:gap-x-8">
          {related.map((p, i) => (
            <Reveal key={p.id} delay={i * 90}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
