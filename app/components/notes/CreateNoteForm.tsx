"use client";

import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { createClient } from "@/lib/supabase/client";

export type NoteRow = {
  id: string;
  title: string;
  content: string;
  user_id: string;
  created_at: string;
  category_id?: string | null;
};

export type NoteInsert = {
  title: string;
  content: string;
  user_id: string;
};

type Props = {
  userId: string;
  onCancel?: () => void;
  onCreated?: (note: NoteRow) => void;
  onError?: (message: string) => void;
};

export default function CreateNoteForm({
  userId,
  onCancel,
  onCreated,
  onError,
}: Props) {
  const supabase = useMemo(() => createClient(), []);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const canSubmit =
    !submitting && userId.trim().length > 0 && title.trim() && content.trim();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!userId) {
      setFormError("You must be signed in to create a note.");
      return;
    }

    if (!trimmedTitle || !trimmedContent) {
      setFormError("Title and content are required.");
      return;
    }

    setSubmitting(true);
    try {
      const payload: NoteInsert = {
        title: trimmedTitle,
        content: trimmedContent,
        user_id: userId,
      };

      const { data, error } = await supabase
        .from("notes")
        .insert(payload)
        .select("*")
        .single<NoteRow>();

      if (error) {
        setFormError(error.message || "Failed to create note.");
        onError?.(error.message || "Failed to create note.");
        return;
      }

      if (!data) {
        setFormError("Failed to create note.");
        onError?.("Failed to create note.");
        return;
      }

      onCreated?.(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create note.";
      setFormError(message);
      onError?.(message);
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

