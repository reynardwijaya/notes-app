import AppLayout from "@/app/components/layout/AppLayout";
import NotesDashboardShell from "@/app/(dashboard)/notes/components/NotesDashboardShell";
import { createClient } from "@/lib/supabase/server";
import { getUserOverview } from "@/app/(dashboard)/admin/utils/getUserOverview";
import { getNotesForUser } from "@/app/(dashboard)/admin/utils/getNotesForUser";
import { getCategoriesForUser } from "@/app/(dashboard)/admin/utils/getCategoriesForUser";
import NoDataAvailableDialog from "@/app/(dashboard)/admin/components/NoDataAvailableDialog";
import Link from "next/link";

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user: adminUser },
  } = await supabase.auth.getUser();

  // Step 1: fetch the user by id first so "User not found" is only shown for truly non-existing users.
  const userRes = await getUserOverview({ id });

  if ("error" in userRes) {
    return <div className="p-6 text-red-500">{userRes.error}</div>;
  }

  const viewedUser = userRes.user;

  // Step 2: fetch notes and categories only after we know the user exists.
  const [categories, initialNotes] = await Promise.all([
    getCategoriesForUser({ userId: id }),
    getNotesForUser({ userId: id, page: 0, pageSize: 10, search: "" }),
  ]);

  // Step 3: empty data state is handled separately from "User not found".
  const showNoData = initialNotes.data.length === 0 && categories.length === 0;

  return (
    <AppLayout
      pageTitle="User Detail"
      userEmail={adminUser?.email ?? ""}
      role="admin"
    >
      <NoDataAvailableDialog open={showNoData} />
      <div className="space-y-4">
        <div className="flex w-full items-center justify-between gap-4 rounded-2xl border border-slate-100/50 bg-white/80 p-4 shadow-sm backdrop-blur-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex flex-col gap-1.5 min-w-0">
            <div className="truncate text-sm font-semibold text-slate-900 leading-tight">
              {viewedUser.email}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500">Role:</span>
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50/80 px-2.5 py-0.75 text-xs font-medium text-slate-700 shadow-sm backdrop-blur-sm">
                {viewedUser.role}
              </span>
            </div>
          </div>

          <Link
            href="/admin"
            className="group inline-flex h-9 items-center justify-center rounded-xl bg-slate-900 px-4 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:bg-slate-950 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-slate-500/30"
          >
            <span className="transition-transform group-hover:-translate-x-0.5">
              Back
            </span>
          </Link>
        </div>

        <NotesDashboardShell
          initialData={initialNotes.data}
          initialTotal={initialNotes.total}
          categories={categories.map((c) => ({
            id: c.id,
            name: c.name,
            created_at: c.created_at,
            total_notes: c.total_notes,
          }))}
          readOnly
          hideCreateButtons
          notesScopeUserId={id}
        />
      </div>
    </AppLayout>
  );
}
