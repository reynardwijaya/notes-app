"use server";

import { createClient } from "@/lib/supabase/server";
import { createNoteSchema } from "@/lib/validations/note";
import * as v from "valibot";

export type CreatedNote = {
  id: string;
  title: string;
  content: string;
  category_id: string;
  category_name: string;
  created_at: string;
};

export async function createNote(input: {
  title: string;
  content: string;
  categoryId: string;
}): Promise<{ success: true; note: CreatedNote } | { error: string }> {
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
  if (!parsed.success) return { error: parsed.issues[0]?.message ?? "Invalid input" };

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

  const categoryName =
    typeof (data as any)?.note_categories?.name === "string"
      ? (data as any).note_categories.name
      : "";

  return {
    success: true,
    note: {
      id: String((data as any).id),
      title: String((data as any).title ?? ""),
      content: String((data as any).content ?? ""),
      category_id: String((data as any).category_id ?? ""),
      category_name: categoryName,
      created_at: String((data as any).created_at ?? ""),
    },
  };
}

