"use client";

import Link from "next/link";
import { Box, Typography } from "@mui/material";
import RegisterForm from "@/app/(auth)/components/RegisterForm";
import AuthPageShell from "@/app/(auth)/components/AuthPageShell";

export default function RegisterPage() {
  return (
    <AuthPageShell
      title="Join Notes App"
      subtitle="Create your account to start managing notes"
      footer={
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
          Already have an account?{" "}
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
      <RegisterForm />
    </AuthPageShell>
  );
}
