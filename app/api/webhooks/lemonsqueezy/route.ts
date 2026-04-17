import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/lemonsqueezy";
import { setSubscriptionStatus } from "@/lib/supabase";

type LemonPayload = {
  meta?: {
    event_name?: string;
    custom_data?: {
      username?: string;
    };
  };
  data?: {
    attributes?: {
      user_email?: string;
      status?: string;
      custom_data?: {
        username?: string;
      };
    };
  };
};

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-signature");

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
  }

  const payload = JSON.parse(rawBody) as LemonPayload;
  const eventName = payload.meta?.event_name ?? "";

  const username =
    payload.meta?.custom_data?.username ?? payload.data?.attributes?.custom_data?.username ?? payload.data?.attributes?.user_email ?? null;

  if (username) {
    const activeEvents = new Set(["subscription_created", "subscription_resumed", "order_created"]);
    const inactiveEvents = new Set(["subscription_expired", "subscription_cancelled", "subscription_paused"]);

    if (activeEvents.has(eventName)) {
      await setSubscriptionStatus(username, true);
    }

    if (inactiveEvents.has(eventName)) {
      await setSubscriptionStatus(username, false);
    }
  }

  return NextResponse.json({ received: true });
}
