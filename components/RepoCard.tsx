"use client";

import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import type { ShowcaseProject } from "@/types";
import { cn } from "@/lib/utils";

type RepoCardProps = {
  project: ShowcaseProject;
  onSelect?: (project: ShowcaseProject) => void;
};

export function RepoCard({ project, onSelect }: RepoCardProps) {
  const { repo, metrics } = project;
  const isSelectable = Boolean(onSelect);

  return (
    <motion.button
      type="button"
      onClick={() => onSelect?.(project)}
      disabled={!isSelectable}
      whileHover={{ y: -4, borderColor: "#58a6ff" }}
      transition={{ duration: 0.2 }}
      className={cn(
        "w-full rounded-xl border border-[#30363d] bg-[#161b22] p-5 text-left",
        !isSelectable && "cursor-default"
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-white">{repo.name}</h3>
        <span className="rounded-full bg-[#0d1117] px-2 py-1 text-xs text-[#7d8590]">{repo.language}</span>
      </div>
      <p className="mb-4 line-clamp-2 text-sm text-[#9aa4af]">{repo.description}</p>
      <div className="grid grid-cols-2 gap-3 text-sm text-[#c9d1d9]">
        <p>⭐ {repo.stars} stars</p>
        <p>🍴 {repo.forks} forks</p>
        <p>Impact {metrics.impactScore}/100</p>
        <p>Updated {formatDistanceToNow(new Date(repo.updatedAt), { addSuffix: true })}</p>
      </div>
    </motion.button>
  );
}
