import AppLayout from "@/app/components/layout/AppLayout";
import NotesDashboardShell from "@/app/(dashboard)/notes/components/NotesDashboardShell";
import { createClient } from "@/lib/supabase/server";
import { getUserOverview } from "@/app/(dashboard)/admin/utils/getUserOverview";
import { getNotesForUser } from "@/app/(dashboard)/admin/utils/getNotesForUser";
import { getCategoriesForUser } from "@/app/(dashboard)/admin/utils/getCategoriesForUser";
import NoDataAvailableDialog from "@/app/(dashboard)/admin/components/NoDataAvailableDialog";
import AdminUserDetailHeader from "@/app/(dashboard)/admin/components/AdminUserDetailHeader";
import { Box, Stack, Typography } from "@mui/material";

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

  // fetch the user by id first so "User not found" is only shown for truly non-existing users.
  const userRes = await getUserOverview({ id });

  if ("error" in userRes) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{userRes.error}</Typography>
      </Box>
    );
  }

  const viewedUser = userRes.user;

  // fetch notes and categories only after we know the user exists.
  const FOLDER_PAGE_SIZE = 6;

  const [categories, initialNotes] = await Promise.all([
    getCategoriesForUser({ userId: id }),
    getNotesForUser({ userId: id, page: 0, pageSize: 10, search: "" }),
  ]);

  const shellCategories = categories.map((c) => ({
    id: c.id,
    name: c.name,
    created_at: c.created_at,
    total_notes: Number(c.total_notes ?? 0),
  }));

  // empty data state is handled separately from "User not found".
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
