"use server";

import { createClient } from "@/lib/supabase/server";

type UserRoleRow = { role: "user" | "admin" };

export async function requireAdmin(): Promise<
  | {
      ok: true;
      supabase: Awaited<ReturnType<typeof createClient>>;
      user: NonNullable<Awaited<ReturnType<Awaited<ReturnType<typeof createClient>>["auth"]["getUser"]>>["data"]["user"]>;
    }
  | { ok: false; error: string }
> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, error: "Unauthorized" };

  const { data: roleRow, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single()
    .returns<UserRoleRow>();

  if (error) return { ok: false, error: error.message };
  if (roleRow?.role !== "admin") return { ok: false, error: "Forbidden" };

  return { ok: true, supabase, user };
}

