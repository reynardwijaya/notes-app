"use server";

import { requireAdmin } from "@/app/(dashboard)/admin/utils/guards";

export type AdminCategoryRow = {
  id: string;
  name: string;
  created_at: string;
  total_notes: number;
};

// input: userId; output: array kategori
export async function getCategoriesForUser(input: {
  userId: string;
}): Promise<AdminCategoryRow[]> {
  // validasi admin
  const admin = await requireAdmin();
  if (!admin.ok) return [];

  // Validasi userId
  // Kalau userId null / undefined → ganti jadi string kosong ""; trim(): Menghapus spasi di depan & belakang
  const safeUserId = (input.userId ?? "").trim();
  if (!safeUserId) return [];

  // Ambil supabase client
  const { supabase } = admin;

  const { data, error } = await supabase.rpc("admin_get_user_categories", {
    p_user_id: safeUserId,
  });

  if (error) throw new Error(error.message);

  // Normalize data
  const rows = (data ?? []) as {
    id: string;
    name: string | null;
    created_at: string;
    total_notes: number;
  }[];

  // Mapping hasil akhir
  return rows.map((r) => ({
    id: r.id,
    name: r.name ?? "",
    created_at: r.created_at,
    total_notes: Number(r.total_notes ?? 0),
  }));
}
