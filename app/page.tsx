"use client";

import { Box, Typography, Button, Stack } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f9fafb",
        px: 2,
      }}
    >
      <Box
        sx={{
          maxWidth: 600,
          textAlign: "center",
        }}
      >
        {/* TITLE */}
        <Typography
          variant="h3"
          fontWeight={700}
          gutterBottom
          sx={{ color: "#111827" }}
        >
          Notes Management System
        </Typography>

        {/* SUBTITLE */}
        <Typography
          variant="body1"
          sx={{
            color: "#6b7280",
            mb: 4,
          }}
        >
          Organize your thoughts, manage your notes, and stay productive. All in
          one simple and secure place.
        </Typography>

        {/* BUTTONS */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
        >
          <Button
            variant="contained"
            size="large"
            onClick={() => router.push("/auth/login")}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Login
          </Button>

          <Button
            variant="outlined"
            size="large"
            onClick={() => router.push("/auth/register")}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Register
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
