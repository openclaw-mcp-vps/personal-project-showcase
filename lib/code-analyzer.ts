export type RepositorySummary = {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  htmlUrl: string;
  homepage: string | null;
  stargazersCount: number;
  forksCount: number;
  openIssuesCount: number;
  watchersCount: number;
  language: string | null;
  languages: string[];
  topics: string[];
  size: number;
  pushedAt: string;
  createdAt: string;
};

export type CodeMetrics = {
  impactScore: number;
  maintenanceScore: number;
  momentumScore: number;
  complexityEstimate: number;
  marketReadiness: "Prototype" | "Beta" | "Production";
};

export type CaseStudy = {
  challenge: string;
  solution: string;
  technicalHighlights: string[];
  outcomes: string[];
};

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function daysSince(dateIso: string): number {
  const updated = new Date(dateIso).getTime();
  const now = Date.now();
  return Math.max(1, Math.floor((now - updated) / (1000 * 60 * 60 * 24)));
}

export function analyzeCodeMetrics(repo: RepositorySummary): CodeMetrics {
  const activityFreshness = 100 - Math.min(daysSince(repo.pushedAt), 180) * 0.55;
  const engagement = repo.stargazersCount * 1.6 + repo.forksCount * 2.1 + repo.watchersCount;
  const issuePressure = repo.openIssuesCount * 1.8;
  const repoSizeFactor = Math.log10(Math.max(repo.size, 10)) * 18;

  const impactScore = clamp(35 + engagement * 0.35 + repo.topics.length * 2.5);
  const maintenanceScore = clamp(70 + activityFreshness * 0.25 - issuePressure * 0.4);
  const momentumScore = clamp(50 + activityFreshness * 0.45 + repo.forksCount * 1.4);
  const complexityEstimate = clamp(25 + repoSizeFactor + repo.languages.length * 6 + issuePressure * 0.2);

  let marketReadiness: CodeMetrics["marketReadiness"] = "Prototype";
  if (impactScore >= 70 && maintenanceScore >= 60) {
    marketReadiness = "Production";
  } else if (impactScore >= 45 || maintenanceScore >= 45) {
    marketReadiness = "Beta";
  }

  return {
    impactScore,
    maintenanceScore,
    momentumScore,
    complexityEstimate,
    marketReadiness
  };
}

function stackNarrative(languages: string[]) {
  if (languages.length === 0) {
    return "a full-stack architecture tuned for delivery speed and maintainability";
  }

  if (languages.length === 1) {
    return `${languages[0]} with a clean modular architecture`;
  }

  const [first, second] = languages;
  return `${first} and ${second} across frontend and backend boundaries`;
}

export function generateCaseStudy(repo: RepositorySummary, metrics: CodeMetrics): CaseStudy {
  const challenge = `Turned a raw idea into a usable product with ${repo.openIssuesCount} open backlog items while keeping contributor friction low.`;

  const solution = `Built ${repo.name} using ${stackNarrative(repo.languages)}, prioritizing iterative releases and observable quality signals from day one.`;

  const technicalHighlights = [
    `Implemented ${repo.languages.slice(0, 3).join(", ") || "a modern stack"} with production-minded patterns.`,
    `Maintained delivery momentum with a ${metrics.momentumScore}/100 activity score.`,
    `Managed architectural growth with a ${metrics.complexityEstimate}/100 complexity profile.`
  ];

  const outcomes = [
    `Earned ${repo.stargazersCount} GitHub stars and ${repo.forksCount} forks from developers.`,
    `Reached ${metrics.marketReadiness.toLowerCase()} readiness with a ${metrics.maintenanceScore}/100 maintenance score.`,
    `Created a reusable project narrative suitable for resumes, interviews, and client proposals.`
  ];

  return {
    challenge,
    solution,
    technicalHighlights,
    outcomes
  };
}
