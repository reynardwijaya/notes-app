"use server";

import { createClient } from "@/lib/supabase/server";

export async function requireAdmin(): Promise<
  | {
      ok: true;
      supabase: Awaited<ReturnType<typeof createClient>>;
      user: NonNullable<
        Awaited<
          ReturnType<
            Awaited<ReturnType<typeof createClient>>["auth"]["getUser"]
          >
        >["data"]["user"]
      >;
    }
  | { ok: false; error: string }
> {
  const supabase = await createClient();

  //  Ambil user login
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, error: "Unauthorized" };

  const { data: isAdmin, error } = await supabase.rpc("is_admin");

  if (error) return { ok: false, error: error.message };
  if (!isAdmin) return { ok: false, error: "Forbidden" };

  return { ok: true, supabase, user };
}
