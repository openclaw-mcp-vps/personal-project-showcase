import crypto from "crypto";

const storeId = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_STORE_ID;
const productId = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_PRODUCT_ID;

export function getCheckoutUrl(email?: string): string {
  if (!storeId || !productId) {
    return "";
  }

  const base = `https://app.lemonsqueezy.com/checkout/buy/${productId}`;

  if (!email) {
    return base;
  }

  const params = new URLSearchParams({
    checkout: "1",
    email
  });

  return `${base}?${params.toString()}`;
}

export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;

  if (!secret || !signature) {
    return false;
  }

  const digest = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const incoming = signature.replace("sha256=", "");

  try {
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(incoming));
  } catch {
    return false;
  }
}
