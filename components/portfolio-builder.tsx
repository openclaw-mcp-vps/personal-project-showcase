"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Copy, LoaderCircle, Sparkles } from "lucide-react";

import type { PortfolioRepo } from "@/lib/github-api";
import { GithubConnect, type GithubConnectValues } from "@/components/github-connect";
import { ProjectShowcase } from "@/components/project-showcase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const storySchema = z.object({
  brandHeadline: z
    .string()
    .min(20, "Write at least 20 characters so your pitch is clear.")
    .max(120, "Keep the headline under 120 characters."),
  targetRole: z.string().min(4, "Add the role or client type you want to attract.").max(80),
  narrative: z.string().min(40, "Give visitors useful context in at least 40 characters.").max(450)
});

type StoryValues = z.infer<typeof storySchema>;

export function PortfolioBuilder() {
  const [username, setUsername] = useState<string>("");
  const [repos, setRepos] = useState<PortfolioRepo[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveMessage, setSaveMessage] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<StoryValues>({
    resolver: zodResolver(storySchema),
    defaultValues: {
      brandHeadline: "I build production-ready side projects that solve real business bottlenecks.",
      targetRole: "Senior Full-Stack Engineer roles",
      narrative:
        "I focus on products that move from rough prototype to reliable release. Each project below demonstrates product judgment, strong engineering fundamentals, and measurable adoption signals."
    }
  });

  const selectedRepos = useMemo(() => repos.filter((repo) => selected.includes(repo.name)), [repos, selected]);

  async function handleConnect(values: GithubConnectValues) {
    setIsLoadingRepos(true);
    setSaveStatus("idle");
    setSaveMessage("");

    const response = await fetch(`/api/github/repos?username=${encodeURIComponent(values.username)}`, {
      headers: values.token
        ? {
            "x-github-token": values.token
          }
        : undefined,
      cache: "no-store"
    });

    setIsLoadingRepos(false);

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      throw new Error(payload.error ?? "Failed to fetch repositories.");
    }

    const payload = (await response.json()) as { repos: PortfolioRepo[] };
    setRepos(payload.repos);
    setSelected(payload.repos.slice(0, 4).map((repo) => repo.name));
    setUsername(values.username.toLowerCase());
  }

  function toggleRepo(name: string) {
    setSelected((current) => {
      if (current.includes(name)) {
        return current.filter((repoName) => repoName !== name);
      }

      if (current.length >= 6) {
        return current;
      }

      return [...current, name];
    });
  }

  const onSave = handleSubmit(async (values) => {
    if (!username) {
      setSaveStatus("error");
      setSaveMessage("Import repositories first so the portfolio has data.");
      return;
    }

    if (selected.length === 0) {
      setSaveStatus("error");
      setSaveMessage("Select at least one project to publish your portfolio page.");
      return;
    }

    setSaveStatus("saving");
    setSaveMessage("");

    const response = await fetch("/api/portfolio/config", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        selectedRepoNames: selected,
        brandHeadline: values.brandHeadline,
        targetRole: values.targetRole,
        narrative: values.narrative
      })
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      setSaveStatus("error");
      setSaveMessage(payload.error ?? "Could not save your portfolio configuration.");
      return;
    }

    setSaveStatus("saved");
    setSaveMessage("Portfolio configuration saved. Your public case-study page is live.");
  });

  const publicUrl = username ? `/portfolio/${username}` : "";

  return (
    <div className="space-y-8">
      <GithubConnect onConnect={handleConnect} />

      <Card className="border-[#30363d] bg-[#161b22]">
        <CardHeader>
          <CardTitle className="text-white">Select flagship projects</CardTitle>
          <CardDescription>
            Pick up to 6 repositories that best represent your technical range and product impact.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingRepos ? (
            <div className="flex items-center gap-2 text-sm text-[#8b949e]">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Pulling repositories and generating case studies...
            </div>
          ) : repos.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {repos.map((repo) => (
                <label
                  key={repo.id}
                  className="flex cursor-pointer items-start gap-3 rounded-lg border border-[#30363d] bg-[#0d1117] p-3 transition-colors hover:border-[#58a6ff]"
                >
                  <Checkbox checked={selected.includes(repo.name)} onChange={() => toggleRepo(repo.name)} />
                  <div>
                    <p className="text-sm font-medium text-white">{repo.name}</p>
                    <p className="mt-1 text-xs text-[#8b949e] line-clamp-2">{repo.description || "No description provided."}</p>
                  </div>
                </label>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#8b949e]">Import repositories to start building your showcase.</p>
          )}
        </CardContent>
      </Card>

      <Card className="border-[#30363d] bg-[#161b22]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Sparkles className="h-5 w-5 text-[#58a6ff]" />
            Positioning narrative
          </CardTitle>
          <CardDescription>
            This copy appears above your portfolio projects and helps employers understand your value quickly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSave} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="brandHeadline" className="text-sm font-medium text-[#c9d1d9]">
                Headline
              </label>
              <Input id="brandHeadline" {...register("brandHeadline")} />
              {errors.brandHeadline ? <p className="text-xs text-[#f85149]">{errors.brandHeadline.message}</p> : null}
            </div>

            <div className="space-y-2">
              <label htmlFor="targetRole" className="text-sm font-medium text-[#c9d1d9]">
                Target role or client profile
              </label>
              <Input id="targetRole" {...register("targetRole")} />
              {errors.targetRole ? <p className="text-xs text-[#f85149]">{errors.targetRole.message}</p> : null}
            </div>

            <div className="space-y-2">
              <label htmlFor="narrative" className="text-sm font-medium text-[#c9d1d9]">
                Context paragraph
              </label>
              <Textarea id="narrative" {...register("narrative")} rows={5} />
              {errors.narrative ? <p className="text-xs text-[#f85149]">{errors.narrative.message}</p> : null}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" disabled={saveStatus === "saving"}>
                {saveStatus === "saving" ? "Saving..." : "Publish portfolio"}
              </Button>
              {saveStatus === "saved" ? (
                <p className="inline-flex items-center gap-2 text-sm text-[#3fb950]">
                  <CheckCircle2 className="h-4 w-4" />
                  {saveMessage}
                </p>
              ) : null}
              {saveStatus === "error" ? <p className="text-sm text-[#f85149]">{saveMessage}</p> : null}
            </div>
          </form>

          {publicUrl ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 rounded-lg border border-[#30363d] bg-[#0d1117] p-4"
            >
              <p className="text-sm text-[#8b949e]">Public portfolio URL</p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <code className="rounded bg-[#161b22] px-2 py-1 text-sm text-[#c9d1d9]">{publicUrl}</code>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={async () => {
                    await navigator.clipboard.writeText(`${window.location.origin}${publicUrl}`);
                  }}
                  className="gap-2"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy link
                </Button>
              </div>
            </motion.div>
          ) : null}
        </CardContent>
      </Card>

      <ProjectShowcase repos={selectedRepos} />
    </div>
  );
}
