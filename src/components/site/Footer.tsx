import { Link } from "@tanstack/react-router";
import { Instagram } from "lucide-react";

const NAV = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Our Story", to: "/story" },
  { label: "Gifting", to: "/gifting" },
  { label: "Contact", to: "/contact" },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border bg-cream">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-16 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr] md:py-20">
        <div className="max-w-sm">
          <p className="font-serif text-3xl tracking-[0.04em]">Subtle Scents</p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Thoughtfully crafted. Beautifully scented. Made to make every moment
            special.
          </p>
        </div>

        <nav aria-label="Footer">
          <p className="eyebrow">Explore</p>
          <ul className="mt-5 space-y-3">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link
                  to={n.to}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="eyebrow">Say hello</p>
          <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
            <li>
              <a
                href="mailto:hello@subtlescents.in"
                className="transition-colors hover:text-foreground"
              >
                hello@subtlescents.in
              </a>
            </li>
            <li>
              <a
                href="https://wa.me/919000000000"
                target="_blank"
                rel="noreferrer noopener"
                className="transition-colors hover:text-foreground"
              >
                WhatsApp
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/_subtlescents_/"
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
              >
                <Instagram className="size-4" strokeWidth={1.2} />
                @_subtlescents_
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] border-t border-border px-5 py-6 sm:px-8">
        <p className="text-[0.7rem] tracking-[0.14em] text-muted-foreground">
          © 2026 Subtle Scents. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
