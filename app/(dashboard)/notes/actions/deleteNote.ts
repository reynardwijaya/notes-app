"use server";

import { createClient } from "@/lib/supabase/server";

export async function deleteNote(input: {
  id: string;
}): Promise<{ success: true } | { error: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };
  if (!input.id) return { error: "Missing note id" };

  const { error } = await supabase.rpc("delete_note", {
    p_id: input.id,
  });

  if (error) return { error: error.message };
  return { success: true };
}
