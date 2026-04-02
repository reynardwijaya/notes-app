import { Users, FileText, UserCheck } from "lucide-react";
import UsersTable from "@/app/(dashboard)/admin/components/UsersTable";
import { AdminDashboardData } from "../utils/types";

interface DashboardContentProps {
  data: AdminDashboardData;
  userEmail: string;
}

export default function DashboardContent({ data }: DashboardContentProps) {
  const { totals, mostActiveUser, users } = data;

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
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
                {totals.total_users.toLocaleString()}
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
                {totals.total_notes.toLocaleString()}
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
              {mostActiveUser ? (
                <>
                  <div className="text-sm font-semibold text-slate-900 truncate">
                    {mostActiveUser.email || mostActiveUser.id}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {mostActiveUser.total_notes.toLocaleString()} notes
                  </div>
                </>
              ) : (
                <div className="text-sm text-slate-500">No data</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="space-y-2">
        <div className="mx-auto flex w-full max-w-[980px] items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">
            User&apos;s Detail
          </h2>
        </div>
        <UsersTable
          users={users.map((u) => ({
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
  );
}
