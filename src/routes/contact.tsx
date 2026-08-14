import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Instagram, Mail, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Subtle Scents" },
      {
        name: "description",
        content:
          "Questions, custom orders or bulk gifting? Write to Subtle Scents by email, WhatsApp or Instagram.",
      },
      { property: "og:title", content: "Contact — Subtle Scents" },
      {
        property: "og:description",
        content:
          "Questions, custom orders or bulk gifting? We'd love to hear from you.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Message delivery isn't connected yet — wire this to a backend later.
    setSent(true);
    toast("Thank you for writing in 🤍", {
      description: "We usually reply within a day or two.",
    });
    e.currentTarget.reset();
  }

  return (
    <section className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 md:py-24">
      <div className="grid gap-14 md:grid-cols-2 md:gap-20">
        <Reveal>
          <p className="eyebrow">Say hello</p>
          <h1 className="display mt-5 text-5xl sm:text-6xl">
            We'd love to
            <br />
            hear from you.
          </h1>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
            Custom scents, bulk gifting, wedding favours, or simply a question
            about a candle — write to us and we'll answer personally.
          </p>

          <ul className="mt-10 space-y-5 text-sm">
            <li>
              <a
                href="mailto:hello@subtlescents.in"
                className="inline-flex items-center gap-3 transition-opacity hover:opacity-70"
              >
                <Mail className="size-4 text-clay" strokeWidth={1.2} />
                hello@subtlescents.in
              </a>
            </li>
            <li>
              <a
                href="https://wa.me/919000000000"
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-3 transition-opacity hover:opacity-70"
              >
                <MessageCircle className="size-4 text-clay" strokeWidth={1.2} />
                WhatsApp us
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/_subtlescents_/"
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-3 transition-opacity hover:opacity-70"
              >
                <Instagram className="size-4 text-clay" strokeWidth={1.2} />
                @_subtlescents_
              </a>
            </li>
          </ul>
        </Reveal>

        <Reveal delay={120}>
          <form onSubmit={onSubmit} className="space-y-5 bg-cream p-6 sm:p-10">
            <div>
              <label htmlFor="name" className="eyebrow">
                Your name
              </label>
              <input
                id="name"
                name="name"
                required
                className="mt-3 w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-clay"
              />
            </div>
            <div>
              <label htmlFor="email" className="eyebrow">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-3 w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-clay"
              />
            </div>
            <div>
              <label htmlFor="message" className="eyebrow">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                className="mt-3 w-full resize-none border border-border bg-background px-4 py-3 text-sm outline-none focus:border-clay"
              />
            </div>
            <button type="submit" className="solid-btn w-full">
              Send Message
            </button>
            <p className="text-xs text-muted-foreground">
              {sent
                ? "Message noted. Email delivery isn't connected yet — reach us directly meanwhile."
                : "We reply to every message personally."}
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
