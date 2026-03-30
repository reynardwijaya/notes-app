"use client";

import { useMemo, useState } from "react";
import { Box, Button, IconButton, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import type { NoteCategory, NoteWithCategory } from "@/app/(dashboard)/actions/notes/types";
import NotesDataTable from "@/app/components/notes/NotesDataTable";
import CategoryFolderPanel from "@/app/components/notes/CategoryFolderPanel";

type CategoryWithMeta = NoteCategory & { created_at?: string };

type Props = {
  initialData: NoteWithCategory[];
  initialTotal: number;
  categories: CategoryWithMeta[];
  readOnly?: boolean;
  hideCreateButtons?: boolean;
  notesScopeUserId?: string;
};

export default function NotesDashboardShell({
  initialData,
  initialTotal,
  categories,
  readOnly = false,
  hideCreateButtons = false,
  notesScopeUserId,
}: Props) {
  const [categoriesState, setCategoriesState] = useState<CategoryWithMeta[]>(categories);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [openCreateNoteSignal, setOpenCreateNoteSignal] = useState<number | undefined>(
    undefined
  );
  const [openCategoryModalSignal, setOpenCategoryModalSignal] = useState<
    number | undefined
  >(undefined);
  const [deletedCategoryId, setDeletedCategoryId] = useState<string | null>(null);

  const categoryRows = useMemo(
    () =>
      categoriesState.map((c) => ({ id: c.id, name: c.name, created_at: c.created_at })),
    [categoriesState]
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
                  <SearchIcon sx={{ color: "text.disabled" }} fontSize="small" />
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
              "& .MuiOutlinedInput-root": { borderRadius: 2.5 },
              "& .MuiInputBase-root": { height: 40 },
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
              "& .MuiOutlinedInput-root": { borderRadius: 2.5 },
              "& .MuiInputBase-root": { height: 40 },
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
            <RestartAltIcon fontSize="small" />
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
            onCategoriesUpdated={(next) => setCategoriesState(next)}
            readOnly={readOnly}
            notesScopeUserId={notesScopeUserId}
          />
        </Box>

        <Box sx={{ gridColumn: { xs: "1 / -1", lg: "span 6" } }}>
          <CategoryFolderPanel
            categories={categoryRows}
            notesInitialData={[]}
            notesInitialTotal={0}
            onCategoriesUpdated={(next) => setCategoriesState(next)}
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

