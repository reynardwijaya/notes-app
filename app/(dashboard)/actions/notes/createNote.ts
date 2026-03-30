"use server";

import { createClient } from "@/lib/supabase/server";
import { createNoteSchema } from "@/lib/validations/note";
import * as v from "valibot";
import { mapNoteRow } from "@/app/(dashboard)/actions/notes/supabaseMappers";
import type { NoteSaveInput, NoteSaveResult } from "@/app/(dashboard)/actions/notes/types";

export async function createNote(input: NoteSaveInput): Promise<NoteSaveResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

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
    .insert({
      title,
      content,
      category_id,
      user_id: user.id,
    })
    .select("id,title,content,category_id,created_at,note_categories(name)")
    .single();

  if (error) return { error: error.message };
  if (!data) return { error: "Failed to create note" };

  return { success: true, note: mapNoteRow(data) };
}

