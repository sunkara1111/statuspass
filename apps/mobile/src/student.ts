import type { SupabaseClient, User } from "@supabase/supabase-js";

export type StudentRecord = {
  id: string;
  sevis_id: string | null;
  sevis_self_status: "unset" | "active" | "escalate_dso";
  university_name: string | null;
  program_timezone: string;
};

const STUDENT_COLS =
  "id, sevis_id, sevis_self_status, university_name, program_timezone";

export async function ensureStudent(
  supabase: SupabaseClient,
): Promise<{ user: User; student: StudentRecord } | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const existing = await loadStudent(supabase, user.id);
  if (existing) return { user, student: existing };

  const fullName =
    (typeof user.user_metadata?.full_name === "string" &&
      user.user_metadata.full_name.trim()) ||
    user.email?.split("@")[0] ||
    "Student";

  await supabase.from("profiles").upsert(
    {
      id: user.id,
      full_name: fullName,
      email: user.email ?? `${user.id}@users.statuspass.local`,
    },
    { onConflict: "id" },
  );

  const { data: inserted } = await supabase
    .from("students")
    .insert({ profile_id: user.id })
    .select(STUDENT_COLS)
    .maybeSingle();

  if (inserted) return { user, student: inserted as StudentRecord };

  const again = await loadStudent(supabase, user.id);
  if (again) return { user, student: again };
  return null;
}

async function loadStudent(
  supabase: SupabaseClient,
  profileId: string,
): Promise<StudentRecord | null> {
  const { data } = await supabase
    .from("students")
    .select(STUDENT_COLS)
    .eq("profile_id", profileId)
    .maybeSingle();
  return (data as StudentRecord | null) ?? null;
}
