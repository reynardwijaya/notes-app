"use client";

import { logout } from "@/app/action/logout";
import { Avatar, Box, Button, Stack } from "@mui/material";
import { useTransition } from "react";

interface TopBarProps {
  pageTitle: string;
  email?: string;
  role?: "admin" | "user";
}

export default function TopBarClient({ pageTitle, email, role }: TopBarProps) {
  const [isPending] = useTransition();

  return (
    <Box
      component="header"
      sx={{
        width: "100%",
        bgcolor: "background.paper",
        backdropFilter: "blur(12px)",
        borderBottom: 1,
        borderColor: "divider",
        px: 3,
        py: 1.75,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: 1,
        position: "sticky",
        top: 0,
        zIndex: 40,
      }}
    >
      <Stack spacing={0.5}>
        <Box
          component="h1"
          sx={{
            typography: "h6",
            fontWeight: 600,
            color: "text.primary",
            lineHeight: 1.25,
            m: 0,
          }}
        >
          {pageTitle}
        </Box>
        <Box
          component="span"
          sx={{
            typography: "caption",
            fontWeight: 600,
            color: "text.secondary",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          {role === "admin" ? "Admin" : "Notes"}
        </Box>
      </Stack>

      <Stack direction="row" spacing={1.5} alignItems="center">
        <Stack direction="row" spacing={1.25} alignItems="center" sx={{ pr: 0.5 }}>
          <Avatar
            sx={{
              width: 36,
              height: 36,
              fontSize: "0.875rem",
              bgcolor: role === "admin" ? "primary.main" : "info.main",
              fontWeight: 600,
              boxShadow: 1,
            }}
            alt={email?.split("@")[0] || ""}
          >
            {email?.charAt(0).toUpperCase() || ""}
          </Avatar>
          <Stack spacing={0} sx={{ minWidth: 0 }}>
            <Box
              component="span"
              sx={{
                typography: "body2",
                fontWeight: 500,
                color: "text.primary",
                maxWidth: 120,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {email?.split("@")[0] || "Loading..."}
            </Box>
            <Box
              component="span"
              sx={{
                typography: "caption",
                color: "text.disabled",
                fontWeight: 500,
              }}
            >
              {role === "admin" ? "Admin" : "User"}
            </Box>
          </Stack>
        </Stack>

        <Box
          component="form"
          action={logout}
          onClick={(e) => e.stopPropagation()}
          sx={{ transition: "all 0.2s ease" }}
        >
          <Button
            type="submit"
            variant="contained"
            size="small"
            disabled={isPending}
            color="error"
            sx={{
              minWidth: 68,
              width: 68,
              height: 32,
              px: 1.75,
              py: 0.5,
              fontSize: "0.75rem",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "10px",
              boxShadow: 1,
              "&:hover": {
                boxShadow: 3,
                transform: "translateY(-1px)",
              },
              "&:active": {
                transform: "translateY(0)",
                boxShadow: 1,
              },
              "&:disabled": {
                bgcolor: "action.disabledBackground",
                color: "action.disabled",
                boxShadow: "none",
              },
            }}
          >
            {isPending ? (
              <Box
                component="svg"
                className="animate-spin"
                sx={{ width: 16, height: 16 }}
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </Box>
            ) : (
              <Box component="span" sx={{ fontWeight: 600, letterSpacing: "-0.02em" }}>
                Logout
              </Box>
            )}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
