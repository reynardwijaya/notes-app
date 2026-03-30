"use server";

import { requireAdmin } from "@/app/(dashboard)/actions/admin/guards";
import { mapNoteRow } from "@/app/(dashboard)/actions/notes/supabaseMappers";
import type { NoteWithCategory } from "@/app/(dashboard)/actions/notes/types";

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

  const safePage = Number.isFinite(input.page) && input.page >= 0 ? input.page : 0;
  const safePageSize =
    Number.isFinite(input.pageSize) && input.pageSize > 0 && input.pageSize <= 100
      ? input.pageSize
      : 10;
  const safeSearch = (input.search ?? "").trim();
  const safeFromDate = (input.fromDate ?? "").trim();
  const safeToDate = (input.toDate ?? "").trim();
  const safeCategoryId = (input.categoryId ?? "").trim();

  const from = safePage * safePageSize;
  const to = from + safePageSize - 1;

  let query = supabase
    .from("notes")
    .select("id,title,content,category_id,created_at,note_categories(name)", {
      count: "exact",
    })
    .eq("user_id", safeUserId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (safeSearch) query = query.ilike("title", `%${safeSearch}%`);
  if (safeCategoryId) query = query.eq("category_id", safeCategoryId);
  if (safeFromDate) {
    query = query.gte("created_at", new Date(`${safeFromDate}T00:00:00.000Z`).toISOString());
  }
  if (safeToDate) {
    query = query.lte("created_at", new Date(`${safeToDate}T23:59:59.999Z`).toISOString());
  }

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  const rows = Array.isArray(data) ? data : [];
  return {
    data: rows.map((r) => mapNoteRow(r)),
    total: count ?? 0,
  };
}

