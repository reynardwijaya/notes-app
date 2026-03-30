"use server";

import { requireAdmin } from "@/app/(dashboard)/actions/admin/guards";
import type { AdminUserListRow } from "@/app/(dashboard)/actions/admin/types";

type UserBaseRow = {
  id: string;
  email: string | null;
  role: "user" | "admin" | null;
  created_at: string;
  notes: Array<{ count: number }> | null;
  note_categories: Array<{ count: number }> | null;
};

export async function getAdminUsers(): Promise<
  | { success: true; users: AdminUserListRow[] }
  | { error: string }
> {
  const admin = await requireAdmin();
  if (!admin.ok) return { error: admin.error };

  const { supabase } = admin;

  // Requires FK relationships so PostgREST can embed counts.
  const { data, error } = await supabase
    .from("users")
    .select("id,email,role,created_at,notes(count),note_categories(count)")
    .order("created_at", { ascending: false })
    .returns<UserBaseRow[]>();

  if (error) return { error: error.message };

  const rows: AdminUserListRow[] = (data ?? []).map((u) => ({
    id: String(u.id),
    email: String(u.email ?? ""),
    role: u.role === "admin" ? "admin" : "user",
    total_categories: Number(u.note_categories?.[0]?.count ?? 0),
    total_notes: Number(u.notes?.[0]?.count ?? 0),
    created_at: String(u.created_at ?? ""),
  }));

  return { success: true, users: rows };
}

