"use client";

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import type { RepoMetrics } from "@/types";

type MetricsDisplayProps = {
  metrics: RepoMetrics;
};

export function MetricsDisplay({ metrics }: MetricsDisplayProps) {
  const chartData = [
    { metric: "Complexity", value: metrics.complexityScore },
    { metric: "Velocity", value: metrics.velocityScore },
    { metric: "Quality", value: metrics.qualityScore },
    { metric: "Impact", value: metrics.impactScore }
  ];

  return (
    <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-4">
      <h3 className="mb-2 text-base font-semibold text-white">Technical Profile</h3>
      <p className="mb-4 text-sm text-[#9aa4af]">Weighted score: {metrics.totalScore}/100</p>
      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
            <PolarGrid stroke="#30363d" />
            <PolarAngleAxis dataKey="metric" tick={{ fill: "#c9d1d9", fontSize: 12 }} />
            <Radar dataKey="value" stroke="#58a6ff" fill="#1f6feb" fillOpacity={0.4} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
