import { Link } from "@tanstack/react-router";
import { Minus, Plus, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export function CartDrawer() {
  const { cartOpen, setCartOpen, items, subtotal, setQty, remove } = useStore();

  return (
    <>
      <div
        onClick={() => setCartOpen(false)}
        aria-hidden={!cartOpen}
        className={cn(
          "fixed inset-0 z-[60] bg-charcoal/25 transition-opacity duration-500",
          cartOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={cn(
          "fixed right-0 top-0 z-[70] flex h-dvh w-full max-w-[420px] flex-col bg-background shadow-[0_0_60px_-20px_rgba(0,0,0,0.25)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          cartOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h2 className="font-serif text-xl">Your collection</h2>
          <button
            type="button"
            onClick={() => setCartOpen(false)}
            aria-label="Close cart"
            className="p-1 transition-opacity hover:opacity-60"
          >
            <X className="size-5" strokeWidth={1.2} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-10 text-center">
            <div className="relative">
              <div className="candle-glow absolute -inset-6" aria-hidden />
              <span className="relative text-3xl">🕯️</span>
            </div>
            <p className="font-serif text-2xl leading-snug">
              Your little collection is waiting.
            </p>
            <p className="text-sm text-muted-foreground">
              Find a scent that feels like home.
            </p>
            <Link
              to="/shop"
              onClick={() => setCartOpen(false)}
              className="hairline-btn mt-2"
            >
              Shop the collection
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-border overflow-y-auto px-6">
              {items.map(({ product, qty }) => (
                <li key={product.id} className="flex gap-4 py-5">
                  <Link
                    to="/product/$slug"
                    params={{ slug: product.slug }}
                    onClick={() => setCartOpen(false)}
                    className="shrink-0"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      loading="lazy"
                      width={1000}
                      height={1200}
                      className="h-24 w-20 object-cover"
                    />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        to="/product/$slug"
                        params={{ slug: product.slug }}
                        onClick={() => setCartOpen(false)}
                        className="font-serif text-lg leading-tight"
                      >
                        {product.name}
                      </Link>
                      <span className="text-sm">
                        {formatPrice(product.price * qty)}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {product.category}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center border border-border">
                        <button
                          type="button"
                          aria-label={`Decrease quantity of ${product.name}`}
                          onClick={() => setQty(product.id, qty - 1)}
                          className="px-2.5 py-1.5 transition-opacity hover:opacity-60"
                        >
                          <Minus className="size-3" strokeWidth={1.4} />
                        </button>
                        <span className="min-w-7 text-center text-xs">{qty}</span>
                        <button
                          type="button"
                          aria-label={`Increase quantity of ${product.name}`}
                          onClick={() => setQty(product.id, qty + 1)}
                          className="px-2.5 py-1.5 transition-opacity hover:opacity-60"
                        >
                          <Plus className="size-3" strokeWidth={1.4} />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(product.id)}
                        className="text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-border px-6 py-5">
              <div className="flex items-baseline justify-between">
                <span className="eyebrow">Subtotal</span>
                <span className="font-serif text-2xl">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Shipping and taxes calculated at checkout.
              </p>
              <Link
                to="/checkout"
                onClick={() => setCartOpen(false)}
                className="solid-btn mt-4 w-full text-center"
              >
                Proceed to Checkout
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
