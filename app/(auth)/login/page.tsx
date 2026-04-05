"use client";

import Link from "next/link";
import { Box, Typography } from "@mui/material";
import LoginForm from "@/app/(auth)/components/LoginForm";
import AuthPageShell from "@/app/(auth)/components/AuthPageShell";

export default function LoginPage() {
  return (
    <AuthPageShell
      title="Welcome back"
      subtitle="Login to your account"
      footer={
        <Box
          sx={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Don&apos;t have an account?{" "}
            <Box
              component={Link}
              href="/register"
              sx={{
                color: "primary.main",
                fontWeight: 600,
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Register
            </Box>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Forgot your password?{" "}
            <Box
              component={Link}
              href="/forgot-password"
              sx={{
                color: "primary.main",
                fontWeight: 600,
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Reset here
            </Box>
          </Typography>
        </Box>
      }
    >
      <LoginForm />
    </AuthPageShell>
  );
}
