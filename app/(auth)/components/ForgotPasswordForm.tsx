"use client";

import { TextField, Button, Box, CircularProgress } from "@mui/material";
import { useForgotPassword } from "../action/useForgotPassword";

export default function ForgotPasswordForm() {
  const { email, setEmail, handleReset, loading } = useForgotPassword();

  return (
    <Box
      component="form"
      onSubmit={handleReset}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <TextField
        label="Email"
        type="email"
        required
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={loading}
      >
        {loading ? (
          <CircularProgress size={20} sx={{ color: "white" }} />
        ) : (
          "Send Reset Link"
        )}
      </Button>
    </Box>
  );
}