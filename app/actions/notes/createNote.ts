"use server";

import { createClient } from "@/lib/supabase/server";
import { createNoteSchema } from "@/lib/validations/note";
import * as v from "valibot";

export async function createNote(formData: FormData) {
  const supabase = await createClient();

  // Ambil user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  // Ambil data dari form
  const rawData = {
    title: formData.get("title"),
    content: formData.get("content"),
    category_id: formData.get("category_id") || null,
  };

  // VALIDATION
  const parsed = v.safeParse(createNoteSchema, rawData);
  if (!parsed.success) return { error: parsed.issues[0].message };

  const { title, content, category_id } = parsed.output;

  // INSERT RLS SAFE
  const { error } = await supabase.from("notes").insert({
    title,
    content,
    category_id,
    user_id: user.id, // RLS
  });

  if (error) return { error: error.message };

  return { success: true };
}
