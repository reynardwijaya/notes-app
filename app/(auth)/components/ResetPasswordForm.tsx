"use client";

import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { useResetPassword } from "../action/useResetPassword";

export default function ResetPasswordForm() {
  const {
    password,
    confirm,
    setPassword,
    setConfirm,
    status,
    saving,
    canSubmit,
    handleSubmit,
  } = useResetPassword();

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <TextField
        label="New password"
        type="password"
        required
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={status !== "ready" || saving}
        helperText="Minimum 8 characters"
      />

      <TextField
        label="Confirm new password"
        type="password"
        required
        fullWidth
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        disabled={status !== "ready" || saving}
        error={confirm.length > 0 && password !== confirm}
      />

      <Button
        type="submit"
        variant="contained"
        disabled={!canSubmit}
        fullWidth
      >
        {saving ? <CircularProgress size={20} /> : "Update Password"}
      </Button>

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