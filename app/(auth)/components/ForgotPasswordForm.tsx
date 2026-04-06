"use client";

import { useState } from "react";
import { resetPassword } from "@/lib/auth";
import { TextField, Button, Box } from "@mui/material";
import { toast } from "@/lib/toast";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await resetPassword(email);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Check your email for reset link!");
  };

  return (
    <>
      <Box
        component="form"
        onSubmit={handleReset}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {/* EMAIL */}
        <TextField
          label="Email"
          type="email"
          required
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          fullWidth
          sx={{
            py: 1.5,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            fontSize: "1rem",
          }}
        >
          Send Reset Link
        </Button>
      </Box>
    </>
  );
}
