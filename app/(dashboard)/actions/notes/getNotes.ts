"use server";

import { createClient } from "@/lib/supabase/server";
import { mapNoteRow } from "@/app/(dashboard)/actions/notes/supabaseMappers";
import type { NoteWithCategory } from "@/app/(dashboard)/actions/notes/types";

export async function getNotes({
  page,
  pageSize,
  search,
  fromDate,
  toDate,
  categoryId,
}: {
  page: number;
  pageSize: number;
  search: string;
  fromDate?: string | null;
  toDate?: string | null;
  categoryId?: string | null;
}): Promise<{ data: NoteWithCategory[]; total: number }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { data: [], total: 0 };

  const safePage = Number.isFinite(page) && page >= 0 ? page : 0;
  const safePageSize =
    Number.isFinite(pageSize) && pageSize > 0 && pageSize <= 100 ? pageSize : 10;
  const safeSearch = (search ?? "").trim();
  const safeFromDate = (fromDate ?? "").trim();
  const safeToDate = (toDate ?? "").trim();
  const safeCategoryId = (categoryId ?? "").trim();

  const from = safePage * safePageSize;
  const to = from + safePageSize - 1;

  let query = supabase
    .from("notes")
    .select("id,title,content,category_id,created_at,note_categories(name)", {
      count: "exact",
    })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (safeSearch) {
    query = query.ilike("title", `%${safeSearch}%`);
  }

  if (safeCategoryId) {
    query = query.eq("category_id", safeCategoryId);
  }

  // Dates are expected as YYYY-MM-DD. We filter by ISO strings to avoid TZ surprises.
  if (safeFromDate) {
    query = query.gte("created_at", new Date(`${safeFromDate}T00:00:00.000Z`).toISOString());
  }
  if (safeToDate) {
    query = query.lte("created_at", new Date(`${safeToDate}T23:59:59.999Z`).toISOString());
  }

  const { data, error, count } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const list = Array.isArray(data) ? data : [];
  const rows: NoteWithCategory[] = list.map((row) => mapNoteRow(row));

  return {
    data: rows,
    total: count ?? 0,
  };
}

