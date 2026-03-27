"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { createNote } from "@/app/(dashboard)/actions/notes/createNote";
import type {
  NoteCategory,
  NoteSaveInput,
  NoteSaveResult,
  NoteWithCategory,
} from "@/app/(dashboard)/actions/notes/types";

type Props = {
  categories: NoteCategory[];
  initialValues?: Partial<NoteSaveInput>;
  onCancel?: () => void;
  onSaved?: (note: NoteWithCategory) => void;
  onOpenCategoryModal?: () => void;
  submitAction?: (input: NoteSaveInput) => Promise<NoteSaveResult>;
  submitLabel?: string;
  disableSubmitIfUnchanged?: boolean;
};

export default function CreateNoteForm({
  categories,
  initialValues,
  onCancel,
  onSaved,
  onOpenCategoryModal,
  submitAction,
  submitLabel = "Create note",
  disableSubmitIfUnchanged = false,
}: Props) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [content, setContent] = useState(initialValues?.content ?? "");
  const [categoryId, setCategoryId] = useState(initialValues?.categoryId ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const initialTrimmed = {
    title: (initialValues?.title ?? "").trim(),
    content: (initialValues?.content ?? "").trim(),
    categoryId: (initialValues?.categoryId ?? "").trim(),
  };

  const currentTrimmed = {
    title: title.trim(),
    content: content.trim(),
    categoryId: categoryId.trim(),
  };

  const isUnchanged =
    disableSubmitIfUnchanged &&
    currentTrimmed.title === initialTrimmed.title &&
    currentTrimmed.content === initialTrimmed.content &&
    currentTrimmed.categoryId === initialTrimmed.categoryId;

  const canSubmit =
    !submitting &&
    Boolean(currentTrimmed.title) &&
    Boolean(currentTrimmed.content) &&
    Boolean(currentTrimmed.categoryId) &&
    !isUnchanged;

  useEffect(() => {
    setTitle(initialValues?.title ?? "");
    setContent(initialValues?.content ?? "");
    setCategoryId(initialValues?.categoryId ?? "");
  }, [initialValues?.title, initialValues?.content, initialValues?.categoryId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
      setFormError("Title and content are required.");
      return;
    }

    if (!categoryId) {
      setFormError("Category is required.");
      return;
    }

    setSubmitting(true);
    try {
      const action = submitAction ?? createNote;
      const res = await action({
        title: trimmedTitle,
        content: trimmedContent,
        categoryId,
      });

      if ("error" in res) {
        setFormError(res.error);
        return;
      }

      onSaved?.(res.note);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create note.";
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2.25 }}
    >
      <Box sx={{ mb: 0.5 }}>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", lineHeight: 1.4 }}
        >
          Add a title and content. Your note will be saved to your account.
        </Typography>
      </Box>

      {formError && (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {formError}
        </Alert>
      )}

      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        fullWidth
        autoFocus
        inputProps={{ maxLength: 120 }}
        sx={{
          "& .MuiOutlinedInput-root": { borderRadius: 2.5 },
          "& .MuiFormLabel-asterisk": { color: "error.main" },
        }}
      />

      <FormControl fullWidth required>
        <InputLabel
          id="category-label"
          sx={{ "& .MuiFormLabel-asterisk": { color: "error.main" } }}
        >
          Category
        </InputLabel>
        <Select
          labelId="category-label"
          label="Category"
          value={categoryId}
          onChange={(e) => setCategoryId(String(e.target.value))}
          sx={{
            borderRadius: 2.5,
            "& .MuiOutlinedInput-notchedOutline": { borderRadius: 2.5 },
          }}
        >
          {categories.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>
              {cat.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: -0.5 }}>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          Select one category for this note.
        </Typography>
        <Button
          type="button"
          size="small"
          startIcon={<AddIcon fontSize="small" />}
          onClick={onOpenCategoryModal}
          sx={{
            textTransform: "none",
            minHeight: 24,
            borderRadius: 1.5,
            px: 1,
          }}
        >
          Create Category
        </Button>
      </Box>

      <TextField
        label="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        fullWidth
        multiline
        minRows={5}
        sx={{
          "& .MuiOutlinedInput-root": { borderRadius: 2.5 },
          "& .MuiFormLabel-asterisk": { color: "error.main" },
        }}
      />

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.25, pt: 0.5 }}>
        <Button
          type="button"
          variant="text"
          onClick={onCancel}
          disabled={submitting}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disableElevation
          disabled={!canSubmit}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            px: 2.5,
            boxShadow: "0 10px 22px rgba(0,0,0,0.10)",
            ...(isUnchanged
              ? { bgcolor: "grey.300", color: "grey.700", boxShadow: "none" }
              : {}),
          }}
        >
          {submitting ? <CircularProgress size={20} /> : submitLabel}
        </Button>
      </Box>
    </Box>
  );
}

