import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { buildShowcaseProject, fetchUserRepos } from "@/lib/github";
import { saveShowcase } from "@/lib/supabase";
import type { DashboardPayload } from "@/types";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("gh_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "GitHub account is not connected." }, { status: 401 });
  }

  try {
    const { username, avatarUrl, repos } = await fetchUserRepos(token);

    const projects = repos
      .map(buildShowcaseProject)
      .sort((a, b) => b.metrics.totalScore - a.metrics.totalScore)
      .slice(0, 12);

    const payload: DashboardPayload = {
      username,
      avatarUrl,
      projects,
      generatedAt: new Date().toISOString()
    };

    await saveShowcase(username, payload);

    const response = NextResponse.json(payload);
    response.cookies.set("gh_username", username, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/"
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to sync GitHub repositories.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
