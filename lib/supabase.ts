import { createClient } from "@supabase/supabase-js";
import { promises as fs } from "fs";
import path from "path";
import type { DashboardPayload } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const localDataDir = path.join(process.cwd(), ".data");
const localPortfoliosFile = path.join(localDataDir, "portfolios.json");
const localSubscriptionsFile = path.join(localDataDir, "subscriptions.json");

function normalizeKey(input: string): string {
  return input.trim().toLowerCase();
}

async function ensureDataDir() {
  await fs.mkdir(localDataDir, { recursive: true });
}

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJsonFile<T>(filePath: string, data: T) {
  await ensureDataDir();
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

export function getSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

export function getSupabaseAdminClient() {
  if (!supabaseUrl || !supabaseServiceKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export async function saveShowcase(username: string, payload: DashboardPayload) {
  const admin = getSupabaseAdminClient();

  if (admin) {
    await admin.from("portfolios").upsert(
      {
        username,
        payload,
        updated_at: new Date().toISOString()
      },
      { onConflict: "username" }
    );
    return;
  }

  const key = normalizeKey(username);
  const stored = await readJsonFile<Record<string, DashboardPayload>>(localPortfoliosFile, {});
  stored[key] = payload;
  await writeJsonFile(localPortfoliosFile, stored);
}

export async function getShowcase(username: string): Promise<DashboardPayload | null> {
  const client = getSupabaseClient();

  if (client) {
    const { data } = await client.from("portfolios").select("payload").eq("username", username).maybeSingle();
    const supabasePayload = (data?.payload as DashboardPayload | undefined) ?? null;

    if (supabasePayload) {
      return supabasePayload;
    }
  }

  const key = normalizeKey(username);
  const stored = await readJsonFile<Record<string, DashboardPayload>>(localPortfoliosFile, {});

  return stored[key] ?? null;
}

export async function setSubscriptionStatus(username: string, isActive: boolean) {
  const admin = getSupabaseAdminClient();

  if (admin) {
    await admin.from("subscriptions").upsert(
      {
        username,
        is_active: isActive,
        updated_at: new Date().toISOString()
      },
      { onConflict: "username" }
    );
    return;
  }

  const key = normalizeKey(username);
  const stored = await readJsonFile<Record<string, { isActive: boolean; updatedAt: string }>>(localSubscriptionsFile, {});

  stored[key] = {
    isActive,
    updatedAt: new Date().toISOString()
  };

  await writeJsonFile(localSubscriptionsFile, stored);
}
