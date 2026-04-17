"use client";

import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import Prism from "prismjs";
import "prismjs/components/prism-typescript";
import type { ShowcaseProject } from "@/types";
import { MetricsDisplay } from "@/components/MetricsDisplay";

type ProjectShowcaseProps = {
  project: ShowcaseProject;
};

export function ProjectShowcase({ project }: ProjectShowcaseProps) {
  const markdown = useMemo(
    () => `## Problem\n${project.narrative.problem}\n\n## Implementation\n${project.narrative.implementation}\n\n## Impact\n${project.narrative.impact}`,
    [project]
  );

  const sampleCode = `type LaunchPlan = {\n  milestone: string;\n  owner: string;\n  targetDate: string;\n};\n\nexport const launchPlan: LaunchPlan[] = [\n  { milestone: "Portfolio narrative", owner: "Founder", targetDate: "2026-05-01" },\n  { milestone: "Outbound pitch deck", owner: "Growth", targetDate: "2026-05-05" }\n];`;

  const highlightedCode = Prism.highlight(sampleCode, Prism.languages.typescript, "typescript");

  return (
    <div className="space-y-4">
      <MetricsDisplay metrics={project.metrics} />
      <section className="rounded-xl border border-[#30363d] bg-[#161b22] p-4">
        <h2 className="mb-3 text-xl font-semibold text-white">Case Study Narrative</h2>
        <article className="prose prose-invert prose-headings:text-white prose-p:text-[#c9d1d9] max-w-none">
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </article>
      </section>
      <section className="rounded-xl border border-[#30363d] bg-[#161b22] p-4">
        <h2 className="mb-3 text-xl font-semibold text-white">Presentation Snippet</h2>
        <pre className="overflow-x-auto rounded-lg border border-[#30363d] bg-[#0d1117] p-4 text-sm text-[#c9d1d9]">
          <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
        </pre>
      </section>
    </div>
  );
}
