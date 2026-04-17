import Link from "next/link";
import { CheckoutButton } from "@/components/CheckoutButton";
import { getCheckoutUrl } from "@/lib/lemonsqueezy";
import { Card, CardContent } from "@/components/ui/card";

const faqItems = [
  {
    question: "How does this differ from a normal GitHub profile?",
    answer:
      "GitHub shows files and commits, not business value. Project Showcase generates clear case studies with technical metrics, architecture framing, and impact language you can send to recruiters or clients."
  },
  {
    question: "What do I need to get started?",
    answer:
      "Sign in with GitHub, sync your repositories, and choose the projects you want to feature. The app creates polished pages you can share as your portfolio link."
  },
  {
    question: "Can I publish multiple projects?",
    answer:
      "Yes. You can build a full portfolio from multiple repositories and keep it updated as your code evolves."
  }
];

export default function HomePage() {
  const checkoutUrl = getCheckoutUrl();

  return (
    <main className="min-h-screen bg-[#0d1117] text-[#c9d1d9]">
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-16 md:pt-24">
        <p className="mb-4 inline-flex rounded-full border border-[#30363d] bg-[#161b22] px-3 py-1 text-xs uppercase tracking-[0.16em] text-[#7d8590]">
          Portfolio Tools
        </p>
        <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white md:text-6xl">
          Beautiful portfolio for your side projects
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-[#9aa4af]">
          Project Showcase transforms your GitHub repos into premium case studies with metrics, outcomes, and narrative clarity so hiring managers and clients immediately understand your value.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <CheckoutButton
            checkoutUrl={checkoutUrl}
            className="rounded-lg bg-[#1f6feb] px-6 py-3 text-base font-semibold text-white transition hover:bg-[#388bfd]"
          />
          <Link
            href="/api/auth/github"
            className="rounded-lg border border-[#30363d] bg-[#161b22] px-6 py-3 text-base font-semibold text-[#c9d1d9] transition hover:border-[#58a6ff]"
          >
            Connect GitHub
          </Link>
        </div>
      </section>

      <section className="border-y border-[#21262d] bg-[#0f141b]">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-14 md:grid-cols-3">
          <Card>
            <CardContent>
            <h2 className="text-xl font-semibold text-white">The Problem</h2>
            <p className="mt-3 text-[#9aa4af]">
              Strong developers lose opportunities because raw repositories do not explain decision quality, business impact, or engineering maturity.
            </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
            <h2 className="text-xl font-semibold text-white">The Solution</h2>
            <p className="mt-3 text-[#9aa4af]">
              Convert code into clear project stories with architecture framing, velocity signals, quality scores, and recruiter-ready summaries.
            </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
            <h2 className="text-xl font-semibold text-white">The Buyer</h2>
            <p className="mt-3 text-[#9aa4af]">
              Mid-level developers who build side projects and want better roles or freelance clients without becoming marketing experts.
            </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-bold text-white">Pricing</h2>
        <div className="mt-6 rounded-2xl border border-[#1f6feb] bg-[#161b22] p-8">
          <p className="text-sm uppercase tracking-[0.15em] text-[#58a6ff]">Single plan</p>
          <p className="mt-3 text-5xl font-bold text-white">$7<span className="text-xl text-[#9aa4af]">/month</span></p>
          <ul className="mt-6 space-y-2 text-[#c9d1d9]">
            <li>Unlimited repository syncing</li>
            <li>AI-generated case study narratives</li>
            <li>Public portfolio page at `/portfolio/your-username`</li>
            <li>Technical metrics dashboard with weekly refresh</li>
          </ul>
          <CheckoutButton
            checkoutUrl={checkoutUrl}
            className="mt-8 rounded-lg bg-[#1f6feb] px-6 py-3 text-base font-semibold text-white transition hover:bg-[#388bfd]"
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <h2 className="text-3xl font-bold text-white">FAQ</h2>
        <div className="mt-6 space-y-4">
          {faqItems.map((item) => (
            <Card key={item.question}>
              <CardContent>
              <h3 className="text-lg font-semibold text-white">{item.question}</h3>
              <p className="mt-2 text-[#9aa4af]">{item.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
