"use server";

import { createClient } from "@/lib/supabase/server";
import type { CategoryItem } from "@/app/(dashboard)/categories/utils/types";

export async function deleteCategory(input: {
  id: string;
}): Promise<{ success: true; categories: CategoryItem[] } | { error: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };
  if (!input.id) return { error: "Missing category id" };

  const { data, error } = await supabase.rpc("delete_category", {
    p_category_id: input.id,
    p_user_id: user.id,
  });

  if (error) return { error: error.message };

  const categories: CategoryItem[] = (data ?? []).map(
    (row: { id: string; name: string | null }) => ({
      id: row.id,
      name: row.name ?? "",
    }),
  );

  return { success: true, categories };
}
