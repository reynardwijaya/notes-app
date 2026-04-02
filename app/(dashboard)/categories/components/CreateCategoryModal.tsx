"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { createCategory } from "@/app/(dashboard)/categories/utils/createCategory";
import { deleteCategory } from "@/app/(dashboard)/categories/utils/deleteCategory";
import { getCategoryUsage } from "@/app/(dashboard)/categories/utils/getCategoryUsage";
import ConfirmationModal from "@/app/components/ConfirmationModal";
import type { NoteCategory } from "@/app/(dashboard)/notes/utils/types";
import {
  buildCategoryColorIndex,
  getPastelByIndex,
} from "@/utils/categoryColors";

type Props = {
  open: boolean;
  categories: NoteCategory[];
  onClose: () => void;
  onCategoriesUpdated: (categories: NoteCategory[]) => void;
  onSuccessMessage?: (message: string) => void;
  onErrorMessage?: (message: string) => void;
};

export default function CreateCategoryModal({
  open,
  categories,
  onClose,
  onCategoriesUpdated,
  onSuccessMessage,
  onErrorMessage,
}: Props) {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteUsage, setDeleteUsage] = useState<{ titles: string[] } | null>(
    null,
  );
  const [deleteUsageLoading, setDeleteUsageLoading] = useState(false);

  const categoryColorIndex = buildCategoryColorIndex(categories);

  const handleCreate = async () => {
    const trimmed = name.trim();
    if (!trimmed || saving) return;

    setSaving(true);
    try {
      const res = await createCategory({ name: trimmed });
      if ("error" in res) {
        onErrorMessage?.(res.error);
        return;
      }
      onCategoriesUpdated(res.categories);
      setName("");
      onSuccessMessage?.("Category created");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      const res = await deleteCategory({ id: deleteId });
      if ("error" in res) {
        onErrorMessage?.(res.error);
        return;
      }
      onCategoriesUpdated(res.categories);
      onSuccessMessage?.("Category deleted");
      setDeleteId(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 18px 48px rgba(15,23,42,0.16)",
            overflow: "visible",
          },
        }}
      >
        <DialogTitle sx={{ pr: 6, pb: 1, fontWeight: 700 }}>
          Create Category
          <IconButton
            aria-label="Close"
            onClick={onClose}
            sx={{ position: "absolute", right: 12, top: 12 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            pt: 1,
            overflow: "visible",
          }}
        >
          {categories.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  mb: 1.25,
                  fontWeight: 500,
                  wordBreak: "break-word",
                }}
              >
                Existing categories
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {categories.map((cat) =>
                  (() => {
                    const idx = categoryColorIndex.get(cat.id) ?? 0;
                    const color = getPastelByIndex(idx);
                    return (
                      <Chip
                        key={cat.id}
                        label={cat.name}
                        onDelete={async () => {
                          setDeleteId(cat.id);
                          setDeleteUsage(null);
                          setDeleteUsageLoading(true);
                          try {
                            const res = await getCategoryUsage({ id: cat.id });
                            if ("error" in res) return;
                            if (res.titles.length > 0) {
                              setDeleteUsage({ titles: res.titles });
                            }
                          } finally {
                            setDeleteUsageLoading(false);
                          }
                        }}
                        deleteIcon={<CloseIcon sx={{ fontSize: 16 }} />}
                        sx={{
                          borderRadius: 999,
                          height: 32,
                          bgcolor: color.bg,
                          color: color.text,
                          border: "1px solid",
                          borderColor: color.border,
                          "& .MuiChip-label": { px: 1.25, fontWeight: 700 },
                          "& .MuiChip-deleteIcon": {
                            color: "rgba(55,65,81,0.72)",
                            "&:hover": { color: "rgba(185,28,28,0.72)" },
                          },
                          "&:hover": {
                            bgcolor: color.bg,
                            borderColor: color.border,
                          },
                        }}
                      />
                    );
                  })(),
                )}
              </Box>
            </Box>
          )}

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <TextField
              label="Category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: 1.5 },
                "& .MuiFormLabel-asterisk": { color: "error.main" },
              }}
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
              <Button
                onClick={onClose}
                variant="text"
                sx={{ textTransform: "none", borderRadius: 1.5 }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => void handleCreate()}
                disabled={saving || !name.trim()}
                variant="contained"
                sx={{
                  textTransform: "none",
                  borderRadius: 1.5,
                  boxShadow: "none",
                }}
              >
                Save
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      <ConfirmationModal
        open={Boolean(deleteId)}
        onClose={() => {
          setDeleteId(null);
          setDeleteUsage(null);
        }}
        onConfirm={handleDelete}
        loading={deleteLoading || deleteUsageLoading}
        title="Delete Category?"
        subtitle={
          deleteUsage?.titles?.length
            ? `This category is used in the following notes: ${deleteUsage.titles
                .map((t) => `'${t}'`)
                .join(", ")}. Are you sure you want to delete it?`
            : "This action cannot be undone"
        }
        confirmText="Delete"
        confirmColor="error"
      />
    </>
  );
}
