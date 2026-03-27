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
  InputAdornment,
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
import SearchIcon from "@mui/icons-material/Search";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CloseIcon from "@mui/icons-material/Close";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";

import { getNotes } from "@/app/(dashboard)/actions/notes/getNotes";
import { deleteNote } from "@/app/(dashboard)/actions/notes/deleteNote";
import { updateNote } from "@/app/(dashboard)/actions/notes/updateNote";
import type { NoteWithCategory, NoteCategory } from "@/app/(dashboard)/actions/notes/types";
import CreateNoteForm from "@/app/components/notes/CreateNoteForm";
import CreateCategoryModal from "@/app/components/notes/CreateCategoryModal";
import ConfirmationModal from "@/app/components/notes/ConfirmationModal";
import NoteDetailModal from "@/app/components/notes/NoteDetailModal";
import { buildCategoryColorIndex, getPastelByIndex } from "@/utils/categoryColors";

type Props = {
  initialData: NoteWithCategory[];
  initialTotal: number;
  categories: NoteCategory[];
  initialPageSize?: number;
  lockedCategoryId?: string;
  hideTopActions?: boolean;
  hideToolbar?: boolean;
  search?: string;
  fromDate?: string;
  toDate?: string;
  openCreateNoteSignal?: number;
  openCategoryModalSignal?: number;
  recentlyDeletedCategoryId?: string | null;
  onCategoriesUpdated?: (categories: NoteCategory[]) => void;
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
  lockedCategoryId,
  hideTopActions = false,
  hideToolbar = false,
  search: searchProp,
  fromDate: fromDateProp,
  toDate: toDateProp,
  openCreateNoteSignal,
  openCategoryModalSignal,
  recentlyDeletedCategoryId,
  onCategoriesUpdated,
}: Props) {
  const [data, setData] = useState<NoteWithCategory[]>(initialData);
  const [total, setTotal] = useState(initialTotal);
  const [categoriesState, setCategoriesState] = useState<NoteCategory[]>(categories);

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [search, setSearch] = useState(searchProp ?? "");
  const [fromDate, setFromDate] = useState<string>(fromDateProp ?? "");
  const [toDate, setToDate] = useState<string>(toDateProp ?? "");

  const [loading, setLoading] = useState(false);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [noteToView, setNoteToView] = useState<NoteWithCategory | null>(null);
  const [noteToEdit, setNoteToEdit] = useState<NoteWithCategory | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<NoteWithCategory | null>(null);
  const [deletingNote, setDeletingNote] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const categoryColorIndex = useMemo(
    () => buildCategoryColorIndex(categoriesState),
    [categoriesState]
  );

  useEffect(() => {
    setCategoriesState(categories);
  }, [categories]);

  useEffect(() => {
    if (typeof searchProp === "string") {
      setSearch(searchProp);
      setPageIndex(0);
    }
  }, [searchProp]);

  useEffect(() => {
    if (typeof fromDateProp === "string") {
      setFromDate(fromDateProp);
      setPageIndex(0);
    }
  }, [fromDateProp]);

  useEffect(() => {
    if (typeof toDateProp === "string") {
      setToDate(toDateProp);
      setPageIndex(0);
    }
  }, [toDateProp]);

  useEffect(() => {
    if (typeof openCreateNoteSignal === "number") {
      setNoteModalOpen(true);
    }
  }, [openCreateNoteSignal]);

  useEffect(() => {
    if (typeof openCategoryModalSignal === "number") {
      setCategoryModalOpen(true);
    }
  }, [openCategoryModalSignal]);

  useEffect(() => {
    if (!recentlyDeletedCategoryId) return;
    setData((prev) =>
      prev.map((note) =>
        note.category_id === recentlyDeletedCategoryId
          ? { ...note, category_id: "", category_name: "Uncategorized" }
          : note
      )
    );
  }, [recentlyDeletedCategoryId]);

  const showToast = useCallback((message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  }, []);

  const refetch = useCallback(
    async (next: {
      pageIndex: number;
      pageSize: number;
      search: string;
      fromDate: string;
      toDate: string;
    }) => {
      setLoading(true);
      try {
        const res = await getNotes({
          page: next.pageIndex,
          pageSize: next.pageSize,
          search: next.search,
          fromDate: next.fromDate,
          toDate: next.toDate,
          categoryId: lockedCategoryId ?? null,
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
    [lockedCategoryId, showToast]
  );

  useEffect(() => {
    const t = setTimeout(() => {
      void refetch({ pageIndex, pageSize, search, fromDate, toDate });
    }, 250);
    return () => clearTimeout(t);
  }, [pageIndex, pageSize, search, fromDate, toDate, refetch]);

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
        cell: ({ row }) => {
          const categoryId = row.original.category_id;
          const label = row.original.category_name || "Uncategorized";
          const idx = categoryId ? categoryColorIndex.get(categoryId) : undefined;
          const color = typeof idx === "number" ? getPastelByIndex(idx) : null;

          return (
            <Chip
              label={label}
              size="small"
              sx={{
                borderRadius: 999,
                height: 26,
                bgcolor: color?.bg ?? "grey.100",
                color: color?.text ?? "text.secondary",
                border: "1px solid",
                borderColor: color?.border ?? "divider",
                "& .MuiChip-label": { px: 1.25, fontSize: 12, fontWeight: 700 },
              }}
            />
          );
        },
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
              onClick={(e) => {
                e.stopPropagation();
                setNoteToEdit(row.original);
                setEditModalOpen(true);
              }}
              size="small"
              sx={{ color: "text.secondary" }}
            >
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
            <IconButton
              aria-label="Delete note"
              onClick={(e) => {
                e.stopPropagation();
                setNoteToDelete(row.original);
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
    [categoryColorIndex]
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
      {!hideToolbar && (
        <Box className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Box className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <TextField
            fullWidth
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPageIndex(0);
            }}
            placeholder="Search notes..."
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "text.disabled" }} fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{
              maxWidth: 420,
              "& .MuiOutlinedInput-root": { borderRadius: 2.5 },
            }}
          />

          <TextField
            label="From"
            type="date"
            value={fromDate}
            onChange={(e) => {
              setFromDate(e.target.value);
              setPageIndex(0);
            }}
            size="small"
            InputLabelProps={{ shrink: true }}
            sx={{
              minWidth: 170,
              "& .MuiOutlinedInput-root": { borderRadius: 2.5 },
            }}
          />
          <TextField
            label="To"
            type="date"
            value={toDate}
            onChange={(e) => {
              setToDate(e.target.value);
              setPageIndex(0);
            }}
            size="small"
            InputLabelProps={{ shrink: true }}
            sx={{
              minWidth: 170,
              "& .MuiOutlinedInput-root": { borderRadius: 2.5 },
            }}
          />
        </Box>

        {!hideTopActions && (
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
        )}
        </Box>
      )}

      <Paper
        elevation={0}
        sx={{
          width: "100%",
          height: "100%",
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
                        py: 1.1,
                        px: 1.5,
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
                  <TableRow
                    key={row.id}
                    hover
                    onClick={() => {
                      setNoteToView(row.original);
                    }}
                    sx={{ cursor: "pointer" }}
                  >
                    {row.getVisibleCells().map((cell, index) => (
                      <TableCell
                        key={cell.id}
                        sx={{
                          py: 1,
                          px: 1.5,
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
            onSaved={async (created) => {
              setNoteModalOpen(false);
              showToast("Note created successfully", "success");

              if (pageIndex === 0 && search.trim() === "") {
                setData((prev) => [created, ...prev].slice(0, pageSize));
                setTotal((t) => t + 1);
                return;
              }

              await refetch({ pageIndex, pageSize, search, fromDate, toDate });
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
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
          Edit Note
          <IconButton
            aria-label="Close"
            onClick={() => setEditModalOpen(false)}
            sx={{ position: "absolute", right: 12, top: 12 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 2.5 }}>
          <CreateNoteForm
            categories={categoriesState}
            onOpenCategoryModal={() => setCategoryModalOpen(true)}
            onCancel={() => setEditModalOpen(false)}
            submitLabel="Save changes"
            disableSubmitIfUnchanged
            submitAction={async (input) => {
              if (!noteToEdit) return { error: "Missing note" };
              return updateNote({ id: noteToEdit.id, ...input });
            }}
            initialValues={{
              title: noteToEdit?.title ?? "",
              content: noteToEdit?.content ?? "",
              categoryId: noteToEdit?.category_id ?? "",
            }}
            onSaved={async (updated) => {
              setEditModalOpen(false);
              showToast("Note updated successfully", "success");
              setData((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));

              // If edit happened outside current filtered list, re-sync.
              if (search.trim() !== "") {
                await refetch({ pageIndex, pageSize, search, fromDate, toDate });
              }
            }}
          />
        </DialogContent>
      </Dialog>

      <NoteDetailModal
        open={Boolean(noteToView)}
        note={noteToView}
        onClose={() => setNoteToView(null)}
      />

      <CreateCategoryModal
        open={categoryModalOpen}
        categories={categoriesState}
        onClose={() => setCategoryModalOpen(false)}
        onCategoriesUpdated={(next) => {
          const prevIds = new Set(categoriesState.map((c) => c.id));
          const nextIds = new Set(next.map((c) => c.id));
          const removedIds = [...prevIds].filter((id) => !nextIds.has(id));

          setCategoriesState(next);
          onCategoriesUpdated?.(next);
          if (removedIds.length > 0) {
            setData((prev) =>
              prev.map((note) =>
                removedIds.includes(note.category_id)
                  ? { ...note, category_id: "", category_name: "Uncategorized" }
                  : note
              )
            );
          }
        }}
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
            await refetch({ pageIndex, pageSize, search, fromDate, toDate });
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

