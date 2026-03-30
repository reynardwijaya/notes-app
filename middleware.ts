import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value;
        },
        set(name, value, options) {
          res.cookies.set(name, value, options);
        },
        remove(name, options) {
          res.cookies.set(name, "", options);
        },
      },
    },
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = req.nextUrl.pathname;

  // Belum login
  if (
    !session &&
    (pathname.startsWith("/notes") || pathname.startsWith("/admin"))
  ) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Sudah login → jangan ke auth
  if (session && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/notes", req.url));
  }

  // RBAC
  if (session) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let role = "user";

    if (user) {
      const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      role = profile?.role || "user";
    }

    // Admin only
    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/notes", req.url));
    }

    // User only
    if (pathname.startsWith("/notes") && role === "admin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ["/auth/:path*", "/notes/:path*", "/admin/:path*"],
};
