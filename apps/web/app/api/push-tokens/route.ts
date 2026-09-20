import { NextResponse } from "next/server";
import { pushTokenInput } from "@statuspass/db";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = pushTokenInput.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid token payload" },
      { status: 400 },
    );
  }

  const supabase = await createServerSupabase();
  if (!supabase) {
    return NextResponse.json({
      ok: true,
      stored: "stub",
      note: "Supabase is not configured. Expo can retry after keys are set.",
      token: parsed.data,
    });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Sign in required" }, { status: 401 });
  }

  const { error } = await supabase.from("device_push_tokens").upsert(
    {
      profile_id: user.id,
      token: parsed.data.token,
      platform: parsed.data.platform,
      last_used_at: new Date().toISOString(),
    },
    { onConflict: "token" },
  );

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, stored: "supabase" });
}
