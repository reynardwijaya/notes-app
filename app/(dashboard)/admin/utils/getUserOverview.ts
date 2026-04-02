"use server";

import { requireAdmin } from "@/app/(dashboard)/admin/utils/guards";

type UserOverviewRow = {
  id: string;
  email: string | null;
  role: "user" | "admin" | null;
};

export async function getUserOverview(input: { id: string }): Promise<
  | {
      success: true;
      user: { id: string; email: string; role: "user" | "admin" };
    }
  | { error: string }
> {
  const admin = await requireAdmin();
  if (!admin.ok) return { error: admin.error };

  const userId = (input.id ?? "").trim();
  if (!userId) return { error: "Missing user id" };

  const { supabase } = admin;

  const { data, error } = await supabase.rpc("admin_get_user_overview", {
    p_user_id: userId,
  });

  if (error) return { error: error.message };

  const row = Array.isArray(data) ? (data[0] as UserOverviewRow) : null;

  if (!row) return { error: "User not found" };

  return {
    success: true,
    user: {
      id: row.id,
      email: row.email ?? "",
      role: row.role === "admin" ? "admin" : "user",
    },
  };
}
