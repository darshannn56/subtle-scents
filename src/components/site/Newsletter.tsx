import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Reveal } from "./Reveal";

export function Newsletter() {
  const [email, setEmail] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    // Newsletter storage isn't connected yet — wire this to a backend later.
    toast("Thank you for joining us 🤍", {
      description: "We'll be in touch when something lovely is ready.",
    });
    setEmail("");
  }

  return (
    <section className="border-y border-border bg-cream" aria-labelledby="newsletter-heading">
      <Reveal className="mx-auto max-w-2xl px-5 py-20 text-center sm:px-8 md:py-28">
        <p className="eyebrow">Newsletter</p>
        <h2 id="newsletter-heading" className="display mt-5 text-4xl sm:text-5xl">
          Stay in the glow.
        </h2>
        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
          New scents, thoughtful gifting ideas and little moments of inspiration
          — delivered occasionally.
        </p>
        <form
          onSubmit={onSubmit}
          className="mx-auto mt-9 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Your email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="w-full border border-border bg-background px-4 py-3.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-clay"
          />
          <button type="submit" className="solid-btn shrink-0">
            Join Us
          </button>
        </form>
      </Reveal>
    </section>
  );
}
