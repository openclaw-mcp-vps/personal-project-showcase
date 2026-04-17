import { Octokit } from "@octokit/rest";
import type { RepoMetrics, RepoSummary, ShowcaseProject } from "@/types";

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function estimateCodeSize(repo: RepoSummary): number {
  const socialSignal = repo.stars * 80 + repo.forks * 140;
  const issueLoad = repo.openIssues * 30;
  return Math.max(1200, Math.round(6000 + socialSignal - issueLoad));
}

function buildNarrative(repo: RepoSummary, metrics: RepoMetrics): ShowcaseProject["narrative"] {
  const stack = repo.language === "Unknown" ? "a modern JavaScript stack" : `${repo.language}-first architecture`;
  const starsLine = repo.stars > 0 ? `The repository has earned ${repo.stars} stars, signaling clear developer interest.` : "The repository is still early, with room for community growth.";

  return {
    problem: `This project targets a concrete workflow gap for developers and teams who need better tooling around ${repo.name.replace(/[-_]/g, " ")}.`,
    implementation: `Built with ${stack}, the codebase prioritizes clean module boundaries, practical automation, and shipping velocity over unnecessary complexity.`,
    impact: `${starsLine} With an impact score of ${metrics.impactScore}/100 and an overall score of ${metrics.totalScore}/100, it demonstrates production-ready execution and real-world utility.`
  };
}

export function analyzeRepoMetrics(repo: RepoSummary): RepoMetrics {
  const recencyDays = Math.max(0, (Date.now() - new Date(repo.pushedAt).getTime()) / (1000 * 60 * 60 * 24));
  const recencyBonus = Math.max(0, 35 - recencyDays * 0.35);

  const complexityScore = clampScore(35 + Math.log10(estimateCodeSize(repo)) * 16 + (repo.language !== "Unknown" ? 8 : 0));
  const velocityScore = clampScore(40 + recencyBonus + Math.min(25, repo.forks * 2));
  const qualityScore = clampScore(45 + Math.min(20, repo.stars * 1.5) - Math.min(15, repo.openIssues * 0.5));
  const impactScore = clampScore(30 + repo.stars * 2.2 + repo.forks * 3.2 + Math.min(18, repo.topics.length * 2.5));

  return {
    complexityScore,
    velocityScore,
    qualityScore,
    impactScore,
    totalScore: clampScore((complexityScore + velocityScore + qualityScore + impactScore) / 4),
    codeSizeEstimate: estimateCodeSize(repo)
  };
}

export function buildShowcaseProject(repo: RepoSummary): ShowcaseProject {
  const metrics = analyzeRepoMetrics(repo);

  return {
    repo,
    metrics,
    narrative: buildNarrative(repo, metrics)
  };
}

export function createGitHubClient(token: string): Octokit {
  return new Octokit({
    auth: token
  });
}

export async function fetchUserRepos(token: string): Promise<{ username: string; avatarUrl: string; repos: RepoSummary[] }> {
  const octokit = createGitHubClient(token);

  const { data: me } = await octokit.users.getAuthenticated();

  const { data: reposData } = await octokit.repos.listForAuthenticatedUser({
    per_page: 100,
    sort: "updated"
  });

  const repos: RepoSummary[] = reposData
    .filter((repo) => !repo.fork)
    .map((repo) => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description ?? "No description provided.",
      language: repo.language ?? "Unknown",
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      openIssues: repo.open_issues_count,
      updatedAt: repo.updated_at ?? new Date().toISOString(),
      pushedAt: repo.pushed_at ?? repo.updated_at ?? new Date().toISOString(),
      defaultBranch: repo.default_branch,
      htmlUrl: repo.html_url,
      homepage: repo.homepage ?? "",
      topics: repo.topics ?? []
    }));

  return {
    username: me.login,
    avatarUrl: me.avatar_url,
    repos
  };
}
