"use server";

import { createClient } from "@/lib/supabase/server";
import type { CategoryItem } from "@/app/(dashboard)/actions/categories/types";

type CategorySelectRow = { id: string; name: string | null };

async function getUserCategories(userId: string): Promise<CategoryItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("note_categories")
    .select("id, name")
    .eq("user_id", userId)
    .order("name", { ascending: true })
    .returns<CategorySelectRow[]>();

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    id: String(row.id),
    name: String(row.name ?? ""),
  }));
}

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

    const { error: insertError } = await supabase
      .from("note_categories")
      .insert({ name, user_id: user.id })
      .select();

    if (insertError) throw new Error(insertError.message);

    const categories = await getUserCategories(user.id);
    return { success: true, categories };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create category";
    return { error: message };
  }
}

