"use client";

import { useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useRouter } from "next/navigation";
import type { AdminUserListRow } from "@/app/(dashboard)/admin/utils/types";
import NoDataAvailableDialog from "@/app/(dashboard)/admin/components/NoDataAvailableDialog";

function formatDate(value: string) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function UsersTable({ users }: { users: AdminUserListRow[] }) {
  const router = useRouter();
  const [noDataOpen, setNoDataOpen] = useState(false);

  const columns = useMemo<ColumnDef<AdminUserListRow>[]>(
    () => [
      {
        accessorKey: "email",
        header: "Email",
        cell: (info) => (
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: "text.primary" }}
          >
            {String(info.getValue() ?? "")}
          </Typography>
        ),
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: (info) => (
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {String(info.getValue() ?? "")}
          </Typography>
        ),
      },
      {
        accessorKey: "total_categories",
        header: "Total Categories",
        cell: (info) => (
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, color: "text.primary" }}
          >
            {Number(info.getValue() ?? 0)}
          </Typography>
        ),
      },
      {
        accessorKey: "total_notes",
        header: "Total Notes",
        cell: (info) => (
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, color: "text.primary" }}
          >
            {Number(info.getValue() ?? 0)}
          </Typography>
        ),
      },
      {
        accessorKey: "created_at",
        header: "Created At",
        cell: (info) => (
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {formatDate(String(info.getValue() ?? ""))}
          </Typography>
        ),
      },
      {
        id: "action",
        header: () => <Box sx={{ textAlign: "right", pr: 1 }}>Action</Box>,
        cell: ({ row }) => {
          const totalNotes = Number(row.original.total_notes ?? 0);
          const totalCategories = Number(row.original.total_categories ?? 0);
          const hasData = totalNotes > 0 || totalCategories > 0;

          return (
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <IconButton
                aria-label="View user"
                size="small"
                onClick={() => {
                  if (!hasData) {
                    setNoDataOpen(true);
                    return;
                  }
                  router.push(`/admin/${row.original.id}`);
                }}
                sx={{ color: "text.secondary" }}
              >
                <VisibilityOutlinedIcon fontSize="small" />
              </IconButton>
            </Box>
          );
        },
      },
    ],
    [router],
  );

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 980,
          mx: "auto",
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
          backgroundColor: "background.paper",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)",
          backdropFilter: "blur(12px)",
        }}
      >
        <TableContainer sx={{ background: "transparent" }}>
          <Table size="small">
            <TableHead>
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((header, idx) => (
                    <TableCell
                      key={header.id}
                      sx={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "text.secondary",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        py: 1.5,
                        px: 2,
                        borderBottom: "1px solid",
                        borderBottomColor: "divider",
                        borderTop: "none",
                        ...(idx === 0
                          ? { width: "28%" }
                          : idx === hg.headers.length - 1
                            ? { width: "18%", textAlign: "right", pr: 2.5 }
                            : { width: "18%" }),
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>

            <TableBody>
              {table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    sx={{
                      py: 6,
                      borderBottom: "none",
                      textAlign: "center",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                        }}
                      >
                        <Typography
                          variant="h4"
                          color="text.secondary"
                          sx={{ fontWeight: 200 }}
                        >
                          👥
                        </Typography>
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "text.secondary",
                          fontWeight: 500,
                          mb: 0.5,
                        }}
                      >
                        No users found
                      </Typography>
                      <Typography variant="body2" color="text.disabled">
                        There are no users to display at the moment
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row, rowIndex) => (
                  <TableRow
                    key={row.id}
                    sx={{
                      transition:
                        "all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                      "&:hover": {
                        backgroundColor: "action.hover",
                        transform: "translateY(-0.5px)",
                      },
                      borderBottom:
                        rowIndex < table.getRowModel().rows.length - 1
                          ? "1px solid rgba(0,0,0,0.04)"
                          : "none",
                    }}
                  >
                    {row.getVisibleCells().map((cell, idx) => (
                      <TableCell
                        key={cell.id}
                        sx={{
                          py: 1.75,
                          px: 2,
                          borderBottom: "none",
                          fontSize: idx === 0 ? "0.95rem" : "0.875rem",
                          fontWeight: idx === 0 ? 500 : 400,
                          ...(idx === 0
                            ? { width: "28%" }
                            : idx === row.getVisibleCells().length - 1
                              ? { width: "18%", textAlign: "right", pr: 2.5 }
                              : { width: "18%" }),
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <NoDataAvailableDialog open={noDataOpen} />
    </>
  );
}
