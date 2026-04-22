import { Octokit } from "octokit";

import {
  analyzeCodeMetrics,
  generateCaseStudy,
  type CaseStudy,
  type CodeMetrics,
  type RepositorySummary
} from "@/lib/code-analyzer";

export type PortfolioRepo = RepositorySummary & {
  metrics: CodeMetrics;
  caseStudy: CaseStudy;
};

function createOctokit(token?: string) {
  if (token) {
    return new Octokit({ auth: token });
  }

  return new Octokit();
}

export async function fetchUserRepositories(username: string, token?: string): Promise<RepositorySummary[]> {
  const octokit = createOctokit(token);

  const response = await octokit.request("GET /users/{username}/repos", {
    username,
    per_page: 100,
    sort: "updated",
    direction: "desc",
    type: "owner"
  });

  const candidateRepos = response.data
    .filter((repo) => !repo.fork && !repo.archived)
    .slice(0, 20);

  const languageMaps = await Promise.all(
    candidateRepos.map(async (repo) => {
      try {
        const languageResponse = await octokit.request("GET /repos/{owner}/{repo}/languages", {
          owner: repo.owner.login,
          repo: repo.name
        });

        return Object.keys(languageResponse.data);
      } catch {
        return repo.language ? [repo.language] : [];
      }
    })
  );

  return candidateRepos.map((repo, index) => ({
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description,
    htmlUrl: repo.html_url,
    homepage: repo.homepage ?? null,
    stargazersCount: repo.stargazers_count ?? 0,
    forksCount: repo.forks_count ?? 0,
    openIssuesCount: repo.open_issues_count ?? 0,
    watchersCount: repo.watchers_count ?? 0,
    language: repo.language ?? null,
    languages: languageMaps[index].slice(0, 6),
    topics: repo.topics ?? [],
    size: repo.size ?? 0,
    pushedAt: repo.pushed_at ?? repo.updated_at ?? new Date().toISOString(),
    createdAt: repo.created_at ?? repo.updated_at ?? new Date().toISOString()
  }));
}

export async function buildPortfolioRepos(username: string, token?: string): Promise<PortfolioRepo[]> {
  const repositories = await fetchUserRepositories(username, token);

  return repositories.map((repo) => {
    const metrics = analyzeCodeMetrics(repo);
    const caseStudy = generateCaseStudy(repo, metrics);

    return {
      ...repo,
      metrics,
      caseStudy
    };
  });
}
