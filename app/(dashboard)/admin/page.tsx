import AppLayout from "@/app/components/layout/AppLayout";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getDashboardData } from "./lib/getDashboardData";

type NotesPerUser = {
  user_id: string;
  total_notes: number;
};

type NotesPerCategory = {
  category: string;
  total: number;
};

type MostActiveUser = {
  user_id: string;
  total_notes: number;
};

type AdminDashboardData = {
  total_users: number;
  total_notes: number;
};

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let role: "admin" | "user" = "user";

  if (user) {
    const { data } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (data?.role === "admin") {
      role = "admin";
    }
  }

  if (role !== "admin") {
    return <div className="p-6 text-red-500">Unauthorized</div>;
  }

  // DATA (CAST TYPES)
  const {
    totalData,
    notesPerUser,
    notesPerCategory,
    mostActive,
  }: {
    totalData: AdminDashboardData | null;
    notesPerUser: NotesPerUser[] | null;
    notesPerCategory: NotesPerCategory[] | null;
    mostActive: MostActiveUser[] | null;
  } = await getDashboardData();

  return (
    <AppLayout
      pageTitle="Admin Dashboard"
      userEmail={user?.email || ""}
      role={role}
    >
      <div className="space-y-6">
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500 text-sm">Total Users</p>
            <h2 className="text-3xl font-bold text-gray-800">
              {totalData?.total_users || 0}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500 text-sm">Total Notes</p>
            <h2 className="text-3xl font-bold text-gray-800">
              {totalData?.total_notes || 0}
            </h2>
          </div>
        </div>

        {/* NOTES PER USER */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Notes per User
          </h2>

          {notesPerUser?.length ? (
            <ul className="space-y-2 text-gray-600">
              {notesPerUser.map((item: NotesPerUser) => (
                <li key={item.user_id}>
                  User {item.user_id.slice(0, 6)} → {item.total_notes} notes
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No data</p>
          )}
        </div>

        {/* NOTES PER CATEGORY */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Notes per Category
          </h2>

          {notesPerCategory?.length ? (
            <ul className="space-y-2 text-gray-600">
              {notesPerCategory.map((item: NotesPerCategory) => (
                <li key={item.category}>
                  {item.category} → {item.total}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No data</p>
          )}
        </div>

        {/* MOST ACTIVE USER */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Most Active User
          </h2>

          {mostActive?.length ? (
            <p className="text-gray-600">
              User {mostActive[0].user_id.slice(0, 6)} dengan{" "}
              <span className="font-semibold">{mostActive[0].total_notes}</span>{" "}
              notes
            </p>
          ) : (
            <p className="text-gray-400">No data</p>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
