import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { savePortfolioConfig } from "@/lib/supabase";

const configSchema = z.object({
  username: z.string().min(1).max(39),
  brandHeadline: z.string().min(20).max(120),
  targetRole: z.string().min(4).max(80),
  narrative: z.string().min(40).max(450),
  selectedRepoNames: z.array(z.string().min(1)).min(1).max(6)
});

export async function POST(request: NextRequest) {
  const hasAccess = request.cookies.get("pps_access")?.value === "granted";

  if (!hasAccess) {
    return NextResponse.json({ error: "Payment required to save portfolio configuration." }, { status: 402 });
  }

  const rawPayload = await request.json().catch(() => null);
  const parsedPayload = configSchema.safeParse(rawPayload);

  if (!parsedPayload.success) {
    return NextResponse.json({ error: "Invalid portfolio payload." }, { status: 400 });
  }

  const payload = parsedPayload.data;

  await savePortfolioConfig({
    username: payload.username.toLowerCase(),
    brandHeadline: payload.brandHeadline,
    targetRole: payload.targetRole,
    narrative: payload.narrative,
    selectedRepoNames: payload.selectedRepoNames,
    updatedAt: new Date().toISOString()
  });

  return NextResponse.json({ saved: true });
}
