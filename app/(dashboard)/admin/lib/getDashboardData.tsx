import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function getDashboardData() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
      },
    }
  );

  const { data: totalData } = await supabase.rpc("get_admin_dashboard");
  const { data: notesPerUser } = await supabase.rpc("get_notes_per_user");
  const { data: notesPerCategory } = await supabase.rpc("get_notes_per_category");
  const { data: mostActive } = await supabase.rpc("get_most_active_user");

  return { totalData, notesPerUser, notesPerCategory, mostActive };
}
