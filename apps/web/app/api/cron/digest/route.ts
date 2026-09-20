import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const header = request.headers.get("authorization");
  if (!secret || header !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    note: "Morning digest hook. One alert_events row per student, kind, local date; timer_id keeps OPT and STEM hard-caps from collapsing.",
  });
}
