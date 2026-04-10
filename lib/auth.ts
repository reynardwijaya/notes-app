import { supabase } from "./supabase";

export async function login(email: string, password: string) {
  return await supabase.auth.signInWithPassword({ email, password });
}

export async function register(email: string, password: string) {
  return await supabase.auth.signUp({ email, password });
}

export async function resetPassword(email: string) {
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000";

  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/reset-password`,
  });
}
