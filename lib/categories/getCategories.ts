import { createClient } from "@/lib/supabase/server";

export async function getCategories() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("note_categories")
    .select("id, name")
    .order("name"); // urut alfabet

  if (error) throw new Error(error.message);

  return data || [];
}
