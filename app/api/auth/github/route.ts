import crypto from "crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

async function exchangeCodeForToken(code: string): Promise<string | null> {
  if (!githubClientId || !githubClientSecret) {
    return null;
  }

  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      client_id: githubClientId,
      client_secret: githubClientSecret,
      code
    })
  });

  const data = (await response.json()) as { access_token?: string };
  return data.access_token ?? null;
}

async function fetchGitHubUsername(token: string): Promise<string | null> {
  const response = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json"
    }
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as { login?: string };
  return data.login ?? null;
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const code = params.get("code");
  const state = params.get("state");
  const cookieStore = await cookies();

  if (!code) {
    if (!githubClientId) {
      return NextResponse.json({ error: "Missing GITHUB_CLIENT_ID" }, { status: 500 });
    }

    const nextState = crypto.randomBytes(16).toString("hex");
    const redirectUri = `${appUrl}/api/auth/github`;
    const authorizeUrl = new URL("https://github.com/login/oauth/authorize");

    authorizeUrl.searchParams.set("client_id", githubClientId);
    authorizeUrl.searchParams.set("redirect_uri", redirectUri);
    authorizeUrl.searchParams.set("scope", "read:user repo");
    authorizeUrl.searchParams.set("state", nextState);

    const response = NextResponse.redirect(authorizeUrl);
    response.cookies.set("gh_oauth_state", nextState, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 10,
      path: "/"
    });

    return response;
  }

  const stateCookie = cookieStore.get("gh_oauth_state")?.value;

  if (!state || !stateCookie || state !== stateCookie) {
    return NextResponse.json({ error: "Invalid OAuth state" }, { status: 400 });
  }

  const token = await exchangeCodeForToken(code);

  if (!token) {
    return NextResponse.json({ error: "Failed to exchange GitHub OAuth code" }, { status: 400 });
  }

  const username = await fetchGitHubUsername(token);

  const response = NextResponse.redirect(new URL("/dashboard", appUrl));
  response.cookies.set("gh_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/"
  });

  if (username) {
    response.cookies.set("gh_username", username, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/"
    });
  }

  response.cookies.delete("gh_oauth_state");
  return response;
}
