"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { supabase } from "@/lib/supabase";
import { toast } from "@/lib/toast";

type RecoveryStatus = "checking" | "ready" | "missing" | "error";

function parseHashParams(hash: string): URLSearchParams {
  const trimmed = hash.startsWith("#") ? hash.slice(1) : hash;
  return new URLSearchParams(trimmed);
}

export default function ResetPasswordForm() {
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
        if (data.session) {
          setStatus("ready");
        } else {
          setStatus("missing");
        }
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

  return (
    <Box
      component="form"
      onSubmit={async (e: React.FormEvent) => {
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
      }}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {/* NEW PASSWORD */}
      <TextField
        label="New password"
        type="password"
        required
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={status !== "ready" || saving}
        helperText="Minimum 8 characters"
        size="medium"
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
          },
        }}
      />

      {/* CONFIRM PASSWORD */}
      <TextField
        label="Confirm new password"
        type="password"
        required
        fullWidth
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        disabled={status !== "ready" || saving}
        error={confirm.length > 0 && password !== confirm}
        size="medium"
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
          },
        }}
      />

      {/* BUTTON */}
      <Button
        type="submit"
        variant="contained"
        disabled={!canSubmit}
        fullWidth
        sx={{
          py: 1.5,
          borderRadius: 2,
          textTransform: "none",
          fontWeight: 600,
          fontSize: "1rem",
        }}
      >
        {saving ? <CircularProgress size={20} /> : "Update Password"}
      </Button>

      {/* STATUS */}
      {status === "checking" && (
        <Box sx={{ color: "text.secondary", fontSize: 13 }}>
          Validating reset link…
        </Box>
      )}

      {status === "missing" && (
        <Box sx={{ color: "error.main", fontSize: 13 }}>
          Reset link is missing or expired. Please request a new one.
        </Box>
      )}
    </Box>
  );
}
