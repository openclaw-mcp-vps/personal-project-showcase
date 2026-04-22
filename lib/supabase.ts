import { createClient } from "@supabase/supabase-js";

import { readStore, writeStore } from "@/lib/local-store";

export type PortfolioConfig = {
  username: string;
  brandHeadline: string;
  targetRole: string;
  narrative: string;
  selectedRepoNames: string[];
  updatedAt: string;
};

type PortfolioConfigMap = Record<string, PortfolioConfig>;

const PORTFOLIO_CONFIG_FILE = "portfolio-configs.json";

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return null;
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

export async function savePortfolioConfig(config: PortfolioConfig): Promise<void> {
  const supabase = getSupabaseAdmin();

  if (supabase) {
    const { error } = await supabase.from("portfolio_configs").upsert(config, {
      onConflict: "username"
    });

    if (!error) {
      return;
    }
  }

  const store = await readStore<PortfolioConfigMap>(PORTFOLIO_CONFIG_FILE, {});
  store[config.username.toLowerCase()] = config;
  await writeStore(PORTFOLIO_CONFIG_FILE, store);
}

export async function getPortfolioConfig(username: string): Promise<PortfolioConfig | null> {
  const normalized = username.toLowerCase();
  const supabase = getSupabaseAdmin();

  if (supabase) {
    const { data, error } = await supabase
      .from("portfolio_configs")
      .select("username,brandHeadline,targetRole,narrative,selectedRepoNames,updatedAt")
      .eq("username", normalized)
      .maybeSingle();

    if (!error && data) {
      return data as PortfolioConfig;
    }
  }

  const store = await readStore<PortfolioConfigMap>(PORTFOLIO_CONFIG_FILE, {});
  return store[normalized] ?? null;
}
