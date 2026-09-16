"use server";

import { createClient } from "@/lib/supabase/server";
import { mapNoteRow } from "@/app/(dashboard)/notes/utils/supabaseMappers";
import type { NoteWithCategory } from "@/app/(dashboard)/notes/utils/types";

export async function getNotes({
  page,
  pageSize,
  search,
  fromDate,
  toDate,
  categoryId,
  sortColumn,
  sortDirection,
}: {
  page: number;
  pageSize: number;
  search: string;
  fromDate?: string | null;
  toDate?: string | null;
  categoryId?: string | null;
  sortColumn?: string;
  sortDirection?: string;
}): Promise<{ data: NoteWithCategory[]; total: number }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { data: [], total: 0 };

  const safePage = Number.isFinite(page) && page >= 0 ? page : 0;
  const safePageSize =
    Number.isFinite(pageSize) && pageSize > 0 && pageSize <= 100
      ? pageSize
      : 10;
  const safeSearch = (search ?? "").trim();
  const safeFromDate = (fromDate ?? "").trim();
  const safeToDate = (toDate ?? "").trim();
  const safeCategoryId = (categoryId ?? "").trim();

  const { data, error } = await supabase.rpc("get_notes_sorted", {
    p_page: safePage,
    p_page_size: safePageSize,
    p_search: safeSearch || "",
    p_category_id: safeCategoryId || null,
    p_from_date: safeFromDate
      ? new Date(`${safeFromDate}T00:00:00.000Z`).toISOString()
      : null,
    p_to_date: safeToDate
      ? new Date(`${safeToDate}T23:59:59.999Z`).toISOString()
      : null,
    p_sort_column: sortColumn ?? "created_at",
    p_sort_dir: sortDirection ?? "desc",
  });

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
