import { ReactNode } from "react";
import TopBar from "./TopBar";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

interface Props {
  children: ReactNode;
  pageTitle: string;
  userEmail?: string;
  role?: "admin" | "user";
}

export default async function AppLayout({ children, pageTitle }: Props) {
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
    const { data, error } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    console.log("ROLE DATA:", data, error); // debug

    if (data?.role === "admin") {
      role = "admin";
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar pageTitle={pageTitle} email={user?.email} role={role} />
      <main className="p-6">{children}</main>
    </div>
  );
}
