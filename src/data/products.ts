/**
 * Subtle Scents — product catalogue.
 *
 * This file is the single source of truth for the shop. Replace these
 * placeholder products with real Subtle Scents products by editing the array
 * below — no UI changes required. Images live in `src/assets/`.
 */
import rose from "@/assets/p-rose.jpg";
import vanilla from "@/assets/p-vanilla.jpg";
import eucalyptus from "@/assets/p-eucalyptus.jpg";
import sandalwood from "@/assets/p-sandalwood.jpg";
import jasmine from "@/assets/p-jasmine.jpg";
import giftset from "@/assets/p-giftset.jpg";

export const CATEGORIES = [
  "All",
  "Floral",
  "Sweet",
  "Fresh",
  "Woody",
  "Gifting",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type Product = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  price: number;
  category: Exclude<Category, "All">;
  images: string[];
  notes: { top: string; heart: string; base: string };
  description: string;
  loveIt: string[];
  details: { label: string; value: string }[];
  materials: string;
};

/** Prices are in INR. Adjust `formatPrice` in `src/lib/format.ts` to change currency. */
export const PRODUCTS: Product[] = [
  {
    id: "ss-01",
    slug: "rose-atelier",
    name: "Rose Atelier",
    tagline: "Soft garden rose, warm petals and a whisper of musk.",
    price: 890,
    category: "Floral",
    images: [rose, jasmine, giftset],
    notes: {
      top: "Dew, pink pepper",
      heart: "Garden rose, peony",
      base: "White musk, soft amber",
    },
    description:
      "A quiet bouquet caught in early light. Rose Atelier opens with cool dew and settles into powdery petals — the kind of scent that makes a room feel loved in.",
    loveIt: [
      "Gentle enough for bedrooms and reading corners",
      "Hand-poured in a reusable ceramic vessel",
      "Even, soot-free burn from a cotton wick",
    ],
    details: [
      { label: "Burn time", value: "Approx. 40 hours" },
      { label: "Weight", value: "200 g" },
      { label: "Wick", value: "Single cotton wick" },
      { label: "Vessel", value: "Hand-glazed ceramic" },
    ],
    materials:
      "Paraffin-free plant wax blend, cotton wick, phthalate-free fragrance oils, hand-glazed ceramic vessel.",
  },
  {
    id: "ss-02",
    slug: "vanilla-hour",
    name: "Vanilla Hour",
    tagline: "Slow vanilla, cinnamon warmth and toasted sugar.",
    price: 850,
    category: "Sweet",
    images: [vanilla, giftset, rose],
    notes: {
      top: "Cinnamon bark",
      heart: "Bourbon vanilla, tonka",
      base: "Caramel, warm woods",
    },
    description:
      "The scent of an unhurried evening. Vanilla Hour is soft and edible without being heavy — a candle for slow dinners and long conversations.",
    loveIt: [
      "Comforting warmth for living rooms and kitchens",
      "Balanced sweetness that never turns cloying",
      "A quiet favourite for winter evenings",
    ],
    details: [
      { label: "Burn time", value: "Approx. 40 hours" },
      { label: "Weight", value: "200 g" },
      { label: "Wick", value: "Single cotton wick" },
      { label: "Vessel", value: "Matte stoneware" },
    ],
    materials:
      "Paraffin-free plant wax blend, cotton wick, phthalate-free fragrance oils, matte stoneware vessel.",
  },
  {
    id: "ss-03",
    slug: "morning-linen",
    name: "Morning Linen",
    tagline: "Eucalyptus, cool cotton and a clean breath of air.",
    price: 820,
    category: "Fresh",
    images: [eucalyptus, rose, giftset],
    notes: {
      top: "Eucalyptus, bergamot",
      heart: "Cotton flower, green tea",
      base: "Soft cedar",
    },
    description:
      "Windows open, sheets on the line. Morning Linen is crisp and quietly green — the reset button for a room that needs to breathe.",
    loveIt: [
      "Refreshing for bathrooms and workspaces",
      "Clean without smelling like a detergent",
      "Pairs beautifully with morning light",
    ],
    details: [
      { label: "Burn time", value: "Approx. 40 hours" },
      { label: "Weight", value: "200 g" },
      { label: "Wick", value: "Single cotton wick" },
      { label: "Vessel", value: "Frosted glass" },
    ],
    materials:
      "Paraffin-free plant wax blend, cotton wick, phthalate-free fragrance oils, frosted glass vessel.",
  },
  {
    id: "ss-04",
    slug: "sandalwood-dusk",
    name: "Sandalwood Dusk",
    tagline: "Creamy sandalwood, dry cedar and a trace of smoke.",
    price: 950,
    category: "Woody",
    images: [sandalwood, vanilla, giftset],
    notes: {
      top: "Black pepper",
      heart: "Sandalwood, cedar",
      base: "Vetiver, soft smoke",
    },
    description:
      "Grounded and a little mysterious. Sandalwood Dusk fills a room the way low light does — slowly, and all the way to the corners.",
    loveIt: [
      "Deep, lingering throw for larger rooms",
      "Warm and unisex — a considered gift",
      "Beautiful ribbed vessel worth keeping",
    ],
    details: [
      { label: "Burn time", value: "Approx. 45 hours" },
      { label: "Weight", value: "220 g" },
      { label: "Wick", value: "Single cotton wick" },
      { label: "Vessel", value: "Ribbed ceramic" },
    ],
    materials:
      "Paraffin-free plant wax blend, cotton wick, phthalate-free fragrance oils, ribbed ceramic vessel.",
  },
  {
    id: "ss-05",
    slug: "jasmine-letters",
    name: "Jasmine Letters",
    tagline: "Night jasmine, soft neroli and powdered blossom.",
    price: 880,
    category: "Floral",
    images: [jasmine, rose, eucalyptus],
    notes: {
      top: "Neroli",
      heart: "Night jasmine, orange blossom",
      base: "Powder, light musk",
    },
    description:
      "Written like a note left on a pillow. Jasmine Letters is romantic and airy — floral, but never sharp.",
    loveIt: [
      "Delicate florals that stay soft as they burn",
      "A favourite for anniversaries and birthdays",
      "Pretty enough to leave out on display",
    ],
    details: [
      { label: "Burn time", value: "Approx. 38 hours" },
      { label: "Weight", value: "190 g" },
      { label: "Wick", value: "Single cotton wick" },
      { label: "Vessel", value: "Tinted glass" },
    ],
    materials:
      "Paraffin-free plant wax blend, cotton wick, phthalate-free fragrance oils, tinted glass vessel.",
  },
  {
    id: "ss-06",
    slug: "the-little-trio",
    name: "The Little Trio",
    tagline: "Three mini candles, ribbon-tied and ready to give.",
    price: 1650,
    category: "Gifting",
    images: [giftset, rose, vanilla],
    notes: {
      top: "Rose, vanilla, linen",
      heart: "A little of everything we love",
      base: "Soft musk, warm wood",
    },
    description:
      "Our three most-loved scents in miniature, nested in tissue and tied with silk ribbon. The easiest way to say thinking of you.",
    loveIt: [
      "Arrives gift-ready — no wrapping needed",
      "A gentle introduction to the collection",
      "Add a handwritten note at checkout",
    ],
    details: [
      { label: "Contents", value: "3 × 60 g mini candles" },
      { label: "Burn time", value: "Approx. 12 hours each" },
      { label: "Packaging", value: "Rigid box, silk ribbon" },
      { label: "Note card", value: "Included" },
    ],
    materials:
      "Paraffin-free plant wax blend, cotton wicks, phthalate-free fragrance oils, recyclable rigid gift box.",
  },
];

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}
