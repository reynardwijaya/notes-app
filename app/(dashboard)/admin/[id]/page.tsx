import AppLayout from "@/app/components/layout/AppLayout";
import NotesDashboardShell from "@/app/components/notes/NotesDashboardShell";
import { createClient } from "@/lib/supabase/server";
import { getUserOverview } from "@/app/(dashboard)/actions/admin/getUserOverview";
import { getNotesForUser } from "@/app/(dashboard)/actions/admin/getNotesForUser";
import { getCategoriesForUser } from "@/app/(dashboard)/actions/admin/getCategoriesForUser";
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

  const [userRes, categories, initialNotes] = await Promise.all([
    getUserOverview({ id }),
    getCategoriesForUser({ userId: id }),
    getNotesForUser({ userId: id, page: 0, pageSize: 10, search: "" }),
  ]);

  if ("error" in userRes) {
    return <div className="p-6 text-red-500">{userRes.error}</div>;
  }

  const viewedUser = userRes.user;

  return (
    <AppLayout pageTitle="User Detail" userEmail={adminUser?.email ?? ""} role="admin">
      <div className="space-y-4">
        <div className="w-full rounded-2xl border border-gray-100 bg-white p-5 shadow-sm flex items-center justify-between gap-4">
          <div>
            <div className="text-base font-extrabold text-gray-900">
              {viewedUser.email}
            </div>
            <div className="text-sm text-gray-600">{viewedUser.role}</div>
          </div>
          <Link
            href="/admin"
            className="inline-flex items-center rounded-xl border border-gray-200 bg-white px-4 h-10 text-sm font-semibold text-gray-800 hover:bg-gray-50"
          >
            Back
          </Link>
        </div>

        <NotesDashboardShell
          initialData={initialNotes.data}
          initialTotal={initialNotes.total}
          categories={categories.map((c) => ({ id: c.id, name: c.name, created_at: c.created_at }))}
          readOnly
          hideCreateButtons
          notesScopeUserId={id}
        />
      </div>
    </AppLayout>
  );
}

