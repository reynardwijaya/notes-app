"use server";

import { requireAdmin } from "@/app/(dashboard)/actions/admin/guards";

type UserOverviewRow = { email: string | null; role: "user" | "admin" | null };

export async function getUserOverview(input: {
  id: string;
}): Promise<
  | { success: true; user: { id: string; email: string; role: "user" | "admin" } }
  | { error: string }
> {
  const admin = await requireAdmin();
  if (!admin.ok) return { error: admin.error };

  if (!input.id) return { error: "Missing user id" };

  const { supabase } = admin;

  const { data, error } = await supabase
    .from("users")
    .select("email,role")
    .eq("id", input.id)
    .limit(1);

  if (error) return { error: error.message };

  const row = Array.isArray(data) ? data[0] : undefined;
  if (!row) {
    return { error: "User not found" };
  }

  const dataRow = row as UserOverviewRow;

  return {
    success: true,
    user: {
      id: input.id,
      email: String(dataRow?.email ?? ""),
      role: dataRow?.role === "admin" ? "admin" : "user",
    },
  };
}

