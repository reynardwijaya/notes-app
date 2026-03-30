"use client";

import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";

import type { NoteCategory } from "@/app/(dashboard)/actions/notes/types";
import NotesDataTable from "@/app/components/notes/NotesDataTable";
import {
  buildCategoryColorIndex,
  getPastelByIndex,
} from "@/utils/categoryColors";
import ConfirmationModal from "@/app/components/notes/ConfirmationModal";
import { deleteCategory } from "@/app/(dashboard)/actions/categories/deleteCategory";

type CategoryWithMeta = NoteCategory & { created_at?: string };

type Props = {
  categories: CategoryWithMeta[];
  notesInitialData: Parameters<typeof NotesDataTable>[0]["initialData"];
  notesInitialTotal: number;
  onCategoriesUpdated?: (categories: CategoryWithMeta[]) => void;
  onCategoryDeleted?: (categoryId: string) => void;
  onRequestCreateCategory?: () => void;
  readOnly?: boolean;
  notesScopeUserId?: string;
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
  onCategoriesUpdated,
  onCategoryDeleted,
  onRequestCreateCategory,
  readOnly = false,
  notesScopeUserId,
}: Props) {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [menuCategoryId, setMenuCategoryId] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const categoryColorIndex = useMemo(
    () => buildCategoryColorIndex(categories),
    [categories],
  );

  const activeCategory =
    categories.find((c) => c.id === activeCategoryId) ?? null;

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
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            mb: 1.75,
            color: "text.primary",
          }}
        >
          Categories
        </Typography>

        {/* ================= EMPTY STATE ================= */}
        {categories.length === 0 ? (
          <Box
            sx={{
              height: 220,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              color: "text.secondary",
              gap: 1,
            }}
          >
            <InboxOutlinedIcon sx={{ fontSize: 40, opacity: 0.6 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              No categories yet
            </Typography>
            <Typography variant="caption">
              Create your first category to organize your notes
            </Typography>
            {onRequestCreateCategory && (
              <Button
                variant="outlined"
                onClick={onRequestCreateCategory}
                sx={{
                  mt: 1,
                  textTransform: "none",
                  borderRadius: 2,
                  height: 36,
                  px: 1.75,
                }}
              >
                Create Category
              </Button>
            )}
          </Box>
        ) : (
          /* ================= GRID ================= */
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
                    transition: "all 120ms ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 16px 32px rgba(15,23,42,0.10)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <FolderOutlinedIcon sx={{ color: color.text }} />

                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (readOnly) return;
                        setMenuAnchorEl(e.currentTarget);
                        setMenuCategoryId(cat.id);
                      }}
                      sx={{
                        color: "text.secondary",
                        "&:hover": {
                          bgcolor: "rgba(0,0,0,0.05)",
                        },
                      }}
                      disabled={readOnly}
                    >
                      <MoreHorizIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  <Typography
                    variant="subtitle2"
                    sx={{
                      mt: 1.25,
                      fontWeight: 800,
                      color: color.text,
                    }}
                  >
                    {cat.name}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      opacity: 0.7,
                      fontSize: 11,
                      mt: 0.5,
                      display: "block",
                    }}
                  >
                    {formatCreatedAt(cat.created_at ?? "")}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>

      {/* ================= MENU ================= */}
      <Menu
        open={Boolean(menuAnchorEl)}
        anchorEl={menuAnchorEl}
        onClose={() => {
          setMenuAnchorEl(null);
          setMenuCategoryId(null);
        }}
        disableAutoFocusItem
        slotProps={{
          paper: {
            sx: {
              borderRadius: 2,
              boxShadow: "0 16px 40px rgba(15,23,42,0.14)",
              border: "1px solid",
              borderColor: "divider",
              minWidth: 180,
              py: 0.5,
            },
          },
        }}
      >
        <MenuItem
          onClick={() => {
            setDeleteOpen(true);
            setMenuAnchorEl(null);
          }}
          sx={{
            borderRadius: 1.5,
            mx: 0.75,
            my: 0.25,
            "&:hover": {
              bgcolor: "rgba(239,68,68,0.08)",
            },
          }}
          disabled={readOnly}
        >
          <ListItemIcon sx={{ minWidth: 28 }}>
            <DeleteOutlineIcon fontSize="small" />
          </ListItemIcon>
          Delete Category
        </MenuItem>
      </Menu>

      {/* ================= DELETE MODAL ================= */}
      <ConfirmationModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete Category?"
        subtitle="Are you sure you want to delete this category?"
        confirmText="Delete"
        confirmColor="error"
        loading={deleteLoading}
        onConfirm={async () => {
          if (!menuCategoryId) return;

          setDeleteLoading(true);
          try {
            const res = await deleteCategory({ id: menuCategoryId });
            if ("error" in res) return;

            const next = categories.filter((c) => c.id !== menuCategoryId);

            onCategoriesUpdated?.(next);
            onCategoryDeleted?.(menuCategoryId);

            if (activeCategoryId === menuCategoryId) {
              setActiveCategoryId(null);
            }

            setDeleteOpen(false);
          } finally {
            setDeleteLoading(false);
          }
        }}
      />

      {/* ================= MODAL TABLE ================= */}
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
              categories={categories.map((c) => ({
                id: c.id,
                name: c.name,
              }))}
              initialPageSize={10}
              lockedCategoryId={activeCategoryId}
              hideTopActions
              notesScopeUserId={notesScopeUserId}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
