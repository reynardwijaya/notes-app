"use server";

import { requireAdmin } from "@/app/(dashboard)/actions/admin/guards";

export type AdminCategoryRow = {
  id: string;
  name: string;
  created_at: string;
};

export async function getCategoriesForUser(input: {
  userId: string;
}): Promise<AdminCategoryRow[]> {
  const admin = await requireAdmin();
  if (!admin.ok) return [];

  const safeUserId = (input.userId ?? "").trim();
  if (!safeUserId) return [];

  const { supabase } = admin;

  const { data, error } = await supabase
    .from("note_categories")
    .select("id,name,created_at")
    .eq("user_id", safeUserId)
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);

  const rows = Array.isArray(data) ? data : [];
  return rows.map((r) => ({
    id: String((r as { id: unknown }).id ?? ""),
    name: String((r as { name: unknown }).name ?? ""),
    created_at: String((r as { created_at: unknown }).created_at ?? ""),
  }));
}

