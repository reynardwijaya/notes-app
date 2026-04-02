"use server";

import { requireAdmin } from "@/app/(dashboard)/admin/utils/guards";

export type AdminCategoryRow = {
  id: string;
  name: string;
  created_at: string;
  total_notes: number;
};

export async function getCategoriesForUser(input: {
  userId: string;
}): Promise<AdminCategoryRow[]> {
  const admin = await requireAdmin();
  if (!admin.ok) return [];

  const safeUserId = (input.userId ?? "").trim();
  if (!safeUserId) return [];

  const { supabase } = admin;

  const { data, error } = await supabase.rpc("admin_get_user_categories", {
    p_user_id: safeUserId,
  });

  if (error) throw new Error(error.message);

  const rows = (data ?? []) as {
    id: string;
    name: string | null;
    created_at: string;
    total_notes: number;
  }[];

  return rows.map((r) => ({
    id: r.id,
    name: r.name ?? "",
    created_at: r.created_at,
    total_notes: Number(r.total_notes ?? 0),
  }));
}
