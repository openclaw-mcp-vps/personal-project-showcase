"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type UnlockFormProps = {
  initialSessionId: string;
};

export function UnlockForm({ initialSessionId }: UnlockFormProps) {
  const router = useRouter();
  const [sessionId, setSessionId] = useState(initialSessionId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hasPaymentLink = useMemo(() => Boolean(process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK), []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    const response = await fetch("/api/paywall/claim", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ sessionId })
    });

    setIsSubmitting(false);

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      setError(payload.error ?? "We could not verify this payment session yet.");
      return;
    }

    setMessage("Payment verified. Redirecting to dashboard...");
    router.push("/dashboard");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-xl items-center px-6 py-10">
      <Card className="w-full border-[#30363d] bg-[#161b22]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Lock className="h-5 w-5 text-[#58a6ff]" />
            Unlock your builder access
          </CardTitle>
          <CardDescription>
            After Stripe checkout, paste your `session_id` from the success URL so we can verify payment and grant dashboard access.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <form onSubmit={onSubmit} className="space-y-3">
            <div className="space-y-2">
              <label htmlFor="sessionId" className="text-sm font-medium text-[#c9d1d9]">
                Stripe Checkout Session ID
              </label>
              <Input
                id="sessionId"
                placeholder="cs_test_..."
                value={sessionId}
                onChange={(event) => setSessionId(event.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Verifying payment..." : "Unlock dashboard"}
            </Button>
          </form>

          {message ? (
            <p className="inline-flex items-center gap-2 text-sm text-[#3fb950]">
              <ShieldCheck className="h-4 w-4" />
              {message}
            </p>
          ) : null}
          {error ? <p className="text-sm text-[#f85149]">{error}</p> : null}

          <div className="rounded-lg border border-[#30363d] bg-[#0d1117] p-4 text-sm text-[#8b949e]">
            <p className="font-medium text-[#c9d1d9]">Setup note for Stripe Payment Link</p>
            <p className="mt-2">
              In Stripe Payment Link settings, set your success URL to:
              <code className="mx-1 rounded bg-[#161b22] px-1 py-0.5 text-[#c9d1d9]">/unlock?session_id={"{CHECKOUT_SESSION_ID}"}</code>
              so buyers return with the session identifier.
            </p>
          </div>

          {hasPaymentLink ? (
            <a href={process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK} className="block">
              <Button variant="outline" className="w-full">
                Open Stripe checkout
              </Button>
            </a>
          ) : null}

          <Link href="/" className="block text-center text-sm text-[#58a6ff] hover:text-[#79c0ff]">
            Back to landing page
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
