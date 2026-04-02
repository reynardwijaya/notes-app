"use server";

import { requireAdmin } from "@/app/(dashboard)/admin/utils/guards";
import { mapNoteRow } from "@/app/(dashboard)/notes/utils/supabaseMappers";
import type { NoteWithCategory } from "@/app/(dashboard)/notes/utils/types";

export async function getNotesForUser(input: {
  userId: string;
  page: number;
  pageSize: number;
  search: string;
  fromDate?: string | null;
  toDate?: string | null;
  categoryId?: string | null;
}): Promise<{ data: NoteWithCategory[]; total: number }> {
  const admin = await requireAdmin();
  if (!admin.ok) return { data: [], total: 0 };

  const { supabase } = admin;

  const safeUserId = (input.userId ?? "").trim();
  if (!safeUserId) return { data: [], total: 0 };

  const page = Number.isFinite(input.page) && input.page >= 0 ? input.page : 0;
  const pageSize =
    Number.isFinite(input.pageSize) && input.pageSize > 0
      ? input.pageSize
      : 10;

  const offset = page * pageSize;

  const { data, error } = await supabase.rpc(
    "admin_get_notes_for_user",
    {
      p_user_id: safeUserId,
      p_search: input.search || null,
      p_category_id: input.categoryId || null,
      p_from_date: input.fromDate || null,
      p_to_date: input.toDate || null,
      p_limit: pageSize,
      p_offset: offset,
    }
  );

  if (error) throw new Error(error.message);

  const rows = (data ?? []) as {
    id: string;
    title: string | null;
    content: string | null;
    category_id: string | null;
    category_name: string | null;
    created_at: string;
    total_count: number;
  }[];

  const total = rows.length > 0 ? Number(rows[0].total_count) : 0;

  return {
    data: rows.map((r) =>
      mapNoteRow({
        ...r,
        note_categories: { name: r.category_name },
      })
    ),
    total,
  };
}