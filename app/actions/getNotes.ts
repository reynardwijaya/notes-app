"use server";

import { createClient } from "@/lib/supabase/server";

export type NoteWithCategory = {
  id: string;
  title: string;
  content: string;
  category_id: string;
  category_name: string;
  created_at: string;
};

export async function getNotes({
  page,
  pageSize,
  search,
}: {
  page: number;
  pageSize: number;
  search: string;
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

  const { data, error, count } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const rows = (data ?? []).map((row) => {
    const categoryName =
      typeof (row as any)?.note_categories?.name === "string"
        ? (row as any).note_categories.name
        : "";

    return {
      id: String((row as any).id),
      title: String((row as any).title ?? ""),
      content: String((row as any).content ?? ""),
      category_id: String((row as any).category_id ?? ""),
      category_name: categoryName,
      created_at: String((row as any).created_at ?? ""),
    } satisfies NoteWithCategory;
  });

  return {
    data: rows,
    total: count ?? 0,
  };
}

