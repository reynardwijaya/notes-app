import type { NoteWithCategory } from "@/app/(dashboard)/actions/notes/types";

type NoteCategoryJoin = { name: string | null } | null;

export type NoteSelectRow = {
  id: string;
  title: string;
  content: string;
  category_id: string;
  created_at: string;
  note_categories: NoteCategoryJoin;
};

function categoryNameFromJoin(join: unknown): string {
  if (join == null) return "";
  if (Array.isArray(join)) {
    const first = join[0] as { name?: unknown } | undefined;
    return typeof first?.name === "string" ? first.name : "";
  }
  if (typeof join === "object" && join !== null && "name" in join) {
    const n = (join as { name: unknown }).name;
    return typeof n === "string" ? n : "";
  }
  return "";
}

/** Maps a notes+join row from PostgREST without assuming a single nested shape. */
export function mapNoteRow(row: unknown): NoteWithCategory {
  const r = row as Record<string, unknown>;
  const categoryName = categoryNameFromJoin(r.note_categories);

  return {
    id: String(r.id ?? ""),
    title: String(r.title ?? ""),
    content: String(r.content ?? ""),
    category_id: String(r.category_id ?? ""),
    category_name: categoryName,
    created_at: String(r.created_at ?? ""),
  };
}

