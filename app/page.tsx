import Link from "next/link";
import { ArrowRight, CheckCircle2, FileCode2, LayoutTemplate, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const faqs = [
  {
    question: "What does Project Showcase actually build for me?",
    answer:
      "You get a public portfolio page that translates raw repository data into clear case studies: project goals, architecture decisions, measurable traction, and stack depth."
  },
  {
    question: "Do I need design skills to make this look good?",
    answer:
      "No. The product is built for developers who can code but struggle with positioning. It generates structured narratives and a polished visual layout by default."
  },
  {
    question: "Can I choose which repositories appear publicly?",
    answer:
      "Yes. You select your flagship repos, customize your headline and positioning, and publish only the work that supports your career goals."
  },
  {
    question: "How does payment work?",
    answer:
      "Payment is handled by Stripe hosted checkout. After payment, your account unlocks and you can access the builder dashboard behind a cookie-based paywall."
  }
];

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-20 md:pt-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="inline-flex items-center rounded-full border border-[#30363d] bg-[#161b22] px-3 py-1 text-xs text-[#8b949e]">
              Portfolio Tools • $7/month
            </p>
            <h1 className="mt-6 text-4xl font-bold leading-tight text-white md:text-6xl">
              Beautiful portfolio for your side projects
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#8b949e]">
              GitHub repositories prove you can code. They do not prove product thinking, communication, or delivery impact. Project Showcase
              turns your repos into persuasive case studies that help hiring managers and clients see your real value.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href={process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK}>
                <Button size="lg" className="gap-2">
                  Start for $7/month
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
              <Link href="/unlock">
                <Button size="lg" variant="outline">
                  I already paid
                </Button>
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-4 text-sm text-[#8b949e]">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#3fb950]" />
                GitHub import in seconds
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#3fb950]" />
                Narrative case-study generation
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#3fb950]" />
                Public shareable portfolio URL
              </span>
            </div>
          </div>

          <Card className="border-[#30363d] bg-[#161b22]">
            <CardHeader>
              <CardTitle className="text-white">What recruiters see</CardTitle>
              <CardDescription>From unreadable commit history to a concise value story in under 5 minutes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="rounded-lg border border-[#30363d] bg-[#0d1117] p-3">
                <p className="font-medium text-white">Before</p>
                <p className="mt-1 text-[#8b949e]">List of repositories with no context, no outcomes, and no explanation of tradeoffs.</p>
              </div>
              <div className="rounded-lg border border-[#238636]/40 bg-[#0d1117] p-3">
                <p className="font-medium text-white">After</p>
                <p className="mt-1 text-[#8b949e]">
                  Structured project pages with stack depth, architecture choices, impact metrics, and links to source + demos.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="border-y border-[#21262d] bg-[#0d1117]/70">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-14 md:grid-cols-3">
          <Card className="border-[#30363d] bg-[#161b22]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <FileCode2 className="h-5 w-5 text-[#58a6ff]" />
                The Problem
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-[#8b949e]">
              Strong engineers lose opportunities because raw repositories fail to communicate product outcomes, technical leadership, and business relevance.
            </CardContent>
          </Card>

          <Card className="border-[#30363d] bg-[#161b22]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <LayoutTemplate className="h-5 w-5 text-[#58a6ff]" />
                The Solution
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-[#8b949e]">
              Automated case-study generation combines GitHub metadata, code metrics, and customizable messaging into a portfolio designed for decision-makers.
            </CardContent>
          </Card>

          <Card className="border-[#30363d] bg-[#161b22]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <TrendingUp className="h-5 w-5 text-[#58a6ff]" />
                Why It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-[#8b949e]">
              Hiring teams scan quickly. This format surfaces impact signals immediately, making your work easier to evaluate and easier to remember.
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div>
            <h2 className="text-3xl font-semibold text-white">Simple pricing for serious developers</h2>
            <p className="mt-3 text-[#8b949e]">
              One plan focused on getting your portfolio interview-ready. No feature gating inside the builder.
            </p>
          </div>

          <Card className="border-[#238636]/40 bg-[#161b22]">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Pro Portfolio</CardTitle>
              <CardDescription>Everything you need to turn side projects into opportunities.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-white">
                $7<span className="text-base font-medium text-[#8b949e]">/month</span>
              </p>
              <ul className="mt-5 space-y-2 text-sm text-[#c9d1d9]">
                <li>Unlimited repository imports</li>
                <li>Case-study narrative generation</li>
                <li>Custom portfolio headline and positioning</li>
                <li>Public portfolio URL for resumes and outreach</li>
              </ul>
              <a href={process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK} className="mt-6 block">
                <Button className="w-full" size="lg">
                  Buy now
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="text-3xl font-semibold text-white">FAQ</h2>
        <div className="mt-8 grid gap-4">
          {faqs.map((faq) => (
            <Card key={faq.question} className="border-[#30363d] bg-[#161b22]">
              <CardHeader>
                <CardTitle className="text-lg text-white">{faq.question}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-[#8b949e]">{faq.answer}</CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
