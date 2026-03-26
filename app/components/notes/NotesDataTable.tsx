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
  Chip,
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
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CloseIcon from "@mui/icons-material/Close";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";

import { getNotes, type NoteWithCategory } from "@/app/actions/getNotes";
import { deleteNote } from "@/app/actions/deleteNote";
import CreateNoteForm, {
  type NoteCategory,
} from "@/app/components/notes/CreateNoteForm";
import CreateCategoryModal from "@/app/components/notes/CreateCategoryModal";
import ConfirmationModal from "@/app/components/notes/ConfirmationModal";

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
  const [categoriesState, setCategoriesState] = useState<NoteCategory[]>(categories);

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<NoteWithCategory | null>(null);
  const [deletingNote, setDeletingNote] = useState(false);

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
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              maxWidth: 280,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {String(info.getValue() ?? "")}
          </Typography>
        ),
      },
      {
        accessorKey: "category_name",
        header: "Category",
        cell: (info) => (
          <Chip
            label={String(info.getValue() ?? "Uncategorized")}
            size="small"
            sx={{
              borderRadius: 1.5,
              bgcolor: "grey.100",
              "& .MuiChip-label": { px: 1, fontSize: 12 },
            }}
          />
        ),
      },
      {
        accessorKey: "created_at",
        header: "Created At",
        cell: (info) => (
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {formatCreatedAt(String(info.getValue() ?? ""))}
          </Typography>
        ),
      },
      {
        id: "actions",
        header: () => <Box sx={{ textAlign: "right", pr: 1 }}>Actions</Box>,
        cell: ({ row }) => (
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}>
            <IconButton
              aria-label="Edit note"
              size="small"
              sx={{ color: "text.secondary" }}
            >
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
            <IconButton
              aria-label="Delete note"
              onClick={() => setNoteToDelete(row.original)}
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
            maxWidth: 460,
            "& .MuiOutlinedInput-root": { borderRadius: 2.5 },
          }}
        />

        <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
          <Button
            variant="outlined"
            startIcon={<CategoryOutlinedIcon fontSize="small" />}
            onClick={() => setCategoryModalOpen(true)}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 1.5,
              minWidth: "auto",
            }}
          >
            Create Category
          </Button>
          <Button
            variant="contained"
            disableElevation
            onClick={() => setNoteModalOpen(true)}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 2,
              boxShadow: "0 8px 18px rgba(0,0,0,0.08)",
            }}
          >
            Add Note
          </Button>
        </Box>
      </Box>

      <Paper
        elevation={0}
        sx={{
          maxWidth: 980,
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
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header, index) => (
                    <TableCell
                      key={header.id}
                      sx={{
                        fontWeight: 700,
                        py: 1.25,
                        ...(index === headerGroup.headers.length - 1
                          ? { textAlign: "right", pr: 2 }
                          : {}),
                      }}
                    >
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
                    <Typography variant="body2" sx={{ color: "text.secondary", py: 1 }}>
                      Loading…
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length}>
                    <Typography variant="body2" sx={{ color: "text.secondary", py: 1 }}>
                      No notes found.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} hover>
                    {row.getVisibleCells().map((cell, index) => (
                      <TableCell
                        key={cell.id}
                        sx={{
                          py: 1,
                          ...(index === row.getVisibleCells().length - 1
                            ? { textAlign: "right", pr: 2 }
                            : {}),
                        }}
                      >
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
        open={noteModalOpen}
        onClose={() => setNoteModalOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 18px 48px rgba(15,23,42,0.16)",
          },
        }}
      >
        <DialogTitle sx={{ pr: 6, pb: 1, fontWeight: 700 }}>
          Create Note
          <IconButton
            aria-label="Close"
            onClick={() => setNoteModalOpen(false)}
            sx={{ position: "absolute", right: 12, top: 12 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 2.5 }}>
          <CreateNoteForm
            categories={categoriesState}
            onOpenCategoryModal={() => setCategoryModalOpen(true)}
            onCancel={() => setNoteModalOpen(false)}
            onCreated={async (created) => {
              setNoteModalOpen(false);
              showToast("Note created successfully", "success");

              if (pageIndex === 0 && search.trim() === "") {
                setData((prev) => [created, ...prev].slice(0, pageSize));
                setTotal((t) => t + 1);
                return;
              }

              await refetch({ pageIndex, pageSize, search });
            }}
          />
        </DialogContent>
      </Dialog>

      <CreateCategoryModal
        open={categoryModalOpen}
        categories={categoriesState}
        onClose={() => setCategoryModalOpen(false)}
        onCategoriesUpdated={(next) => setCategoriesState(next)}
        onSuccessMessage={(m) => showToast(m, "success")}
        onErrorMessage={(m) => showToast(m, "error")}
      />

      <ConfirmationModal
        open={Boolean(noteToDelete)}
        onClose={() => setNoteToDelete(null)}
        title="Delete Note?"
        subtitle="This action cannot be undone"
        confirmText="Delete"
        confirmColor="error"
        loading={deletingNote}
        onConfirm={async () => {
          if (!noteToDelete) return;
          setDeletingNote(true);
          try {
            const res = await deleteNote({ id: noteToDelete.id });
            if ("error" in res) {
              showToast(res.error, "error");
              return;
            }
            showToast("Note deleted", "success");
            setNoteToDelete(null);
            await refetch({ pageIndex, pageSize, search });
          } finally {
            setDeletingNote(false);
          }
        }}
      />

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

