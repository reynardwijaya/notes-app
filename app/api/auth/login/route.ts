import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
        set: (name, value, options) => {
          cookieStore.set({ name, value, ...options });
        },
        remove: (name, options) => {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    },
  );

  const { data: loginData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !loginData.user) {
    return NextResponse.json(
      { error: error?.message || "Login failed" },
      { status: 401 },
    );
  }

  const user = loginData.user;

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      role: profile?.role || "user",
    },
  });
}
