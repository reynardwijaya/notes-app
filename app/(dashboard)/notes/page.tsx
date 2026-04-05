import AppLayout from "@/app/components/layout/AppLayout";
import { getNotes } from "@/app/(dashboard)/notes/utils/getNotes";
import {
  getCategories,
  getCategoriesPaginated,
} from "@/app/(dashboard)/categories/utils/getCategories";
import { createClient } from "@/lib/supabase/server";
import NotesDashboardShell from "@/app/(dashboard)/notes/components/NotesDashboardShell";

export default async function NotesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userEmail = user?.email ?? "";

  let role: "user" | "admin" = "user";

  if (user) {
    const { data: roleData, error } = await supabase.rpc("get_role");

    if (error) throw new Error(error.message);

    if (roleData === "admin") role = "admin";
  }

  const FOLDER_PAGE_SIZE = 6;

  const [{ data, total }, folderPage, allCategories] = await Promise.all([
    getNotes({ page: 0, pageSize: 10, search: "" }),
    getCategoriesPaginated({ page: 0, pageSize: FOLDER_PAGE_SIZE }),
    getCategories(),
  ]);

  const categoriesForForms = allCategories.map((c) => ({
    id: c.id,
    name: c.name,
  }));

  const categoryFolderInitial = {
    rows: folderPage.data,
    total: folderPage.total,
    pageSize: FOLDER_PAGE_SIZE,
  };

  return (
    <AppLayout pageTitle="My Notes" userEmail={userEmail} role={role}>
      <NotesDashboardShell
        initialData={data}
        initialTotal={total}
        categories={categoriesForForms}
        categoryFolderInitial={categoryFolderInitial}
      />
    </AppLayout>
  );
}
