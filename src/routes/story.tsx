import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import { Newsletter } from "@/components/site/Newsletter";
import storyImg from "@/assets/story.jpg";
import introImg from "@/assets/intro.jpg";

export const Route = createFileRoute("/story")({
  head: () => ({
    meta: [
      { title: "Our Story — Subtle Scents" },
      {
        name: "description",
        content:
          "Hand-poured, thoughtfully made. The story behind Subtle Scents — craftsmanship, conscious choices and premium fragrance.",
      },
      { property: "og:title", content: "Our Story — Subtle Scents" },
      {
        property: "og:description",
        content:
          "Hand-poured, thoughtfully made. The story behind Subtle Scents.",
      },
    ],
  }),
  component: StoryPage,
});

const VALUES = [
  {
    title: "Handmade craftsmanship",
    body: "Every candle is poured, set and finished by hand, in batches small enough to check each one.",
  },
  {
    title: "Attention to detail",
    body: "Wick placement, wax temperature, the weight of the lid — the small things are the whole thing.",
  },
  {
    title: "Conscious choices",
    body: "Paraffin-free wax, cotton wicks and vessels made to be kept long after the wax is gone.",
  },
  {
    title: "Premium fragrance",
    body: "Blends built in layers, tested over weeks, and kept soft enough to live with every day.",
  },
];

function StoryPage() {
  return (
    <>
      <section className="mx-auto max-w-[1400px] px-5 pb-16 pt-16 sm:px-8 md:pt-24">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-20">
          <Reveal>
            <p className="eyebrow">Our story</p>
            <h1 className="display mt-5 text-5xl sm:text-6xl lg:text-7xl">
              Hand-poured.
              <br />
              Thoughtfully made.
            </h1>
            <div className="mt-8 space-y-5 text-sm leading-[1.9] text-muted-foreground sm:text-base">
              <p>
                Subtle Scents began with a simple belief — that ordinary days
                deserve to feel a little special. A candle lit before dinner. A
                quiet hour with a book. A room that feels like it's been waiting
                for you.
              </p>
              <p>
                We work in small batches, pouring by hand and finishing each
                candle ourselves. Nothing is rushed, because the point was never
                to make more — it was to make something worth keeping.
              </p>
              <p>
                Every scent is built slowly, tested over weeks, and kept soft on
                purpose. Beautiful enough to gift. Gentle enough to live with.
              </p>
            </div>
            <Link to="/shop" className="hairline-btn mt-10">
              Shop the collection
            </Link>
          </Reveal>

          <Reveal delay={120} className="relative">
            <div className="candle-glow pointer-events-none absolute -left-8 top-1/4 size-56" aria-hidden />
            <img
              src={storyImg}
              alt="Candle-making materials on a warm workbench in soft morning light"
              loading="lazy"
              width={1200}
              height={1408}
              className="relative w-full object-cover"
            />
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 md:py-24">
        <div className="grid gap-12 md:grid-cols-[1fr_1.1fr] md:items-center md:gap-20">
          <Reveal className="order-2 md:order-1">
            <img
              src={introImg}
              alt="Hands pouring wax into a ceramic candle vessel"
              loading="lazy"
              width={1200}
              height={1408}
              className="w-full object-cover"
            />
          </Reveal>
          <div className="order-1 md:order-2">
            <Reveal>
              <p className="eyebrow">What we care about</p>
              <h2 className="display mt-5 text-4xl sm:text-5xl">
                The details you
                <br />
                can't see, but feel.
              </h2>
            </Reveal>
            <dl className="mt-10 divide-y divide-border border-y border-border">
              {VALUES.map((v, i) => (
                <Reveal key={v.title} delay={i * 70} className="py-6">
                  <dt className="font-serif text-2xl">{v.title}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {v.body}
                  </dd>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  );
}
