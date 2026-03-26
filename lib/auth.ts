import { supabase } from "./supabase";

export async function login(email: string, password: string) {
  return await supabase.auth.signInWithPassword({ email, password });
}

export async function register(email: string, password: string) {
  return await supabase.auth.signUp({ email, password });
}

export async function resetPassword(email: string) {
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "http://localhost:3000/auth/login",
  });
}
