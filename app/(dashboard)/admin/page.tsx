import AppLayout from "@/app/components/layout/AppLayout";
import { createClient } from "@/lib/supabase/server";
import UsersTable from "@/app/components/admin/UsersTable";
import { requireAdmin } from "@/app/(dashboard)/actions/admin/guards";

type AdminDashboardRpcResponse = {
  total_users: number;
  total_notes: number;
  most_active_user: { id: string; email: string; total_notes: number } | null;
  users: Array<{
    id: string;
    email: string;
    role: string;
    total_categories: number;
    total_notes: number;
    created_at: string;
  }>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function parseAdminDashboardResponse(value: unknown): AdminDashboardRpcResponse {
  const fallback: AdminDashboardRpcResponse = {
    total_users: 0,
    total_notes: 0,
    most_active_user: null,
    users: [],
  };

  if (!isRecord(value)) return fallback;

  const total_users =
    typeof value.total_users === "number" ? value.total_users : fallback.total_users;
  const total_notes =
    typeof value.total_notes === "number" ? value.total_notes : fallback.total_notes;

  const most_active_user_raw = value.most_active_user;
  const most_active_user =
    isRecord(most_active_user_raw) &&
    typeof most_active_user_raw.id === "string" &&
    typeof most_active_user_raw.email === "string" &&
    typeof most_active_user_raw.total_notes === "number"
      ? {
          id: most_active_user_raw.id,
          email: most_active_user_raw.email,
          total_notes: most_active_user_raw.total_notes,
        }
      : null;

  const users_raw = Array.isArray(value.users) ? value.users : [];
  const users = users_raw
    .filter(isRecord)
    .map((u) => ({
      id: typeof u.id === "string" ? u.id : "",
      email: typeof u.email === "string" ? u.email : "",
      role: typeof u.role === "string" ? u.role : "user",
      total_categories: typeof u.total_categories === "number" ? u.total_categories : 0,
      total_notes: typeof u.total_notes === "number" ? u.total_notes : 0,
      created_at: typeof u.created_at === "string" ? u.created_at : "",
    }))
    .filter((u) => u.id);

  return { total_users, total_notes, most_active_user, users };
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const gate = await requireAdmin();
  if (!gate.ok) return <div className="p-6 text-red-500">Unauthorized</div>;

  const { data, error } = await supabase.rpc("get_admin_dashboard");
  if (error) return <div className="p-6 text-red-500">{error.message}</div>;

  console.log("ADMIN DASHBOARD DATA:", data);

  const parsed = parseAdminDashboardResponse(data);
  const mostActive = parsed.most_active_user;

  return (
    <AppLayout pageTitle="Admin Dashboard" userEmail={user?.email ?? ""} role="admin">
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 rounded-2xl border border-gray-100 bg-[#E8F1FF] p-6 shadow-sm">
            <p className="text-gray-600 text-sm">Total Users</p>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-2">
              {parsed.total_users}
            </h2>
          </div>

          <div className="lg:col-span-3 rounded-2xl border border-gray-100 bg-[#EAFBF2] p-6 shadow-sm">
            <p className="text-gray-600 text-sm">Total Notes</p>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-2">
              {parsed.total_notes}
            </h2>
          </div>

          <div className="lg:col-span-6 rounded-2xl border border-gray-100 bg-[#F3E8FF] p-6 shadow-sm">
            <p className="text-gray-600 text-sm">Most Active User</p>
            {mostActive ? (
              <div className="mt-2">
                <div className="text-lg font-extrabold text-gray-900">
                  {mostActive.email || mostActive.id}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  <span className="font-bold text-gray-900">
                    {mostActive.total_notes}
                  </span>{" "}
                  notes
                </div>
              </div>
            ) : (
              <div className="mt-2 text-sm text-gray-600">No data</div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-gray-900">Users</h2>
          </div>
          <UsersTable
            users={parsed.users.map((u) => ({
              id: u.id,
              email: u.email,
              role: u.role === "admin" ? "admin" : "user",
              total_categories: u.total_categories,
              total_notes: u.total_notes,
              created_at: u.created_at,
            }))}
          />
        </div>
      </div>
    </AppLayout>
  );
}
