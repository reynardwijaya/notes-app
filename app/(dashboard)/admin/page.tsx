import AppLayout from "@/app/components/layout/AppLayout";
import { createClient } from "@/lib/supabase/server";
import UsersTable from "@/app/components/admin/UsersTable";
import { requireAdmin } from "@/app/(dashboard)/actions/admin/guards";
import { Users, FileText, UserCheck } from "lucide-react"; // atau gunakan Heroicons/MUI icons

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

function parseAdminDashboardResponse(
  value: unknown,
): AdminDashboardRpcResponse {
  const fallback: AdminDashboardRpcResponse = {
    total_users: 0,
    total_notes: 0,
    most_active_user: null,
    users: [],
  };

  if (!isRecord(value)) return fallback;

  const total_users =
    typeof value.total_users === "number"
      ? value.total_users
      : fallback.total_users;
  const total_notes =
    typeof value.total_notes === "number"
      ? value.total_notes
      : fallback.total_notes;

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
      total_categories:
        typeof u.total_categories === "number" ? u.total_categories : 0,
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

  const parsed = parseAdminDashboardResponse(data);
  const mostActive = parsed.most_active_user;

  return (
    <AppLayout
      pageTitle="Admin Dashboard"
      userEmail={user?.email ?? ""}
      role="admin"
    >
      <div className="space-y-4">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Total Users */}
          <div className="group relative rounded-2xl border border-slate-100/50 bg-white/70 p-4 shadow-sm backdrop-blur-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 p-2.5 shadow-sm">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Users
                </p>
                <h3 className="text-2xl font-bold text-slate-900 mt-0.5">
                  {parsed.total_users}
                </h3>
              </div>
            </div>
          </div>

          {/* Total Notes */}
          <div className="group relative rounded-2xl border border-slate-100/50 bg-white/70 p-4 shadow-sm backdrop-blur-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 p-2.5 shadow-sm">
                <FileText className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Notes
                </p>
                <h3 className="text-2xl font-bold text-slate-900 mt-0.5">
                  {parsed.total_notes}
                </h3>
              </div>
            </div>
          </div>

          {/* Most Active User */}
          <div className="group relative rounded-2xl border border-slate-100/50 bg-white/70 p-4 shadow-sm backdrop-blur-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 p-2.5 shadow-sm">
                <UserCheck className="h-5 w-5 text-purple-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                  Active User
                </p>
                {mostActive ? (
                  <>
                    <div className="text-sm font-semibold text-slate-900 truncate">
                      {mostActive.email || mostActive.id}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {mostActive.total_notes} notes
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-slate-500">No data</div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="mx-auto flex w-full max-w-[980px] items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">
              User&apos;s Detail
            </h2>
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
