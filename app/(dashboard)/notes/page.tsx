import AppLayout from "@/app/components/layout/AppLayout";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export default async function NotesPage() {
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
      .eq("user_id", user.id)
      .single();

    if (data?.role === "admin") {
      role = "admin";
    }
  }

  return (
    <AppLayout pageTitle="My Notes" userEmail={user?.email || ""} role={role}>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            + New Note
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <p className="text-gray-600">
            You don&apos;t have any notes yet. Start by creating one
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
