"use server";

import { createClient } from "@/lib/supabase/server";
import { createNoteSchema } from "@/lib/validations/note";
import * as v from "valibot";
import { mapNoteRow, type NoteSelectRow } from "@/app/(dashboard)/actions/notes/supabaseMappers";
import type { NoteSaveInput, NoteSaveResult } from "@/app/(dashboard)/actions/notes/types";

export async function updateNote(input: {
  id: string;
} & NoteSaveInput): Promise<NoteSaveResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };
  if (!input.id) return { error: "Missing note id" };

  const rawData = {
    title: input.title,
    content: input.content,
    category_id: input.categoryId,
  };

  const parsed = v.safeParse(createNoteSchema, rawData);
  if (!parsed.success) {
    return { error: parsed.issues[0]?.message ?? "Invalid input" };
  }

  const { title, content, category_id } = parsed.output;

  const { data, error } = await supabase
    .from("notes")
    .update({
      title,
      content,
      category_id,
    })
    .eq("id", input.id)
    .eq("user_id", user.id)
    .select("id,title,content,category_id,created_at,note_categories(name)")
    .single()
    .returns<NoteSelectRow>();

  if (error) return { error: error.message };
  if (!data) return { error: "Failed to update note" };

  return { success: true, note: mapNoteRow(data) };
}

