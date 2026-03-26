"use client";

import { useState } from "react";
import { resetPassword } from "@/lib/auth";
import { TextField, Button, Box, Alert } from "@mui/material";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setMessage(null);

    const { error } = await resetPassword(email);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage("Check your email for reset link!");
  };

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {error}
        </Alert>
      )}

      {message && (
        <Alert severity="success" sx={{ mt: 1 }}>
          {message}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleReset}
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
      >
        <TextField
          label="Email"
          type="email"
          required
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button type="submit" variant="contained">
          Send Reset Link
        </Button>
      </Box>
    </>
  );
}
