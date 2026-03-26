"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloseIcon from "@mui/icons-material/Close";

import { getNotes, type NoteWithCategory } from "@/app/actions/getNotes";
import { deleteNote } from "@/app/actions/deleteNote";
import CreateNoteForm, {
  type NoteCategory,
} from "@/app/components/notes/CreateNoteForm";

type Props = {
  initialData: NoteWithCategory[];
  initialTotal: number;
  categories: NoteCategory[];
  initialPageSize?: number;
};

function formatCreatedAt(value: string) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export default function NotesDataTable({
  initialData,
  initialTotal,
  categories,
  initialPageSize = 10,
}: Props) {
  const [data, setData] = useState<NoteWithCategory[]>(initialData);
  const [total, setTotal] = useState(initialTotal);

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const showToast = useCallback((message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  }, []);

  const refetch = useCallback(
    async (next: { pageIndex: number; pageSize: number; search: string }) => {
      setLoading(true);
      try {
        const res = await getNotes({
          page: next.pageIndex,
          pageSize: next.pageSize,
          search: next.search,
        });
        setData(res.data);
        setTotal(res.total);

        if (next.pageIndex > 0 && res.data.length === 0 && res.total > 0) {
          setPageIndex(next.pageIndex - 1);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch notes";
        showToast(message, "error");
      } finally {
        setLoading(false);
      }
    },
    [showToast]
  );

  useEffect(() => {
    const t = setTimeout(() => {
      void refetch({ pageIndex, pageSize, search });
    }, 250);
    return () => clearTimeout(t);
  }, [pageIndex, pageSize, search, refetch]);

  const columns = useMemo<ColumnDef<NoteWithCategory>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        cell: (info) => (
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {String(info.getValue() ?? "")}
          </Typography>
        ),
      },
      {
        accessorKey: "category_name",
        header: "Category",
        cell: (info) => (
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {String(info.getValue() ?? "")}
          </Typography>
        ),
      },
      {
        accessorKey: "created_at",
        header: "Created At",
        cell: (info) => (
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {formatCreatedAt(String(info.getValue() ?? ""))}
          </Typography>
        ),
      },
      {
        id: "actions",
        header: () => <Box sx={{ textAlign: "right", pr: 1 }}>Actions</Box>,
        cell: ({ row }) => (
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton
              aria-label="Delete note"
              onClick={async () => {
                const res = await deleteNote({ id: row.original.id });
                if ("error" in res) {
                  showToast(res.error, "error");
                  return;
                }
                showToast("Note deleted", "success");
                await refetch({ pageIndex, pageSize, search });
              }}
              size="small"
              sx={{ color: "error.main" }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Box>
        ),
      },
    ],
    [pageIndex, pageSize, search, refetch, showToast]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(total / pageSize),
  });

  return (
    <Box className="space-y-6">
      <Box className="flex items-center justify-between gap-4">
        <TextField
          fullWidth
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPageIndex(0);
          }}
          placeholder="Search notes…"
          size="small"
          sx={{
            maxWidth: 520,
            "& .MuiOutlinedInput-root": { borderRadius: 2.5 },
          }}
        />

        <Button
          variant="contained"
          disableElevation
          onClick={() => setModalOpen(true)}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            px: 2.5,
            py: 1,
            boxShadow: "0 10px 22px rgba(0,0,0,0.10)",
            flexShrink: 0,
          }}
        >
          Add Note
        </Button>
      </Box>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
        }}
      >
        <TableContainer>
          <Table size="medium">
            <TableHead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableCell key={header.id} sx={{ fontWeight: 700 }}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length}>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      Loading…
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length}>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      No notes found.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} hover>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={total}
          page={pageIndex}
          onPageChange={(_, nextPage) => setPageIndex(nextPage)}
          rowsPerPage={pageSize}
          onRowsPerPageChange={(e) => {
            const next = Number(e.target.value);
            setPageSize(next);
            setPageIndex(0);
          }}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>

      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: "0 30px 80px rgba(0,0,0,0.22)",
          },
        }}
      >
        <DialogTitle sx={{ pr: 6, pb: 1, fontWeight: 700 }}>
          Create Note
          <IconButton
            aria-label="Close"
            onClick={() => setModalOpen(false)}
            sx={{ position: "absolute", right: 12, top: 12 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 2.5 }}>
          {categories.length === 0 ? (
            <Alert severity="warning" sx={{ borderRadius: 2 }}>
              No categories found. Please create a category first.
            </Alert>
          ) : (
            <CreateNoteForm
              categories={categories}
              onCancel={() => setModalOpen(false)}
              onCreated={async (created) => {
                setModalOpen(false);
                showToast("Note created successfully", "success");

                if (pageIndex === 0 && search.trim() === "") {
                  setData((prev) => [created, ...prev].slice(0, pageSize));
                  setTotal((t) => t + 1);
                  return;
                }

                await refetch({ pageIndex, pageSize, search });
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        autoHideDuration={3500}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ borderRadius: 2 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

