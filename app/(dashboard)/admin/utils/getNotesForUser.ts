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
  sortColumn?: "created_at" | "title";
  sortDirection?: "asc" | "desc";
}): Promise<{ data: NoteWithCategory[]; total: number }> {
  const admin = await requireAdmin();
  if (!admin.ok) return { data: [], total: 0 };

  const { supabase } = admin;

  const safeUserId = (input.userId ?? "").trim();
  if (!safeUserId) return { data: [], total: 0 };

  const safePage =
    Number.isFinite(input.page) && input.page >= 0 ? input.page : 0;

  const safePageSize =
    Number.isFinite(input.pageSize) &&
    input.pageSize > 0 &&
    input.pageSize <= 100
      ? input.pageSize
      : 10;

  const safeSearch = (input.search ?? "").trim();
  const safeFromDate = (input.fromDate ?? "").trim();
  const safeToDate = (input.toDate ?? "").trim();
  const safeCategoryId = (input.categoryId ?? "").trim();

  const offset = safePage * safePageSize;

  const { data, error } = await supabase.rpc(
    "admin_get_notes_for_user_sorted",
    {
      p_user_id: safeUserId,
      p_search: safeSearch || null,
      p_category_id: safeCategoryId || null,
      p_from_date: safeFromDate
        ? new Date(`${safeFromDate}T00:00:00.000Z`).toISOString()
        : null,
      p_to_date: safeToDate
        ? new Date(`${safeToDate}T23:59:59.999Z`).toISOString()
        : null,
      p_limit: safePageSize,
      p_offset: offset,
      p_sort_column: input.sortColumn ?? "created_at",
      p_sort_dir: input.sortDirection ?? "desc",
    },
  );

  if (error) {
    throw new Error(error.message);
  }

  const list = Array.isArray(data) ? data : [];

  const rows: NoteWithCategory[] = list.map((row) =>
    mapNoteRow({
      ...row,
      note_categories: { name: row.category_name },
    }),
  );

  const total = list.length > 0 ? Number(list[0].total_count) : 0;

  return {
    data: rows,
    total,
  };
}
