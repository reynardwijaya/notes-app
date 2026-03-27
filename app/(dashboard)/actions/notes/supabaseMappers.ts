type NoteCategoryJoin = { name: string | null } | null;

export type NoteSelectRow = {
  id: string;
  title: string;
  content: string;
  category_id: string;
  created_at: string;
  note_categories: NoteCategoryJoin;
};

export function mapNoteRow(row: NoteSelectRow) {
  const categoryName =
    typeof row.note_categories?.name === "string" ? row.note_categories.name : "";

  return {
    id: String(row.id),
    title: String(row.title ?? ""),
    content: String(row.content ?? ""),
    category_id: String(row.category_id ?? ""),
    category_name: categoryName,
    created_at: String(row.created_at ?? ""),
  } as const;
}

