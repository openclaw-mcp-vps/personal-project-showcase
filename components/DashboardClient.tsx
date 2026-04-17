"use client";

import { useMemo, useState } from "react";
import type { DashboardPayload, ShowcaseProject } from "@/types";
import { RepoCard } from "@/components/RepoCard";
import { ProjectShowcase } from "@/components/ProjectShowcase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type DashboardClientProps = {
  initialData: DashboardPayload | null;
};

export function DashboardClient({ initialData }: DashboardClientProps) {
  const [data, setData] = useState<DashboardPayload | null>(initialData);
  const [selected, setSelected] = useState<ShowcaseProject | null>(initialData?.projects[0] ?? null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const projectCountText = useMemo(() => {
    if (!data) {
      return "No projects synced yet.";
    }

    return `${data.projects.length} project${data.projects.length === 1 ? "" : "s"} available in your showcase.`;
  }, [data]);

  async function syncRepos() {
    setIsSyncing(true);
    setError(null);

    try {
      const response = await fetch("/api/repos/sync", { method: "POST" });
      const payload = (await response.json()) as DashboardPayload | { error: string };

      if (!response.ok || "error" in payload) {
        setError("error" in payload ? payload.error : "Unable to sync repositories right now.");
        return;
      }

      setData(payload);
      setSelected(payload.projects[0] ?? null);
    } catch {
      setError("Network error while syncing repositories.");
    } finally {
      setIsSyncing(false);
    }
  }

  return (
    <section className="space-y-6">
      <Card>
        <CardContent>
        <h1 className="text-2xl font-semibold text-white">Portfolio Dashboard</h1>
        <p className="mt-2 text-[#9aa4af]">{projectCountText}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button
            type="button"
            onClick={syncRepos}
            disabled={isSyncing}
          >
            {isSyncing ? "Syncing repositories..." : "Sync GitHub repositories"}
          </Button>
          {data?.username ? (
            <a
              href={`/portfolio/${data.username}`}
              className="rounded-lg border border-[#30363d] bg-[#0d1117] px-5 py-2.5 text-sm font-semibold text-[#c9d1d9] transition hover:border-[#58a6ff]"
            >
              View live portfolio
            </a>
          ) : null}
        </div>
        {error ? <p className="mt-3 text-sm text-[#ff7b72]">{error}</p> : null}
        </CardContent>
      </Card>

      {data ? (
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1.4fr]">
          <div className="space-y-3">
            {data.projects.map((project) => (
              <RepoCard key={project.repo.id} project={project} onSelect={setSelected} />
            ))}
          </div>
          <div>{selected ? <ProjectShowcase project={selected} /> : null}</div>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-[#30363d] bg-[#161b22] p-6 text-[#9aa4af]">
          Connect GitHub and sync your repos to generate your first project showcase.
        </div>
      )}
    </section>
  );
}
