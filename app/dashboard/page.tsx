import Link from "next/link";
import { cookies } from "next/headers";
import { DashboardClient } from "@/components/DashboardClient";
import { getShowcase } from "@/lib/supabase";
import { getCheckoutUrl } from "@/lib/lemonsqueezy";
import { CheckoutButton } from "@/components/CheckoutButton";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const hasPaidAccess = cookieStore.get("pps_paid")?.value === "1";
  const githubConnected = Boolean(cookieStore.get("gh_token")?.value);

  if (!hasPaidAccess) {
    return (
      <main className="mx-auto min-h-screen max-w-4xl px-6 py-16 text-[#c9d1d9]">
        <Card className="rounded-2xl">
          <CardContent className="p-8">
          <h1 className="text-3xl font-bold text-white">Portfolio Builder is locked</h1>
          <p className="mt-3 text-[#9aa4af]">
            Your subscription unlocks repository sync, portfolio generation, and your public showcase page.
          </p>
          <CheckoutButton
            checkoutUrl={getCheckoutUrl()}
            className="mt-6 rounded-lg bg-[#1f6feb] px-6 py-3 text-base font-semibold text-white transition hover:bg-[#388bfd]"
          />
          <p className="mt-4 text-sm text-[#7d8590]">After checkout success, access is granted automatically in this browser.</p>
          </CardContent>
        </Card>
      </main>
    );
  }

  if (!githubConnected) {
    return (
      <main className="mx-auto min-h-screen max-w-4xl px-6 py-16 text-[#c9d1d9]">
        <Card className="rounded-2xl">
          <CardContent className="p-8">
          <h1 className="text-3xl font-bold text-white">Connect GitHub to continue</h1>
          <p className="mt-3 text-[#9aa4af]">Repository data powers your metrics and case-study generation.</p>
          <Link
            href="/api/auth/github"
            className={buttonVariants({ size: "lg", className: "mt-6 inline-flex" })}
          >
            Connect GitHub Account
          </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  const username = cookieStore.get("gh_username")?.value;
  const initialData = username ? await getShowcase(username) : null;

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-10 text-[#c9d1d9]">
      <DashboardClient initialData={initialData} />
    </main>
  );
}
