"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "@/lib/toast";

type RecoveryStatus = "checking" | "ready" | "missing" | "error";

function parseHashParams(hash: string): URLSearchParams {
  const trimmed = hash.startsWith("#") ? hash.slice(1) : hash;
  return new URLSearchParams(trimmed);
}

export function useResetPassword() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<RecoveryStatus>("checking");
  const [saving, setSaving] = useState(false);

  const canSubmit = useMemo(() => {
    if (status !== "ready") return false;
    if (saving) return false;
    if (!password || password.length < 8) return false;
    if (password !== confirm) return false;
    return true;
  }, [confirm, password, saving, status]);

  useEffect(() => {
    let cancelled = false;

    async function ensureRecoverySession() {
      try {
        const code =
          typeof window !== "undefined"
            ? new URLSearchParams(window.location.search).get("code")
            : null;

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        } else if (typeof window !== "undefined" && window.location.hash) {
          const p = parseHashParams(window.location.hash);
          const access_token = p.get("access_token");
          const refresh_token = p.get("refresh_token");
          const type = p.get("type");

          if (type === "recovery" && access_token && refresh_token) {
            const { error } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });
            if (error) throw error;
          }
        }

        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (cancelled) return;
        setStatus(data.session ? "ready" : "missing");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to validate reset link";
        if (!cancelled) {
          setStatus("error");
          toast.error(message, 4000);
        }
      }
    }

    void ensureRecoverySession();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      toast.success("Password updated successfully", 3000);
      router.push("/login");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update password";
      toast.error(message, 4000);
    } finally {
      setSaving(false);
    }
  };

  return {
    password,
    confirm,
    setPassword,
    setConfirm,
    status,
    saving,
    canSubmit,
    handleSubmit,
  };
}