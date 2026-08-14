import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const { add, toggleWish, isWished, setCartOpen } = useStore();
  const [pop, setPop] = useState(false);
  const wished = isWished(product.id);

  function addToCart() {
    add(product.id);
    setCartOpen(true);
    toast("Added to your little collection 🕯️", { description: product.name });
  }


  return (
    <article className="group flex flex-col">
      <div className="relative overflow-hidden bg-cream">
        <Link
          to="/product/$slug"
          params={{ slug: product.slug }}
          aria-label={`View ${product.name}`}
        >
          <img
            src={product.images[0]}
            alt={`${product.name} handcrafted candle`}
            loading="lazy"
            width={1000}
            height={1200}
            className="aspect-[5/6] w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.045]"
          />
        </Link>

        <button
          type="button"
          aria-label={
            wished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`
          }
          aria-pressed={wished}
          onClick={() => {
            toggleWish(product.id);
            setPop(true);
            setTimeout(() => setPop(false), 420);
          }}
          className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-background/80 backdrop-blur-[2px] transition-colors hover:bg-background"
        >
          <Heart
            className={cn(
              "size-4 transition-colors",
              wished ? "fill-clay text-clay" : "text-foreground",
              pop && "heart-pop",
            )}
            strokeWidth={1.2}
          />
        </button>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden translate-y-full p-3 opacity-0 transition-all duration-500 ease-out group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 md:block">
          <button type="button" onClick={addToCart} className="solid-btn w-full">
            Add to Cart
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-serif text-xl leading-tight">
            <Link to="/product/$slug" params={{ slug: product.slug }}>
              {product.name}
            </Link>
          </h3>
          <span className="text-sm text-muted-foreground">
            {formatPrice(product.price)}
          </span>
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          {product.tagline}
        </p>
        <button
          type="button"
          onClick={addToCart}
          className="hairline-btn mt-4 w-full md:hidden"
        >
          Add to Cart
        </button>
      </div>

    </article>
  );
}
