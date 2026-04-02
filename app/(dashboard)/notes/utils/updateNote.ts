"use server";

import { createClient } from "@/lib/supabase/server";
import { createNoteSchema } from "@/lib/validations/note";
import * as v from "valibot";
import { mapNoteRow } from "@/app/(dashboard)/notes/utils/supabaseMappers";
import type {
  NoteSaveInput,
  NoteSaveResult,
} from "@/app/(dashboard)/notes/utils/types";

export async function updateNote(
  input: {
    id: string;
  } & NoteSaveInput,
): Promise<NoteSaveResult> {
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

  const { data, error } = await supabase.rpc("update_note", {
    p_id: input.id,
    p_title: title,
    p_content: content,
    p_category_id: category_id,
  });

  if (error) return { error: error.message };
  if (!data || data.length === 0) {
    return { error: "Failed to update note" };
  }

  return {
    success: true,
    note: mapNoteRow(data[0]),
  };
}
