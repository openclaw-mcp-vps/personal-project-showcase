import { NextRequest, NextResponse } from "next/server";

import { verifyLemonSignature, type LemonWebhookPayload } from "@/lib/lemonsqueezy";
import { markSessionAsPaid } from "@/lib/paywall-store";

export async function POST(request: NextRequest) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

  if (!secret) {
    return NextResponse.json({ error: "Lemon Squeezy webhook secret is not configured." }, { status: 500 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-signature");

  if (!verifyLemonSignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 401 });
  }

  const payload = JSON.parse(rawBody) as LemonWebhookPayload;
  const eventName = payload.meta?.event_name;

  if (eventName === "order_created" || eventName === "subscription_created") {
    const sessionId =
      payload.meta?.custom_data?.checkout_session_id ?? payload.data?.attributes?.identifier ?? payload.data?.id ?? "";

    if (sessionId) {
      await markSessionAsPaid(sessionId, "lemonsqueezy");
    }
  }

  return NextResponse.json({ received: true });
}
