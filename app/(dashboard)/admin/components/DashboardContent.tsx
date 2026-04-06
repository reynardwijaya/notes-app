"use client";

import { Users, FileText, UserCheck } from "lucide-react";
import { Box, Paper, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import UsersTable from "@/app/(dashboard)/admin/components/UsersTable";
import { AdminDashboardData } from "../utils/types";

interface DashboardContentProps {
  data: AdminDashboardData;
  userEmail: string;
}

export default function DashboardContent({ data }: DashboardContentProps) {
  const theme = useTheme();
  const { totals, mostActiveUser, users } = data;

  return (
    <Stack
      direction="column"
      spacing={1}
      alignItems="center"
      justifyContent="center"
    >
      <Stack
        direction={{ xs: "column", lg: "row" }}
        spacing={2}
        sx={{ maxWidth: 1024, mx: "auto", width: "100%" }}
      >
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            borderRadius: 2,
            border: 1,
            borderColor: "divider",
            p: 2,
            bgcolor: "background.paper",
            boxShadow: "0 4px 14px rgba(15,23,42,0.06)",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
            "&:hover": {
              boxShadow: 3,
              transform: "translateY(-2px)",
            },
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                display: "flex",
                height: 40,
                width: 40,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.12),
                p: 1.25,
                boxShadow: 1,
              }}
            >
              <Users className="h-5 w-5 text-blue-500" />
            </Box>
            <Box>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  color: "text.secondary",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Users
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.25 }}>
                {totals.total_users.toLocaleString()}
              </Typography>
            </Box>
          </Stack>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            flex: 1,
            borderRadius: 2,
            border: 1,
            borderColor: "divider",
            p: 2,
            bgcolor: "background.paper",
            boxShadow: "0 4px 14px rgba(15,23,42,0.06)",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
            "&:hover": {
              boxShadow: 3,
              transform: "translateY(-2px)",
            },
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                display: "flex",
                height: 40,
                width: 40,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 2,
                bgcolor: alpha(theme.palette.success.main, 0.12),
                p: 1.25,
                boxShadow: 1,
              }}
            >
              <FileText className="h-5 w-5 text-emerald-500" />
            </Box>
            <Box>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  color: "text.secondary",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                Notes
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.25 }}>
                {totals.total_notes.toLocaleString()}
              </Typography>
            </Box>
          </Stack>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            flex: 1,
            borderRadius: 2,
            border: 1,
            borderColor: "divider",
            p: 2,
            bgcolor: "background.paper",
            boxShadow: "0 4px 14px rgba(15,23,42,0.06)",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
            "&:hover": {
              boxShadow: 3,
              transform: "translateY(-2px)",
            },
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                display: "flex",
                height: 40,
                width: 40,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 2,
                bgcolor: alpha(theme.palette.secondary.main, 0.12),
                p: 1.25,
                boxShadow: 1,
              }}
            >
              <UserCheck className="h-5 w-5 text-purple-500" />
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  color: "text.secondary",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  display: "block",
                  mb: 0.5,
                }}
              >
                Active User
              </Typography>
              {mostActiveUser ? (
                <>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "text.primary" }}
                    noWrap
                  >
                    {mostActiveUser.email || mostActiveUser.id}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {mostActiveUser.total_notes.toLocaleString()} notes
                  </Typography>
                </>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No data
                </Typography>
              )}
            </Box>
          </Stack>
        </Paper>
      </Stack>

      <Stack spacing={1} sx={{ maxWidth: 980, mx: "auto", width: "100%" }}>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 600, color: "text.primary" }}
        >
          User&apos;s Detail
        </Typography>
        <UsersTable
          users={users.map((u) => ({
            id: u.id,
            email: u.email,
            role: u.role === "admin" ? "admin" : "user",
            total_categories: u.total_categories,
            total_notes: u.total_notes,
            created_at: u.created_at,
          }))}
        />
      </Stack>
    </Stack>
  );
}
