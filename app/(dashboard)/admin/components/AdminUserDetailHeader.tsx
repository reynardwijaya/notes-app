"use client";

import Link from "next/link";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";

type Props = {
  email: string;
  role: string;
};

export default function AdminUserDetailHeader({ email, role }: Props) {
  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        p: 2,
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        boxShadow: "0 4px 14px rgba(15,23,42,0.06)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          boxShadow: 3,
          transform: "translateY(-2px)",
        },
      }}
    >
      <Stack spacing={0.75} sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: "text.primary",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {email}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            Role:
          </Typography>
          <Box
            component="span"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              borderRadius: 999,
              border: 1,
              borderColor: "divider",
              bgcolor: "grey.50",
              px: 1.25,
              py: 0.25,
              typography: "caption",
              fontWeight: 600,
              color: "text.secondary",
            }}
          >
            {role}
          </Box>
        </Stack>
      </Stack>

      <Button
        component={Link}
        href="/admin"
        variant="contained"
        size="small"
        sx={{
          textTransform: "none",
          borderRadius: 2,
          px: 2,
          py: 0.75,
          fontWeight: 600,
          flexShrink: 0,
          bgcolor: "grey.900",
          "&:hover": { bgcolor: "grey.800" },
        }}
      >
        Back
      </Button>
    </Paper>
  );
}
