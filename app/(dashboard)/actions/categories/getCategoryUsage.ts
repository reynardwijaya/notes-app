"use server";

import { createClient } from "@/lib/supabase/server";

export async function getCategoryUsage(input: {
  id: string;
}): Promise<{ success: true; count: number; titles: string[] } | { error: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };
  if (!input.id) return { error: "Missing category id" };

  const { data, error } = await supabase
    .from("notes")
    .select("title")
    .eq("user_id", user.id)
    .eq("category_id", input.id)
    .order("created_at", { ascending: false })
    .limit(10)
    .returns<Array<{ title: string | null }>>();

  if (error) return { error: error.message };

  const titles = (data ?? [])
    .map((r) => String(r.title ?? "").trim())
    .filter((t) => t.length > 0);

  return { success: true, count: titles.length, titles };
}

