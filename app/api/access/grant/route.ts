import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { orderId?: number; email?: string };

  if (!body.orderId) {
    return NextResponse.json({ error: "Missing order id" }, { status: 400 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("pps_paid", "1", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/"
  });

  response.cookies.set("pps_order", String(body.orderId), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/"
  });

  if (body.email) {
    response.cookies.set("pps_email", body.email, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/"
    });
  }

  return response;
}
