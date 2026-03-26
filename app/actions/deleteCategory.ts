"use server";

import { createClient } from "@/lib/supabase/server";
import type { CategoryItem } from "@/app/actions/createCategory";

async function getUserCategories(userId: string): Promise<CategoryItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("note_categories")
    .select("id,name")
    .eq("user_id", userId)
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    id: String((row as any).id),
    name: String((row as any).name ?? ""),
  }));
}

export async function deleteCategory(input: {
  id: string;
}): Promise<{ success: true; categories: CategoryItem[] } | { error: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };
  if (!input.id) return { error: "Missing category id" };

  const { error } = await supabase
    .from("note_categories")
    .delete()
    .eq("id", input.id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  const categories = await getUserCategories(user.id);
  return { success: true, categories };
}

