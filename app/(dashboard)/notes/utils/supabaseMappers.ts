import type { NoteWithCategory } from "@/app/(dashboard)/notes/utils/types";

/**
 * Maps data dari RPC (get_notes, create_note, update_note)
 * ke format NoteWithCategory
 */
export function mapNoteRow(row: unknown): NoteWithCategory {
  const r = row as Record<string, unknown>;

  return {
    id: String(r.id ?? ""),
    title: String(r.title ?? ""),
    content: String(r.content ?? ""),
    category_id: String(r.category_id ?? ""),
    category_name: String(r.category_name ?? ""),
    created_at: String(r.created_at ?? ""),
  };
}
