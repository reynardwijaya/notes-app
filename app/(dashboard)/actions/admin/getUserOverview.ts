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
    // IMPORTANT: "user existence" must be independent from notes/categories.
    // If the profile row in `users` is missing, fall back to auth user existence.
    // This avoids incorrectly returning "User not found" for users with no data.
    try {
      const authAdmin: unknown = (supabase as unknown as { auth?: { admin?: unknown } }).auth
        ?.admin;

      type AuthAdminLike = {
        getUserById?: unknown;
        getUser?: unknown;
      };

      type GetUserFn = (
        userId: string
      ) => Promise<{
        data?: { user?: { email?: string | null } | null } | null;
        error?: { message?: string } | null;
      }>;

      const adminLike = authAdmin as AuthAdminLike;
      const maybeGetUserById = adminLike.getUserById;
      const maybeGetUser = adminLike.getUser;

      const getUserFn: GetUserFn | null =
        typeof maybeGetUserById === "function"
          ? (maybeGetUserById as GetUserFn)
          : typeof maybeGetUser === "function"
            ? (maybeGetUser as GetUserFn)
            : null;

      if (getUserFn) {
        const { data: authData, error: authError } = await getUserFn.call(authAdmin, input.id);
        const authUser = authData?.user ?? null;
        if (!authError && authUser) {
          return {
            success: true,
            user: {
              id: input.id,
              email: String(authUser.email ?? ""),
              // If we cannot read role from `users`, default to "user".
              role: "user",
            },
          };
        }
      }
    } catch {
      // If auth admin API isn't available, we fall back to the original behavior.
    }

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

