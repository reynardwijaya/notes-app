"use client";

import { useMemo, useState } from "react";
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
import { createNote, type CreatedNote } from "@/app/actions/createNote";

export type NoteRow = CreatedNote;

export type NoteCategory = {
  id: string;
  name: string;
};

type Props = {
  categories: NoteCategory[];
  onCancel?: () => void;
  onCreated?: (note: NoteRow) => void;
};

export default function CreateNoteForm({
  categories,
  onCancel,
  onCreated,
}: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const canSubmit = !submitting && title.trim() && content.trim() && categoryId;

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
      const res = await createNote({
        title: trimmedTitle,
        content: trimmedContent,
        categoryId,
      });

      if ("error" in res) {
        setFormError(res.error);
        return;
      }

      onCreated?.(res.note);
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
        }}
      />

      <FormControl fullWidth required>
        <InputLabel id="category-label">Category</InputLabel>
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
          }}
        >
          {submitting ? <CircularProgress size={20} /> : "Create note"}
        </Button>
      </Box>
    </Box>
  );
}

