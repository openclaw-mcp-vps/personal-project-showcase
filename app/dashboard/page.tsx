import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";

import { PortfolioBuilder } from "@/components/portfolio-builder";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const hasAccess = cookieStore.get("pps_access")?.value === "granted";

  if (!hasAccess) {
    redirect("/unlock");
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-6 py-14">
      <div className="mb-10 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-[#30363d] bg-[#161b22] px-3 py-1 text-xs text-[#8b949e]">
            <ShieldCheck className="h-3.5 w-3.5 text-[#3fb950]" />
            Paid access enabled
          </p>
          <h1 className="mt-4 text-4xl font-bold text-white">Portfolio Builder Dashboard</h1>
          <p className="mt-2 max-w-3xl text-[#8b949e]">
            Connect your GitHub account, choose your strongest repos, generate case studies, and publish a portfolio that communicates technical value to decision-makers.
          </p>
        </div>

        <Link href="/">
          <Button variant="outline">Back to landing page</Button>
        </Link>
      </div>

      <PortfolioBuilder />
    </main>
  );
}
