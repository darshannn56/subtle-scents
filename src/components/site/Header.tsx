import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Our Story", to: "/story" },
  { label: "Gifting", to: "/gifting" },
  { label: "Contact", to: "/contact" },
] as const;

export function Header() {
  const { count, setCartOpen } = useStore();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pop, setPop] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (count === 0) return;
    setPop(true);
    const t = setTimeout(() => setPop(false), 400);
    return () => clearTimeout(t);
  }, [count]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        scrolled || open
          ? "border-b border-border bg-background/92 backdrop-blur-sm"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 sm:h-20 sm:px-8">
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="-ml-2 p-2 text-foreground transition-opacity hover:opacity-60 md:hidden"
        >
          {open ? (
            <X className="size-5" strokeWidth={1.2} />
          ) : (
            <Menu className="size-5" strokeWidth={1.2} />
          )}
        </button>

        <nav className="hidden items-center gap-9 md:flex" aria-label="Primary">
          {NAV.slice(0, 3).map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <Link
          to="/"
          className="absolute left-1/2 -translate-x-1/2 text-center"
          aria-label="Subtle Scents — home"
        >
          <span className="block font-serif text-[1.35rem] leading-none tracking-[0.06em] sm:text-[1.6rem]">
            Subtle Scents
          </span>
          <span className="mt-1 hidden text-[0.55rem] uppercase tracking-[0.4em] text-muted-foreground sm:block">
            Hand-poured
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <nav className="hidden items-center gap-9 md:flex" aria-label="Secondary">
            {NAV.slice(3).map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "text-foreground" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
            className="relative -mr-2 p-2 transition-opacity hover:opacity-60"
          >
            <ShoppingBag className="size-5" strokeWidth={1.2} />
            {count > 0 && (
              <span
                className={cn(
                  "absolute right-0 top-0 grid size-4 place-items-center rounded-full bg-primary text-[0.6rem] text-primary-foreground",
                  pop && "count-pop",
                )}
              >
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden border-t border-border bg-background transition-[max-height] duration-500 ease-out md:hidden",
          open ? "max-h-96" : "max-h-0 border-t-transparent",
        )}
      >
        <nav className="flex flex-col px-5 py-4" aria-label="Mobile">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className="border-b border-border/60 py-4 font-serif text-2xl last:border-0"
              activeProps={{ className: "text-clay" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
