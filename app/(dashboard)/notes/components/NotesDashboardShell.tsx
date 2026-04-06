"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import type {
  NoteCategory,
  NoteWithCategory,
} from "@/app/(dashboard)/notes/utils/types";
import NotesDataTable from "@/app/(dashboard)/notes/components/NotesDataTable";
import CategoryFolderPanel from "@/app/(dashboard)/categories/components/CategoryFolderPanel";

type CategoryWithMeta = NoteCategory & {
  created_at?: string;
  total_notes?: number;
};

type CategoryFolderInitial = {
  rows: CategoryWithMeta[];
  total: number;
  pageSize: number;
};

type Props = {
  initialData: NoteWithCategory[];
  initialTotal: number;
  categories: CategoryWithMeta[];
  categoryFolderInitial: CategoryFolderInitial;
  readOnly?: boolean;
  hideCreateButtons?: boolean;
  notesScopeUserId?: string;
};

export default function NotesDashboardShell({
  initialData,
  initialTotal,
  categories,
  categoryFolderInitial,
  readOnly = false,
  hideCreateButtons = false,
  notesScopeUserId,
}: Props) {
  const router = useRouter();
  const [categoriesState, setCategoriesState] =
    useState<CategoryWithMeta[]>(categories);
  const [folderInvalidate, setFolderInvalidate] = useState(0);

  const bumpFolderInvalidate = useCallback(() => {
    setFolderInvalidate((n) => n + 1);
  }, []);

  const handleCategoriesUpdated = useCallback(
    (next: NoteCategory[]) => {
      setCategoriesState(
        next.map((c) => ({
          id: c.id,
          name: c.name,
        })),
      );
      bumpFolderInvalidate();
      router.refresh();
    },
    [bumpFolderInvalidate, router],
  );
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [openCreateNoteSignal, setOpenCreateNoteSignal] = useState<
    number | undefined
  >(undefined);
  const [openCategoryModalSignal, setOpenCategoryModalSignal] = useState<
    number | undefined
  >(undefined);
  const [deletedCategoryId, setDeletedCategoryId] = useState<string | null>(
    null,
  );

  const categoryRows = useMemo(
    () =>
      categoriesState.map((c) => ({
        id: c.id,
        name: c.name,
        created_at: c.created_at,
        total_notes: Number(c.total_notes ?? 0),
      })),
    [categoriesState],
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: { xs: "wrap", lg: "nowrap" },
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: { xs: "wrap", lg: "nowrap" },
            alignItems: "center",
            gap: 1.25,
          }}
        >
          <TextField
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes..."
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    sx={{ color: "text.disabled" }}
                    fontSize="small"
                  />
                </InputAdornment>
              ),
            }}
            sx={{
              minWidth: 280,
              maxWidth: 420,
              "& .MuiOutlinedInput-root": { borderRadius: 2.5 },
              "& .MuiInputBase-root": { height: 40 },
            }}
          />

          <TextField
            label="From"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
            sx={{
              minWidth: 170,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2.5,
              },
              "& .MuiInputBase-input": {
                py: 1.1,
              },
            }}
          />

          <TextField
            label="To"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
            sx={{
              minWidth: 170,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2.5,
              },
              "& .MuiInputBase-input": {
                py: 1.1,
              },
            }}
          />
          <IconButton
            aria-label="Reset date filters"
            onClick={() => {
              setFromDate("");
              setToDate("");
            }}
            size="small"
            sx={{
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              width: 40,
              height: 40,
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {!hideCreateButtons && !readOnly && (
          <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
            <Button
              variant="outlined"
              startIcon={<CategoryOutlinedIcon fontSize="small" />}
              onClick={() => setOpenCategoryModalSignal((v) => (v ?? 0) + 1)}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                px: 1.5,
                minWidth: "auto",
                height: 40,
              }}
            >
              Create Category
            </Button>
            <Button
              variant="contained"
              disableElevation
              onClick={() => setOpenCreateNoteSignal((v) => (v ?? 0) + 1)}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                px: 2,
                height: 40,
                boxShadow: "0 8px 18px rgba(0,0,0,0.08)",
              }}
            >
              Add Note
            </Button>
          </Box>
        )}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "repeat(12, minmax(0, 1fr))" },
          gap: 2.5,
          alignItems: "start",
        }}
      >
        <Box sx={{ gridColumn: { xs: "1 / -1", lg: "span 6" } }}>
          <NotesDataTable
            initialData={initialData}
            initialTotal={initialTotal}
            categories={categoryRows.map((c) => ({ id: c.id, name: c.name }))}
            initialPageSize={10}
            hideToolbar
            search={search}
            fromDate={fromDate}
            toDate={toDate}
            openCreateNoteSignal={openCreateNoteSignal}
            openCategoryModalSignal={openCategoryModalSignal}
            recentlyDeletedCategoryId={deletedCategoryId}
            onCategoriesUpdated={handleCategoriesUpdated}
            readOnly={readOnly}
            notesScopeUserId={notesScopeUserId}
          />
        </Box>

        <Box sx={{ gridColumn: { xs: "1 / -1", lg: "span 6" } }}>
          <CategoryFolderPanel
            categoryOptionsForNotes={categoryRows.map((c) => ({
              id: c.id,
              name: c.name,
            }))}
            folderInitial={categoryFolderInitial}
            folderInvalidate={folderInvalidate}
            scopedFolderCategories={notesScopeUserId ? categoryRows : undefined}
            notesInitialData={[]}
            notesInitialTotal={0}
            onCategoriesUpdated={handleCategoriesUpdated}
            onCategoryDeleted={(categoryId) => {
              setDeletedCategoryId(categoryId);
            }}
            onRequestCreateCategory={
              hideCreateButtons || readOnly
                ? undefined
                : () => setOpenCategoryModalSignal((v) => (v ?? 0) + 1)
            }
            readOnly={readOnly}
            notesScopeUserId={notesScopeUserId}
          />
        </Box>
      </Box>
    </Box>
  );
}
