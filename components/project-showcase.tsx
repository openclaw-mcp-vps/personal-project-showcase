"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowUpRight, ExternalLink, GitBranch, Star } from "lucide-react";

import type { PortfolioRepo } from "@/lib/github-api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const METRIC_COLORS: Record<string, string> = {
  impact: "#58a6ff",
  maintenance: "#3fb950",
  momentum: "#d29922"
};

type ProjectShowcaseProps = {
  repos: PortfolioRepo[];
  heading?: string;
};

export function ProjectShowcase({ repos, heading = "Generated Project Case Studies" }: ProjectShowcaseProps) {
  if (repos.length === 0) {
    return null;
  }

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-white">{heading}</h2>
        <p className="mt-1 text-sm text-[#8b949e]">
          Each case study combines repository signals with a narrative that recruiters and clients can understand quickly.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {repos.map((repo) => {
          const chartData = [
            { name: "Impact", value: repo.metrics.impactScore, fill: METRIC_COLORS.impact },
            { name: "Maintenance", value: repo.metrics.maintenanceScore, fill: METRIC_COLORS.maintenance },
            { name: "Momentum", value: repo.metrics.momentumScore, fill: METRIC_COLORS.momentum }
          ];

          return (
            <Card key={repo.id} className="overflow-hidden border-[#30363d] bg-[#161b22]">
              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg text-white">{repo.name}</CardTitle>
                    <CardDescription className="mt-1 line-clamp-2">{repo.description || "A production-grade side project."}</CardDescription>
                  </div>

                  <Badge variant="secondary">{repo.metrics.marketReadiness}</Badge>
                </div>

                <div className="flex flex-wrap gap-2">
                  {repo.languages.slice(0, 4).map((language) => (
                    <Badge key={language} variant="outline">
                      {language}
                    </Badge>
                  ))}
                </div>
              </CardHeader>

              <CardContent className="space-y-5">
                <div className="h-44 rounded-lg border border-[#30363d] bg-[#0d1117] p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 8, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid stroke="#30363d" strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fill: "#8b949e", fontSize: 12 }} axisLine={{ stroke: "#30363d" }} />
                      <YAxis domain={[0, 100]} tick={{ fill: "#8b949e", fontSize: 12 }} axisLine={{ stroke: "#30363d" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#161b22",
                          border: "1px solid #30363d",
                          borderRadius: "8px",
                          color: "#c9d1d9"
                        }}
                      />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-[#c9d1d9]">
                    <Star className="h-4 w-4 text-[#d29922]" />
                    {repo.stargazersCount} stars
                  </div>
                  <div className="flex items-center gap-2 text-[#c9d1d9]">
                    <GitBranch className="h-4 w-4 text-[#58a6ff]" />
                    {repo.forksCount} forks
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-white">Challenge</p>
                  <p className="text-sm text-[#8b949e]">{repo.caseStudy.challenge}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-white">Solution</p>
                  <p className="text-sm text-[#8b949e]">{repo.caseStudy.solution}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-white">Outcomes</p>
                  <ul className="space-y-1 text-sm text-[#8b949e]">
                    {repo.caseStudy.outcomes.map((outcome) => (
                      <li key={outcome} className="flex items-start gap-2">
                        <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#3fb950]" />
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-3 pt-1 text-sm">
                  <a
                    href={repo.htmlUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-[#58a6ff] transition-colors hover:text-[#79c0ff]"
                  >
                    View source
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>

                  {repo.homepage ? (
                    <a
                      href={repo.homepage}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-[#3fb950] transition-colors hover:text-[#56d364]"
                    >
                      Open live demo
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
