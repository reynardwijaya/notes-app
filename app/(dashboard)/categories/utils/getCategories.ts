import { createClient } from "@/lib/supabase/server";
import { CategoryRow } from "./types";

export async function getCategories(): Promise<CategoryRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_categories");

  if (error) throw new Error(error.message);

  const typedData = (data ?? []) as CategoryRow[];

  return typedData.map((row) => ({
    id: row.id,
    name: row.name ?? "",
    created_at: row.created_at ?? "",
    total_notes: Number(row.total_notes ?? 0),
  }));
}
