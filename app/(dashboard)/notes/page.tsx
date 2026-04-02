import AppLayout from "@/app/components/layout/AppLayout";
import { getNotes } from "@/app/(dashboard)/notes/utils/getNotes";
import { getCategories } from "@/app/(dashboard)/categories/utils/getCategories";
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

  const [{ data, total }, categories] = await Promise.all([
    getNotes({ page: 0, pageSize: 10, search: "" }),
    getCategories(),
  ]);

  return (
    <AppLayout pageTitle="My Notes" userEmail={userEmail} role={role}>
      <NotesDashboardShell
        initialData={data}
        initialTotal={total}
        categories={categories}
      />
    </AppLayout>
  );
}
