import type { Metadata } from "next";
import Link from "next/link";

import { ProjectShowcase } from "@/components/project-showcase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buildPortfolioRepos } from "@/lib/github-api";
import { getPortfolioConfig } from "@/lib/supabase";

type PortfolioPageProps = {
  params: Promise<{
    username: string;
  }>;
};

export async function generateMetadata({ params }: PortfolioPageProps): Promise<Metadata> {
  const { username } = await params;

  return {
    title: `${username}'s Project Portfolio`,
    description: `Professional side-project case studies for ${username}, generated from GitHub repositories and curated for hiring managers and freelance clients.`,
    openGraph: {
      title: `${username}'s Project Portfolio`,
      description: `Explore ${username}'s project case studies, code metrics, and technical impact stories.`
    }
  };
}

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const { username } = await params;
  const normalized = username.toLowerCase();
  const config = await getPortfolioConfig(normalized);
  let repos = await buildPortfolioRepos(normalized).catch(() => []);

  if (repos.length === 0) {
    repos = [];
  }

  const visibleRepos = config?.selectedRepoNames?.length
    ? repos.filter((repo) => config.selectedRepoNames.includes(repo.name))
    : repos.slice(0, 4);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-14">
      <div className="mb-10 flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge variant="secondary">Public Portfolio</Badge>
          <h1 className="mt-4 text-4xl font-bold text-white">{config?.brandHeadline ?? `${normalized}'s Side Project Showcase`}</h1>
          <p className="mt-3 max-w-3xl text-[#8b949e]">
            {config?.narrative ??
              `This page highlights the projects ${normalized} shipped, the technical depth behind them, and the real impact signals employers and clients look for.`}
          </p>
          <p className="mt-2 text-sm text-[#8b949e]">Best aligned for: {config?.targetRole ?? "Full-stack engineering opportunities"}</p>
        </div>

        <Link href="/">
          <Button variant="outline">Create your own portfolio</Button>
        </Link>
      </div>

      <ProjectShowcase repos={visibleRepos} heading="Featured Project Case Studies" />

      {visibleRepos.length === 0 ? (
        <p className="mt-8 text-sm text-[#8b949e]">
          No public repositories could be loaded for this username yet. Import and publish projects from the dashboard to populate this page.
        </p>
      ) : null}
    </main>
  );
}
