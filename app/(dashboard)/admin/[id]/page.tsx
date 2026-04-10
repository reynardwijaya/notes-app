import AppLayout from "@/app/components/layout/AppLayout";
import NotesDashboardShell from "@/app/(dashboard)/notes/components/NotesDashboardShell";
import { createClient } from "@/lib/supabase/server";
import { getUserOverview } from "@/app/(dashboard)/admin/utils/getUserOverview";
import { getNotesForUser } from "@/app/(dashboard)/admin/utils/getNotesForUser";
import { getCategoriesForUser } from "@/app/(dashboard)/admin/utils/getCategoriesForUser";
import NoDataAvailableDialog from "@/app/(dashboard)/admin/components/NoDataAvailableDialog";
import AdminUserDetailHeader from "@/app/(dashboard)/admin/components/AdminUserDetailHeader";
import { Box, Stack, Typography } from "@mui/material";

// Ambil params dari URL -> /admin/users/[id]
export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Ambil current logged-in user (validasi role dan tracking akses)
  const supabase = await createClient();
  const {
    data: { user: adminUser },
  } = await supabase.auth.getUser();

  //Ambil data user yang ingin dilihat
  const userRes = await getUserOverview({ id });

  if ("error" in userRes) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{userRes.error}</Typography>
      </Box>
    );
  }

  // Simpan user yang valid
  const viewedUser = userRes.user;

  // set up pagination: fetch notes and categories only after know the user exists.
  const FOLDER_PAGE_SIZE = 6;

  // Fetch categories & notes (paralel)
  const [categories, initialNotes] = await Promise.all([
    getCategoriesForUser({ userId: id }),
    getNotesForUser({ userId: id, page: 0, pageSize: 10, search: "" }),
  ]);

  // Normalize data categories
  const shellCategories = categories.map((c) => ({
    id: c.id,
    name: c.name,
    created_at: c.created_at,
    total_notes: Number(c.total_notes ?? 0),
  }));

  // empty data state 
  const showNoData = initialNotes.data.length === 0 && categories.length === 0;

  return (
    <AppLayout
      pageTitle="User Detail"
      userEmail={adminUser?.email ?? ""}
      role="admin"
    >
      <NoDataAvailableDialog open={showNoData} />
      <Stack spacing={2}>
        <AdminUserDetailHeader
          email={viewedUser.email}
          role={viewedUser.role}
        />

        <NotesDashboardShell
          initialData={initialNotes.data}
          initialTotal={initialNotes.total}
          categories={shellCategories}
          categoryFolderInitial={{
            rows: shellCategories.slice(0, FOLDER_PAGE_SIZE),
            total: shellCategories.length,
            pageSize: FOLDER_PAGE_SIZE,
          }}
          readOnly
          hideCreateButtons
          notesScopeUserId={id}
        />
      </Stack>
    </AppLayout>
  );
}
