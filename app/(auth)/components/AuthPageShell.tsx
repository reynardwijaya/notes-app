"use client";

import { ReactNode } from "react";
import { Box, Paper } from "@mui/material";

type Props = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
};

export default function AuthPageShell({
  title,
  subtitle,
  children,
  footer,
}: Props) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        px: 2,
      }}
    >
      <Paper
        elevation={2}
        sx={{
          width: "100%",
          maxWidth: 448,
          p: 4,
          borderRadius: 2,
          bgcolor: "background.paper",
        }}
      >
        <Box
          component="h1"
          sx={{
            typography: "h5",
            fontWeight: 600,
            color: "text.primary",
            textAlign: "center",
            m: 0,
          }}
        >
          {title}
        </Box>
        <Box
          component="p"
          sx={{
            typography: "body2",
            color: "text.secondary",
            textAlign: "center",
            mt: 0.5,
            mb: 0,
          }}
        >
          {subtitle}
        </Box>
        <Box sx={{ mt: 3 }}>{children}</Box>
        {footer ? <Box sx={{ mt: 3 }}>{footer}</Box> : null}
      </Paper>
    </Box>
  );
}
