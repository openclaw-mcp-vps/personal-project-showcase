import { NextRequest, NextResponse } from "next/server";

import { buildPortfolioRepos } from "@/lib/github-api";

export async function GET(request: NextRequest) {
  const hasAccess = request.cookies.get("pps_access")?.value === "granted";

  if (!hasAccess) {
    return NextResponse.json({ error: "Payment required. Please unlock dashboard access first." }, { status: 402 });
  }

  const username = request.nextUrl.searchParams.get("username")?.trim();

  if (!username) {
    return NextResponse.json({ error: "Query parameter `username` is required." }, { status: 400 });
  }

  const token = request.headers.get("x-github-token")?.trim() || undefined;

  try {
    const repos = await buildPortfolioRepos(username, token);

    return NextResponse.json(
      {
        repos
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store"
        }
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch repositories from GitHub.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
