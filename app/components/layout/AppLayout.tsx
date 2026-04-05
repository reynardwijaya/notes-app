"use client";

import { ReactNode } from "react";
import { Box } from "@mui/material";
import TopBar from "./TopBar";

interface Props {
  children: ReactNode;
  pageTitle: string;
  userEmail?: string;
  role?: "admin" | "user";
}

export default function AppLayout({
  children,
  pageTitle,
  userEmail,
  role = "user",
}: Props) {
  return (
    <Box
      component="div"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      <TopBar pageTitle={pageTitle} email={userEmail} role={role} />
      <Box component="main" sx={{ flex: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  );
}
