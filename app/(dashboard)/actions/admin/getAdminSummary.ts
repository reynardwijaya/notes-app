"use server";

import { requireAdmin } from "@/app/(dashboard)/actions/admin/guards";
import type {
  AdminDashboardTotals,
  MostActiveUser,
} from "@/app/(dashboard)/actions/admin/types";

type AdminTotalsRpcRow = { total_users: number; total_notes: number };
type UserEmailRow = { email: string | null };
type MostActiveUserRow = { user_id: string; total_notes: number };

function isAdminTotalsRow(value: unknown): value is AdminTotalsRpcRow {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.total_users === "number" && typeof v.total_notes === "number";
}

function isMostActiveUserRow(value: unknown): value is MostActiveUserRow {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.user_id === "string" && typeof v.total_notes === "number";
}

export async function getAdminSummary(): Promise<
  | { success: true; totals: AdminDashboardTotals; mostActive: MostActiveUser | null }
  | { error: string }
> {
  const admin = await requireAdmin();
  if (!admin.ok) return { error: admin.error };

  const { supabase } = admin;

  const [{ data: totalsData, error: totalsError }, { data: mostActiveData, error: mostError }] =
    await Promise.all([
      supabase.rpc("get_admin_dashboard"),
      supabase.rpc("get_most_active_user"),
    ]);

  if (totalsError) return { error: totalsError.message };
  if (mostError) return { error: mostError.message };

  const totalsRow = Array.isArray(totalsData)
    ? totalsData.find((r) => isAdminTotalsRow(r)) ?? null
    : isAdminTotalsRow(totalsData)
      ? totalsData
      : null;
  const totals: AdminDashboardTotals = {
    total_users: Number(totalsRow?.total_users ?? 0),
    total_notes: Number(totalsRow?.total_notes ?? 0),
  };

  const most =
    Array.isArray(mostActiveData)
      ? mostActiveData.find((r) => isMostActiveUserRow(r)) ?? null
      : isMostActiveUserRow(mostActiveData)
        ? mostActiveData
        : null;
  if (!most?.user_id) return { success: true, totals, mostActive: null };

  const { data: userRows, error: userErr } = await supabase
    .from("users")
    .select("email")
    .eq("id", most.user_id)
    .limit(1);

  if (userErr) return { error: userErr.message };

  const userRow = Array.isArray(userRows) ? userRows[0] : undefined;
  const email =
    userRow && typeof userRow === "object" && userRow !== null && "email" in userRow
      ? String((userRow as UserEmailRow).email ?? "")
      : "";

  return {
    success: true,
    totals,
    mostActive: {
      user_id: most.user_id,
      email,
      total_notes: Number(most.total_notes ?? 0),
    },
  };
}

