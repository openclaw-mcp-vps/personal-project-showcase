export type RepoSummary = {
  id: number;
  name: string;
  fullName: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  openIssues: number;
  updatedAt: string;
  pushedAt: string;
  defaultBranch: string;
  htmlUrl: string;
  homepage: string;
  topics: string[];
};

export type RepoMetrics = {
  complexityScore: number;
  velocityScore: number;
  qualityScore: number;
  impactScore: number;
  totalScore: number;
  codeSizeEstimate: number;
};

export type ShowcaseProject = {
  repo: RepoSummary;
  metrics: RepoMetrics;
  narrative: {
    problem: string;
    implementation: string;
    impact: string;
  };
};

export type DashboardPayload = {
  username: string;
  avatarUrl: string;
  projects: ShowcaseProject[];
  generatedAt: string;
};
