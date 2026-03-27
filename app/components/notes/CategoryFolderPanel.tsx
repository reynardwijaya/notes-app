"use client";

import { useMemo, useState } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CloseIcon from "@mui/icons-material/Close";
import type { NoteCategory } from "@/app/(dashboard)/actions/notes/types";
import NotesDataTable from "@/app/components/notes/NotesDataTable";
import { buildCategoryColorIndex, getPastelByIndex } from "@/utils/categoryColors";

type CategoryWithMeta = NoteCategory & { created_at?: string };

type Props = {
  categories: CategoryWithMeta[];
  notesInitialData: Parameters<typeof NotesDataTable>[0]["initialData"];
  notesInitialTotal: number;
};

function formatCreatedAt(value: string) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function CategoryFolderPanel({
  categories,
  notesInitialData,
  notesInitialTotal,
}: Props) {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const categoryColorIndex = useMemo(() => buildCategoryColorIndex(categories), [categories]);
  const activeCategory = categories.find((c) => c.id === activeCategoryId) ?? null;

  return (
    <>
      <Box
        sx={{
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 8px 24px rgba(15,23,42,0.05)",
          p: 2.25,
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1.75 }}>
          Categories
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gap: 1.5,
          }}
        >
          {categories.map((cat) => {
            const idx = categoryColorIndex.get(cat.id) ?? 0;
            const color = getPastelByIndex(idx);

            return (
              <Box
                key={cat.id}
                onClick={() => setActiveCategoryId(cat.id)}
                sx={{
                  gridColumn: { xs: "span 12", sm: "span 6", lg: "span 4" },
                  cursor: "pointer",
                  borderRadius: 3,
                  p: 2,
                  bgcolor: color.bg,
                  border: "1px solid",
                  borderColor: color.border,
                  boxShadow: "0 10px 24px rgba(15,23,42,0.06)",
                  transition: "transform 120ms ease, box-shadow 120ms ease",
                  "&:hover": {
                    transform: "translateY(-1px)",
                    boxShadow: "0 14px 30px rgba(15,23,42,0.10)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <FolderOutlinedIcon sx={{ color: color.text }} />
                  <IconButton
                    size="small"
                    onClick={(e) => e.stopPropagation()}
                    sx={{ color: "text.secondary" }}
                    aria-label="Category menu"
                  >
                    <MoreHorizIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Typography
                  variant="subtitle2"
                  sx={{ mt: 1.25, fontWeight: 900, color: color.text }}
                >
                  {cat.name}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  {formatCreatedAt(cat.created_at ?? "")}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      <Dialog
        open={Boolean(activeCategoryId)}
        onClose={() => setActiveCategoryId(null)}
        fullWidth
        maxWidth="lg"
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 18px 48px rgba(15,23,42,0.16)",
          },
        }}
      >
        <DialogTitle sx={{ pr: 6, pb: 1, fontWeight: 800 }}>
          {activeCategory?.name ?? "Category"}
          <IconButton
            aria-label="Close"
            onClick={() => setActiveCategoryId(null)}
            sx={{ position: "absolute", right: 12, top: 12 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 2.5 }}>
          {activeCategoryId && (
            <NotesDataTable
              initialData={notesInitialData}
              initialTotal={notesInitialTotal}
              categories={categories.map((c) => ({ id: c.id, name: c.name }))}
              initialPageSize={10}
              lockedCategoryId={activeCategoryId}
              hideTopActions
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

