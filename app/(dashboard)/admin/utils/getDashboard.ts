import { createClient } from "@/lib/supabase/server";
import type { 
  AdminTotals, 
  MostActiveUser, 
  AdminUserSummary,
  AdminDashboardData 
} from "./types";
import { requireAdmin } from "./guards";

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

function safeGetNumber(data: Record<string, unknown>, key: string): number {
  const value = data[key];
  return typeof value === "number" ? value : 0;
}

function safeGetString(data: Record<string, unknown>, key: string): string {
  const value = data[key];
  return typeof value === "string" ? value : "";
}

function parseAdminTotals(value: unknown): AdminTotals {
  const fallback: AdminTotals = { total_users: 0, total_notes: 0 };
  
  if (!isRecord(value)) return fallback;
  
  return {
    total_users: safeGetNumber(value, "total_users"),
    total_notes: safeGetNumber(value, "total_notes"),
  };
}

function parseMostActiveUser(value: unknown): MostActiveUser | null {
  if (value === null || !isRecord(value)) return null;

  const data = value as Record<string, unknown>;
  const id = safeGetString(data, "id");
  const email = safeGetString(data, "email");
  const total_notes = safeGetNumber(data, "total_notes");

  if (!id || !email) return null;

  return { id, email, total_notes };
}

function parseAdminUserSummary(value: unknown): AdminUserSummary {
  const fallback: AdminUserSummary = {
    id: "",
    email: "",
    role: "user",
    total_categories: 0,
    total_notes: 0,
    created_at: "",
  };

  if (!isRecord(value)) return fallback;

  const data = value as Record<string, unknown>;
  const id = safeGetString(data, "id");

  if (!id) return fallback;

  return {
    id,
    email: safeGetString(data, "email"),
    role: safeGetString(data, "role") || "user",
    total_categories: safeGetNumber(data, "total_categories"),
    total_notes: safeGetNumber(data, "total_notes"),
    created_at: safeGetString(data, "created_at"),
  };
}

function parseUsersArray(value: unknown): AdminUserSummary[] {
  if (!Array.isArray(value)) return [];
  
  return value
    .filter(isRecord)
    .map(parseAdminUserSummary)
    .filter((user): user is AdminUserSummary => user.id !== "");
}

interface SupabaseRpcResponse {
  data: unknown | null;
  error: { message: string } | null;
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  "use server";

  try {
    const gate = await requireAdmin();
    if (!gate.ok) {
      throw new Error("Unauthorized");
    }

    const supabase = await createClient();

    // ✅ CORRECT Promise.all typing - single generic
    const responses = await Promise.all<SupabaseRpcResponse>([
      supabase.rpc("get_admin_totals"),
      supabase.rpc("get_most_active_user"),
      supabase.rpc("get_admin_users")
    ]) as SupabaseRpcResponse[];

    const [totalsResponse, mostActiveResponse, usersResponse] = responses;

    // Error checking
    if (totalsResponse.error) throw new Error(totalsResponse.error.message);
    if (mostActiveResponse.error) throw new Error(mostActiveResponse.error.message);
    if (usersResponse.error) throw new Error(usersResponse.error.message);

    // Safe data access
    const totalsData = totalsResponse.data;
    const mostActiveData = mostActiveResponse.data;
    const usersData = usersResponse.data;

    return {
      totals: parseAdminTotals(totalsData),
      mostActiveUser: parseMostActiveUser(mostActiveData),
      users: parseUsersArray(usersData),
    };
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return {
      totals: { total_users: 0, total_notes: 0 },
      mostActiveUser: null,
      users: [],
    };
  }
}