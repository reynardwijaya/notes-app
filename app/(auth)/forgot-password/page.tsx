"use client";

import Link from "next/link";
import { Box, Typography } from "@mui/material";
import ForgotPasswordForm from "@/app/(auth)/components/ForgotPasswordForm";
import AuthPageShell from "@/app/(auth)/components/AuthPageShell";

export default function ForgotPasswordPage() {
  return (
    <AuthPageShell
      title="Forgot Password?"
      subtitle="Enter your email and we'll send you a reset link"
      footer={
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
          Remember your password?{" "}
          <Box
            component={Link}
            href="/login"
            sx={{
              color: "primary.main",
              fontWeight: 600,
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Back to Login
          </Box>
        </Typography>
      }
    >
      <ForgotPasswordForm />
    </AuthPageShell>
  );
}
