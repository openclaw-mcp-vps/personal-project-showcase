import { readStore, writeStore } from "@/lib/local-store";

type PaidSessionRecord = {
  sessionId: string;
  provider: "stripe" | "lemonsqueezy";
  paidAt: string;
};

type PaidSessionMap = Record<string, PaidSessionRecord>;

const PAID_SESSION_FILE = "paid-sessions.json";

export async function markSessionAsPaid(sessionId: string, provider: "stripe" | "lemonsqueezy") {
  const normalized = sessionId.trim();

  if (!normalized) {
    return;
  }

  const store = await readStore<PaidSessionMap>(PAID_SESSION_FILE, {});
  store[normalized] = {
    sessionId: normalized,
    provider,
    paidAt: new Date().toISOString()
  };

  await writeStore(PAID_SESSION_FILE, store);
}

export async function hasPaidSession(sessionId: string): Promise<boolean> {
  const normalized = sessionId.trim();

  if (!normalized) {
    return false;
  }

  const store = await readStore<PaidSessionMap>(PAID_SESSION_FILE, {});
  return Boolean(store[normalized]);
}
