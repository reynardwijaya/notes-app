"use client";

import { useMemo } from "react";
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
import type { AdminUserListRow } from "@/app/(dashboard)/actions/admin/types";

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

  const columns = useMemo<ColumnDef<AdminUserListRow>[]>(
    () => [
      {
        accessorKey: "email",
        header: "Email",
        cell: (info) => (
          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
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
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {Number(info.getValue() ?? 0)}
          </Typography>
        ),
      },
      {
        accessorKey: "total_notes",
        header: "Total Notes",
        cell: (info) => (
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
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
        cell: ({ row }) => (
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton
              aria-label="View user"
              size="small"
              onClick={() => router.push(`/admin/${row.original.id}`)}
              sx={{ color: "text.secondary" }}
            >
              <VisibilityOutlinedIcon fontSize="small" />
            </IconButton>
          </Box>
        ),
      },
    ],
    [router]
  );

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
        boxShadow: "0 8px 24px rgba(15,23,42,0.05)",
      }}
    >
      <TableContainer>
        <Table size="small">
          <TableHead>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header, idx) => (
                  <TableCell
                    key={header.id}
                    sx={{
                      fontWeight: 800,
                      py: 1.1,
                      px: 1.5,
                      ...(idx === hg.headers.length - 1 ? { textAlign: "right", pr: 2 } : {}),
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <Typography variant="body2" sx={{ color: "text.secondary", py: 1 }}>
                    No users found.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} hover>
                  {row.getVisibleCells().map((cell, idx) => (
                    <TableCell
                      key={cell.id}
                      sx={{
                        py: 1,
                        px: 1.5,
                        ...(idx === row.getVisibleCells().length - 1
                          ? { textAlign: "right", pr: 2 }
                          : {}),
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

