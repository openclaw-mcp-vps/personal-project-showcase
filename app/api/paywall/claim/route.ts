import { NextRequest, NextResponse } from "next/server";

import { hasPaidSession } from "@/lib/paywall-store";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as { sessionId?: string };
  const sessionId = body.sessionId?.trim() ?? "";

  if (!sessionId) {
    return NextResponse.json({ error: "sessionId is required." }, { status: 400 });
  }

  const isPaid = await hasPaidSession(sessionId);

  if (!isPaid) {
    return NextResponse.json(
      {
        error:
          "Session not recognized yet. Complete checkout and wait for webhook delivery, then try again with the Stripe session_id from your success URL."
      },
      { status: 403 }
    );
  }

  const response = NextResponse.json({ unlocked: true });

  response.cookies.set({
    name: "pps_access",
    value: "granted",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30
  });

  response.cookies.set({
    name: "pps_paid_session",
    value: sessionId,
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30
  });

  return response;
}
