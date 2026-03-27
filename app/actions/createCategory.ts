"use server";

import { createClient } from "@/lib/supabase/server";

export type CategoryItem = {
  id: string;
  name: string;
};

async function getUserCategories(userId: string): Promise<CategoryItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("note_categories")
    .select("id, name")
    .eq("user_id", userId)
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row: any) => ({
    id: String(row.id),
    name: String(row.name ?? ""),
  }));
}

export async function createCategory(input: {
  name: string;
}): Promise<{ success: true; categories: CategoryItem[] } | { error: string }> {
  try {
    const supabase = await createClient();

    //  JS AUTH (Frontend layer)
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError) throw new Error("Authentication failed");

    const user = authData?.user;
    console.log(" SERVER USER ID:", user?.id);

    if (!user?.id) throw new Error("Unauthorized");

    // DB AUTH (RLS layer) 
    const { data: debugAuth, error: debugError } =
      await supabase.rpc("debug_auth");
      

    console.log("DB auth.uid():", debugAuth);
    console.log("DB auth error:", debugError);

    // VALIDATION
    const name = (input.name ?? "").trim();
    if (!name) return { error: "Category name is required." };

    //  INSERT
    const { data, error: insertError } = await supabase
      .from("note_categories")
      .insert({ name, user_id: user.id }) 
      .select();

    if (insertError) {
      console.error("INSERT ERROR:", insertError);
      throw new Error(insertError.message);
    }

    console.log(" INSERTED CATEGORY:", data);

    //  Fetch Updated Data
    const categories = await getUserCategories(user.id);

    return { success: true, categories };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create category";

    console.error("FINAL ERROR:", message);
    return { error: message };
  }
}
