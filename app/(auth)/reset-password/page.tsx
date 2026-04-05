"use client";

import Link from "next/link";
import { Box, Typography } from "@mui/material";
import ResetPasswordForm from "@/app/(auth)/components/ResetPasswordForm";
import AuthPageShell from "@/app/(auth)/components/AuthPageShell";

export default function ResetPasswordPage() {
  return (
    <AuthPageShell
      title="Reset password"
      subtitle="Choose a new password for your account"
      footer={
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
          Back to{" "}
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
            Login
          </Box>
        </Typography>
      }
    >
      <ResetPasswordForm />
    </AuthPageShell>
  );
}
