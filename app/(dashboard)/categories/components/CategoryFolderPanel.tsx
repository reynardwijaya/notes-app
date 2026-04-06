"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { TablePagination } from "@mui/material";
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
import { getCategoriesPaginated } from "@/app/(dashboard)/categories/utils/getCategories";

import type { NoteCategory } from "@/app/(dashboard)/notes/utils/types";
import NotesDataTable from "@/app/(dashboard)/notes/components/NotesDataTable";
import { buildCategoryColorIndex } from "@/lib/categoryColorMap";
import { getCategoryStyle } from "@/lib/categoryStyle";
import ConfirmationModal from "@/app/components/ConfirmationModal";
import { deleteCategory } from "@/app/(dashboard)/categories/utils/deleteCategory";

type CategoryWithMeta = NoteCategory & {
  created_at?: string;
  total_notes?: number;
};

type FolderInitial = {
  rows: CategoryWithMeta[];
  total: number;
  pageSize: number;
};

type Props = {
  /** Full category id/name list for nested notes UI (single source for pickers). */
  categoryOptionsForNotes: NoteCategory[];
  folderInitial: FolderInitial;
  /** Incremented when the shared category list changes (create/delete) to refetch the folder page. */
  folderInvalidate: number;
  /** When set (admin scoped view), folder grid pages over this list on the client. */
  scopedFolderCategories?: CategoryWithMeta[];
  notesInitialData: Parameters<typeof NotesDataTable>[0]["initialData"];
  notesInitialTotal: number;
  onCategoriesUpdated?: (categories: NoteCategory[]) => void;
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
  categoryOptionsForNotes,
  folderInitial,
  folderInvalidate,
  scopedFolderCategories,
  notesInitialData,
  notesInitialTotal,
  onCategoriesUpdated,
  onCategoryDeleted,
  onRequestCreateCategory,
  readOnly = false,
  notesScopeUserId,
}: Props) {
  const router = useRouter();
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [menuCategoryId, setMenuCategoryId] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [data, setData] = useState<CategoryWithMeta[]>(folderInitial.rows);
  const [total, setTotal] = useState(folderInitial.total);

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(folderInitial.pageSize);
  const [loading, setLoading] = useState(false);

  const userChangedPaging = useRef(false);

  const useClientFolderPaging = Boolean(
    notesScopeUserId && scopedFolderCategories,
  );

  useEffect(() => {
    if (useClientFolderPaging && scopedFolderCategories) {
      const start = pageIndex * pageSize;
      const slice = scopedFolderCategories.slice(start, start + pageSize);
      setData(slice);
      setTotal(scopedFolderCategories.length);
      if (
        pageIndex > 0 &&
        slice.length === 0 &&
        scopedFolderCategories.length > 0
      ) {
        setPageIndex((p) => p - 1);
      }
      return;
    }

    const trustServerSeed =
      !userChangedPaging.current &&
      folderInvalidate === 0 &&
      pageIndex === 0 &&
      pageSize === folderInitial.pageSize;

    if (trustServerSeed) {
      setData(folderInitial.rows);
      setTotal(folderInitial.total);
      return;
    }

    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const res = await getCategoriesPaginated({ page: pageIndex, pageSize });
        if (cancelled) return;
        setData(res.data);
        setTotal(res.total);
        if (pageIndex > 0 && res.data.length === 0 && res.total > 0) {
          setPageIndex((p) => p - 1);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    useClientFolderPaging,
    scopedFolderCategories,
    folderInvalidate,
    pageIndex,
    pageSize,
    folderInitial.pageSize,
    folderInitial.rows,
    folderInitial.total,
  ]);

  const categoryColorIndex = useMemo(
    () => buildCategoryColorIndex(categoryOptionsForNotes),
    [categoryOptionsForNotes],
  );

  const activeCategory = data.find((c) => c.id === activeCategoryId) ?? null;

  return (
    <>
      <Box
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 6px 18px rgba(15,23,42,0.05)",
          p: 2,
          bgcolor: "background.paper",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            mb: 1.5,
            color: "text.primary",
          }}
        >
          Categories
        </Typography>

        {loading ? (
          <Box
            sx={{
              height: 120,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Loading categories...
            </Typography>
          </Box>
        ) : data.length === 0 ? (
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
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(12, 1fr)",
              gap: 1.5,
            }}
          >
            {data.map((cat) => {
              const idx = categoryColorIndex.get(cat.id) ?? 0;
              const color = getCategoryStyle(idx);

              return (
                <Box
                  key={cat.id}
                  onClick={() => setActiveCategoryId(cat.id)}
                  className={`${color.bg} ${color.border}`}
                  sx={{
                    gridColumn: { xs: "span 12", sm: "span 6", lg: "span 4" },
                    cursor: "pointer",
                    borderRadius: 3,
                    p: 1.75,
                    boxShadow: "0 6px 16px rgba(15,23,42,0.06)",
                    transition: "all 120ms ease",
                    minHeight: 110,
                    display: "flex",
                    flexDirection: "column",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 10px 20px rgba(15,23,42,0.09)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <FolderOutlinedIcon className={color.text} />
                    {!readOnly && (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuAnchorEl(e.currentTarget);
                          setMenuCategoryId(cat.id);
                        }}
                        sx={{
                          color: "text.secondary",
                          "&:hover": {
                            bgcolor: "rgba(0,0,0,0.05)",
                          },
                        }}
                      >
                        <MoreHorizIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>

                  <Typography
                    variant="subtitle2"
                    className={color.text}
                    sx={{
                      mt: 1,
                      fontWeight: 600,
                    }}
                  >
                    {cat.name}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      opacity: 0.85,
                      fontSize: 12,
                      mt: 0.5,
                      display: "block",
                    }}
                  >
                    {formatCreatedAt(cat.created_at ?? "")}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      mt: "auto",
                      pt: 1,
                      textAlign: "right",
                      color: "text.secondary",
                      fontSize: 12,
                      fontWeight: 500,
                    }}
                  >
                    {`${Number(cat.total_notes ?? 0)} ${
                      Number(cat.total_notes ?? 0) === 1 ? "note" : "notes"
                    }`}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        )}
        {total > 0 && (
          <Box sx={{ mt: 2 }}>
            <TablePagination
              component={Box}
              count={total}
              page={pageIndex}
              onPageChange={(_, nextPage) => {
                userChangedPaging.current = true;
                setPageIndex(nextPage);
              }}
              rowsPerPage={pageSize}
              onRowsPerPageChange={(e) => {
                userChangedPaging.current = true;
                const next = Number(e.target.value);
                setPageSize(next);
                setPageIndex(0);
              }}
              rowsPerPageOptions={[6, 12, 24, 48]}
            />
          </Box>
        )}
      </Box>

      {!readOnly && (
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
          >
            <ListItemIcon sx={{ minWidth: 28 }}>
              <DeleteOutlineIcon fontSize="small" />
            </ListItemIcon>
            Delete Category
          </MenuItem>
        </Menu>
      )}

      {!readOnly && (
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

              onCategoriesUpdated?.(
                res.categories.map((c) => ({ id: c.id, name: c.name })),
              );
              onCategoryDeleted?.(menuCategoryId);
              router.refresh();

              if (activeCategoryId === menuCategoryId) {
                setActiveCategoryId(null);
              }

              setDeleteOpen(false);
            } finally {
              setDeleteLoading(false);
            }
          }}
        />
      )}

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
              categories={categoryOptionsForNotes}
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
