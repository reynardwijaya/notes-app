"use server";

import { createClient } from "@/lib/supabase/server";
import type {
  CategoryUsageRow,
  CategoryUsageResult,
} from "./types";

export async function getCategoryUsage(input: {
  id: string;
}): Promise<CategoryUsageResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };
  if (!input.id) return { error: "Missing category id" };

  const { data, error } = await supabase.rpc(
    "get_category_usage",
    {
      p_user_id: user.id,
      p_category_id: input.id,
    }
  );

  if (error) return { error: error.message };

  const rows = (data ?? []) as CategoryUsageRow[];

  const titles = rows
    .map((r) => (r.title ?? "").trim())
    .filter((t) => t.length > 0);

  return {
    success: true,
    count: titles.length,
    titles,
  };
}