"use server";

import { createClient } from "@/lib/supabase/server";
import type { CategoryItem } from "@/app/(dashboard)/categories/utils/types";

export async function createCategory(input: {
  name: string;
}): Promise<{ success: true; categories: CategoryItem[] } | { error: string }> {
  try {
    const supabase = await createClient();

    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError) throw new Error("Authentication failed");

    const user = authData.user;
    if (!user?.id) throw new Error("Unauthorized");

    const name = (input.name ?? "").trim();
    if (!name) return { error: "Category name is required." };

    const { data, error } = await supabase.rpc("create_category", {
      p_user_id: user.id,
      p_name: name,
    });

    if (error) throw new Error(error.message);

    const categories: CategoryItem[] = (data ?? []).map(
      (row: { id: string; name: string | null }) => ({
        id: row.id,
        name: row.name ?? "",
      }),
    );

    return { success: true, categories };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create category";
    return { error: message };
  }
}
