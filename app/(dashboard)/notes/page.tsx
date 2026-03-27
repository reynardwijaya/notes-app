import AppLayout from "@/app/components/layout/AppLayout";
import NotesDataTable from "@/app/components/notes/NotesDataTable";
import { getNotes } from "@/app/(dashboard)/actions/notes/getNotes";
import { getCategories } from "@/lib/categories/getCategories";
import { createClient } from "@/lib/supabase/server";
import CategoryFolderPanel from "@/app/components/notes/CategoryFolderPanel";

interface UserRole {
  role: "user" | "admin";
}

export default async function NotesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userEmail = user?.email ?? "";

  let role: "user" | "admin" = "user";
  if (user) {
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single()
      .returns<UserRole>();

    if (userData?.role === "admin") role = "admin";
  }

  const [{ data, total }, categories] = await Promise.all([
    getNotes({ page: 0, pageSize: 10, search: "" }),
    getCategories(),
  ]);

  return (
    <AppLayout pageTitle="My Notes" userEmail={userEmail} role={role}>
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6">
            <NotesDataTable
              initialData={data}
              initialTotal={total}
              categories={categories.map((c) => ({ id: c.id, name: c.name }))}
              initialPageSize={10}
            />
          </div>

          <div className="lg:col-span-6">
            <CategoryFolderPanel
              categories={categories.map((c) => ({
                id: c.id,
                name: c.name,
                created_at: c.created_at,
              }))}
              notesInitialData={[]}
              notesInitialTotal={0}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
