"use client";

import { useState, useEffect } from "react";
import { createNote } from "@/app/actions/notes/createNote";
import { getCategories } from "@/lib/categories/getCategories";
import { useRouter } from "next/navigation";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
} from "@mui/material";

export default function CreateNoteForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [categories, setCategories] = useState<
    { id: string; name: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const res = await createNote(formData);

    if (res.error) {
      setError(res.error);
      setSubmitting(false);
      return;
    }

    setSuccess("Note created successfully!");

    // 👉 kalau dipakai di modal
    if (onSuccess) {
      onSuccess();
    } else {
      // 👉 kalau dipakai di page
      setTimeout(() => router.push("/notes"), 1000);
    }

    setSubmitting(false);
  };

  return (
    <Paper className="w-full p-6 rounded-3xl shadow-none">
      <Typography variant="h5" className="mb-4 font-bold">
        Create New Note
      </Typography>

      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" className="mb-4">
          {success}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        <TextField name="title" label="Title" fullWidth required />

        <TextField
          name="content"
          label="Content"
          multiline
          rows={4}
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            name="category_id"
            defaultValue=""
          >
            <MenuItem value="">None</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 mt-2"
        >
          {submitting ? <CircularProgress size={20} /> : "Save Note"}
        </Button>
      </Box>
    </Paper>
  );
}