import crypto from "node:crypto";

import { NextRequest, NextResponse } from "next/server";

import { markSessionAsPaid } from "@/lib/paywall-store";

type StripeEvent = {
  type: string;
  data?: {
    object?: {
      id?: string;
      payment_status?: string;
      status?: string;
      mode?: string;
    };
  };
};

function parseStripeSignatures(signatureHeader: string) {
  const parts = signatureHeader.split(",");
  const timestamp = parts.find((part) => part.startsWith("t="))?.replace("t=", "");
  const signatures = parts.filter((part) => part.startsWith("v1=")).map((part) => part.replace("v1=", ""));

  return {
    timestamp,
    signatures
  };
}

function safeCompare(expected: string, actual: string): boolean {
  const expectedBuffer = Buffer.from(expected, "hex");
  const actualBuffer = Buffer.from(actual, "hex");

  if (expectedBuffer.length !== actualBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
}

function verifyStripeSignature(rawBody: string, signatureHeader: string, secret: string): boolean {
  const { timestamp, signatures } = parseStripeSignatures(signatureHeader);

  if (!timestamp || signatures.length === 0) {
    return false;
  }

  const signedPayload = `${timestamp}.${rawBody}`;
  const expected = crypto.createHmac("sha256", secret).update(signedPayload).digest("hex");

  return signatures.some((signature) => safeCompare(expected, signature));
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json({ error: "Stripe webhook secret is missing." }, { status: 500 });
  }

  const signatureHeader = request.headers.get("stripe-signature");

  if (!signatureHeader) {
    return NextResponse.json({ error: "Missing stripe-signature header." }, { status: 400 });
  }

  const rawBody = await request.text();

  if (!verifyStripeSignature(rawBody, signatureHeader, webhookSecret)) {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 401 });
  }

  const event = JSON.parse(rawBody) as StripeEvent;

  if (event.type === "checkout.session.completed") {
    const session = event.data?.object;

    if (session?.id && session.payment_status === "paid") {
      await markSessionAsPaid(session.id, "stripe");
    }
  }

  return NextResponse.json({ received: true });
}
