import crypto from "node:crypto";

import { lemonSqueezySetup } from "@lemonsqueezy/lemonsqueezy.js";

export type LemonWebhookPayload = {
  meta?: {
    event_name?: string;
    custom_data?: {
      checkout_session_id?: string;
    };
  };
  data?: {
    id?: string;
    attributes?: {
      status?: string;
      identifier?: string;
    };
  };
};

export function setupLemonSqueezy() {
  if (!process.env.LEMONSQUEEZY_API_KEY) {
    return;
  }

  lemonSqueezySetup({
    apiKey: process.env.LEMONSQUEEZY_API_KEY,
    onError: (error) => {
      console.error("Lemon Squeezy setup error", error);
    }
  });
}

export function verifyLemonSignature(rawBody: string, signatureHeader: string | null, secret: string): boolean {
  if (!signatureHeader) {
    return false;
  }

  const expectedSignature = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");

  const expectedBuffer = Buffer.from(expectedSignature);
  const actualBuffer = Buffer.from(signatureHeader);

  if (expectedBuffer.length !== actualBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
}
