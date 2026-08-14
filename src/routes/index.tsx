import { createFileRoute, Link } from "@tanstack/react-router";
import { Instagram } from "lucide-react";
import { PRODUCTS } from "@/data/products";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { Newsletter } from "@/components/site/Newsletter";
import heroImg from "@/assets/hero.jpg";
import introImg from "@/assets/intro.jpg";
import giftingImg from "@/assets/gifting.jpg";
import storyImg from "@/assets/story.jpg";
import pRose from "@/assets/p-rose.jpg";
import pVanilla from "@/assets/p-vanilla.jpg";
import pEucalyptus from "@/assets/p-eucalyptus.jpg";
import pSandalwood from "@/assets/p-sandalwood.jpg";
import pJasmine from "@/assets/p-jasmine.jpg";
import pGiftset from "@/assets/p-giftset.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Subtle Scents — Handcrafted Candles for Little Moments" },
      {
        name: "description",
        content:
          "Hand-poured, paraffin-free candles made to bring warmth, comfort and beautiful fragrance into your everyday moments.",
      },
      {
        property: "og:title",
        content: "Subtle Scents — Handcrafted Candles for Little Moments",
      },
      {
        property: "og:description",
        content:
          "Hand-poured, paraffin-free candles made to bring warmth and comfort into everyday moments.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const features = [
    {
      icon: "🌿",
      title: "Paraffin-Free",
      body: "Thoughtfully crafted for those who prefer more conscious candle choices.",
    },
    {
      icon: "🤍",
      title: "100% Handcrafted",
      body: "Every candle is hand-poured with care, making every piece uniquely special.",
    },
    {
      icon: "🌱",
      title: "Eco-Conscious",
      body: "Beautiful candles created with a mindful approach to luxury and sustainability.",
    },
    {
      icon: "✨",
      title: "Elegant Gifting",
      body: "A thoughtful little luxury for birthdays, celebrations, housewarmings and everything in between.",
    },
    {
      icon: "🌸",
      title: "Premium Fragrance",
      body: "Carefully selected fragrances designed to create a beautiful sensory experience.",
    },
    {
      icon: "🕯️",
      title: "Made With Love",
      body: "From the first pour to the final finish, every candle is created with care.",
    },
  ];

  // Placeholder testimonials — replace with real customer reviews.
  const testimonials = [
    {
      quote:
        "Beautifully packaged, smells incredible and instantly made my room feel warmer.",
      name: "Ananya R.",
      meta: "Rose Atelier",
    },
    {
      quote:
        "I bought it as a gift and ended up keeping it. The jar is lovely too.",
      name: "Meher K.",
      meta: "The Little Trio",
    },
    {
      quote: "Soft, not overpowering. It lasts far longer than I expected.",
      name: "Ishita S.",
      meta: "Vanilla Hour",
    },
    {
      quote: "Lights every evening now. It's become part of the routine.",
      name: "Naina T.",
      meta: "Sandalwood Dusk",
    },
  ];

  const feed = [
    { src: pRose, alt: "Rose candle styled with dried petals" },
    { src: introImg, alt: "Wax being poured by hand in the studio" },
    { src: pSandalwood, alt: "Ribbed sandalwood candle in warm evening light" },
    { src: giftingImg, alt: "Ribbon-tied candle gift box" },
    { src: pEucalyptus, alt: "Eucalyptus candle resting on soft linen" },
    { src: storyImg, alt: "Candle-making materials on a workbench" },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="grid items-center lg:min-h-[86vh] gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-0">
          <div className="order-2 px-5 pb-16 sm:px-8 lg:order-1 lg:py-24 lg:pl-[max(2rem,calc((100vw-1400px)/2+2rem))] lg:pr-14">
            <Reveal>
              <p className="eyebrow">Handcrafted candles</p>
              <h1 className="display mt-6 text-[3.1rem] leading-[1.02] sm:text-6xl lg:text-[5.2rem]">
                Little moments,
                <br />
                <em className="font-normal italic text-clay">made warmer.</em>
              </h1>
              <p className="mt-7 max-w-md text-sm leading-[1.9] text-muted-foreground sm:text-base">
                Handcrafted candles, thoughtfully created to bring warmth,
                comfort and a beautiful fragrance into your everyday moments.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link to="/shop" className="solid-btn">
                  Shop the Collection
                </Link>
                <Link to="/story" className="hairline-btn">
                  Discover Our Story
                </Link>
              </div>
            </Reveal>
          </div>

          <div className="relative order-1 lg:order-2 lg:h-[86vh]">
            <div
              className="candle-glow pointer-events-none absolute left-[18%] top-[24%] z-10 size-64 sm:size-80"
              aria-hidden
            />
            <div
              className="candle-glow float-slow pointer-events-none absolute right-[22%] top-[52%] z-10 size-40"
              aria-hidden
              style={{ animationDelay: "2s" }}
            />
            <img
              src={heroImg}
              alt="Handcrafted cream candles on warm linen in soft afternoon sunlight"
              width={1600}
              height={1200}
              fetchPriority="high"
              className="h-[40vh] w-full object-cover sm:h-[58vh] lg:h-full"
            />
          </div>
        </div>
      </section>

      {/* Brand intro */}
      <section className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 md:py-28">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-20">
          <Reveal>
            <img
              src={introImg}
              alt="Hands pouring wax into a ceramic candle vessel in a sunlit studio"
              loading="lazy"
              width={1200}
              height={1408}
              className="w-full object-cover"
            />
          </Reveal>
          <Reveal delay={120}>
            <p className="eyebrow">Subtle Scents</p>
            <h2 className="display mt-5 text-4xl sm:text-5xl">
              More than a candle.
              <br />
              A little moment of comfort.
            </h2>
            <div className="mt-7 space-y-5 text-sm leading-[1.9] text-muted-foreground sm:text-base">
              <p>
                At Subtle Scents, we believe a candle is more than just a source
                of fragrance — it's a little moment of comfort, warmth, and
                luxury.
              </p>
              <p>
                Each candle is 100% handcrafted with care, made with a focus on
                conscious choices, beautiful design, and premium fragrances.
              </p>
            </div>
            <Link to="/story" className="hairline-btn mt-9">
              Discover Our Story
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Collection */}
      <section
        className="border-y border-border bg-cream"
        aria-labelledby="collection-heading"
      >
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 md:py-28">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">The collection</p>
              <h2 id="collection-heading" className="display mt-4 text-4xl sm:text-5xl">
                Find your scent.
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground underline-offset-8 transition-colors hover:text-foreground hover:underline"
            >
              View all
            </Link>
          </Reveal>

          <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-12 md:mt-16 md:grid-cols-3 md:gap-x-8 md:gap-y-16">
            {PRODUCTS.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 90}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why Subtle Scents */}
      <section className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 md:py-28">
        <Reveal className="max-w-xl">
          <p className="eyebrow">Why Subtle Scents</p>
          <h2 className="display mt-5 text-4xl sm:text-5xl">
            Made with intention.
          </h2>
        </Reveal>

        <ul className="mt-14 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Reveal
              as="li"
              key={f.title}
              delay={(i % 3) * 80}
              className="border-t border-border pt-7"
            >
              <span className="text-xl" aria-hidden>
                {f.icon}
              </span>
              <h3 className="mt-4 font-serif text-2xl">{f.title}</h3>
              <p className="mt-2.5 max-w-xs text-sm leading-relaxed text-muted-foreground">
                {f.body}
              </p>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* Gifting */}
      <section className="relative border-y border-border bg-sand/50">
        <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-5 py-20 sm:px-8 md:grid-cols-[1.05fr_1fr] md:py-28">
          <Reveal className="relative">
            <div className="candle-glow pointer-events-none absolute -left-6 -top-8 size-44" aria-hidden />
            <img
              src={giftingImg}
              alt="Candle gift box with silk ribbon and dried blush flowers"
              loading="lazy"
              width={1408}
              height={1008}
              className="relative w-full object-cover"
            />
          </Reveal>
          <Reveal delay={120}>
            <p className="eyebrow">Gifting</p>
            <h2 className="display mt-5 text-4xl sm:text-5xl">
              A little luxury,
              <br />
              made to be gifted.
            </h2>
            <p className="mt-7 max-w-md text-sm leading-[1.9] text-muted-foreground sm:text-base">
              Whether it's a birthday, housewarming, festive celebration or
              simply a quiet way of saying "thinking of you" — make the moment a
              little more special.
            </p>
            <Link to="/gifting" className="solid-btn mt-9">
              Explore Gifting
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Our story */}
      <section className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 md:py-28">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-20">
          <Reveal>
            <p className="eyebrow">Our story</p>
            <h2 className="display mt-5 text-4xl sm:text-5xl">
              Hand-poured.
              <br />
              Thoughtfully made.
            </h2>
            <div className="mt-7 space-y-5 text-sm leading-[1.9] text-muted-foreground sm:text-base">
              <p>
                Subtle Scents was built around a simple idea — that everyday
                moments deserve to feel special. The pause before dinner. The
                hour that belongs to no one else.
              </p>
              <p>
                We pour in small batches, choose paraffin-free wax and cotton
                wicks, and finish every candle by hand. Beautiful enough to
                gift, gentle enough to live with.
              </p>
            </div>
            <Link to="/story" className="hairline-btn mt-9">
              Read our story
            </Link>
          </Reveal>
          <Reveal delay={0}>
            <img
              src={storyImg}
              alt="Wicks, wax and fragrance oils on a warm workbench"
              loading="lazy"
              width={1200}
              height={1408}
              className="w-full object-cover"
            />
          </Reveal>
        </div>
      </section>

      {/* Instagram */}
      <section
        className="border-y border-border bg-cream"
        aria-labelledby="instagram-heading"
      >
        <div className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 md:py-28">
          <Reveal className="text-center">
            <p className="eyebrow">@_subtlescents_</p>
            <h2 id="instagram-heading" className="display mt-4 text-4xl sm:text-5xl">
              Follow the glow.
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">
              Little moments from Subtle Scents.
            </p>
          </Reveal>

          <ul className="mt-12 grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-6">
            {feed.map((img, i) => (
              <Reveal as="li" key={img.alt} delay={(i % 6) * 60}>
                <a
                  href="https://www.instagram.com/_subtlescents_/"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group block overflow-hidden bg-background"
                  aria-label="Open Subtle Scents on Instagram"
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    width={1000}
                    height={1000}
                    className="aspect-square w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                  />
                </a>
              </Reveal>
            ))}
          </ul>

          <Reveal className="mt-10 text-center">
            <a
              href="https://www.instagram.com/_subtlescents_/"
              target="_blank"
              rel="noreferrer noopener"
              className="hairline-btn"
            >
              <Instagram className="size-4" strokeWidth={1.2} />
              Follow on Instagram
            </a>
          </Reveal>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 md:py-28">
        <Reveal className="max-w-xl">
          <p className="eyebrow">Reviews</p>
          <h2 className="display mt-5 text-4xl sm:text-5xl">
            Loved by candle lovers.
          </h2>
        </Reveal>

        <ul className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((t, i) => (
              <Reveal as="li" key={t.name} delay={(i % 4) * 70}>
              <p className="font-serif text-xl leading-snug">"{t.quote}"</p>
              <p className="mt-5 text-[0.7rem] uppercase tracking-[0.2em] text-clay">
                {t.name}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{t.meta}</p>
            </Reveal>
          ))}
        </ul>
        <p className="mt-12 text-xs text-muted-foreground">
          Placeholder reviews — to be replaced with real customer reviews.
        </p>
      </section>

      <Newsletter />
    </>
  );
}
