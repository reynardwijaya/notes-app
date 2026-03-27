import { createClient } from "@/lib/supabase/server";

export type CategoryRow = {
  id: string;
  name: string;
  created_at: string;
};

export async function getCategories(): Promise<CategoryRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("note_categories")
    .select("id, name, created_at")
    .order("name"); // urut alfabet

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    id: String(row.id),
    name: String(row.name ?? ""),
    created_at: String(row.created_at ?? ""),
  }));
}
