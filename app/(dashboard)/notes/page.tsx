"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AppLayout from "@/app/components/layout/AppLayout";
import { createClient } from "@/lib/supabase/client";
import {
  Button,
  CircularProgress,
  Typography,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CreateNoteForm, { type NoteRow } from "@/app/components/notes/CreateNoteForm";

interface UserRole {
  role: "user" | "admin";
}

export default function NotesPage() {
  const [notes, setNotes] = useState<NoteRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");
  const [userId, setUserId] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const supabase = useMemo(() => createClient(), []);

  // ====================
  // Fetch notes function
  // ====================
  const fetchNotes = useCallback(
    async (uid: string) => {
      if (!uid) return;

      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", uid)
        .order("created_at", { ascending: false })
        .returns<NoteRow[]>();

      if (error) {
        console.error("Error fetching notes:", error.message);
        setSnackbarSeverity("error");
        setSnackbarMessage(error.message || "Failed to load notes");
        setSnackbarOpen(true);
        return;
      }

      setNotes(data ?? []);
    },
    [supabase]
  );

  // ====================
  // Fetch user & role
  // ====================
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        setUserEmail(user.email || "");
        setUserId(user.id);

        const { data: userData, error } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .single()
          .returns<UserRole>();

        if (error) {
          console.error("Error fetching role:", error.message);
        } else if (userData?.role === "admin") {
          setRole("admin");
        }

        await fetchNotes(user.id);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [fetchNotes, supabase]);

  // ====================
  // Render loading
  // ====================
  if (loading) {
    return (
      <AppLayout pageTitle="My Notes" userEmail={userEmail} role={role}>
        <div className="p-6 flex items-center justify-center">
          <CircularProgress />
        </div>
      </AppLayout>
    );
  }

  // ====================
  // Main render
  // ====================
  return (
    <AppLayout pageTitle="My Notes" userEmail={userEmail} role={role}>
      <Box className="p-6 space-y-6">
        <Box className="flex items-center justify-between">
          <Box>
            <Typography variant="h6" className="font-semibold">
              Notes
            </Typography>
            <Typography variant="body2" className="text-gray-500">
              Create and manage your personal notes.
            </Typography>
          </Box>

          <Button
            variant="contained"
            disableElevation
            onClick={() => setModalOpen(true)}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 2.5,
              py: 1,
              boxShadow: "0 10px 22px rgba(0,0,0,0.10)",
            }}
          >
            Add Note
          </Button>
        </Box>

        <Box className="bg-white rounded-2xl shadow-md p-6">
          {notes.length > 0 ? (
            <Box component="ul" className="space-y-3">
              {notes.map((note) => (
                <Box
                  component="li"
                  key={note.id}
                  className="border p-3 rounded-lg hover:bg-gray-50 transition"
                >
                  <Typography variant="subtitle1" className="font-semibold">
                    {note.title}
                  </Typography>
                  <Typography variant="body2" className="text-gray-500">
                    {note.content}
                  </Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography className="text-gray-600">
              You don&apos;t have any notes yet.
            </Typography>
          )}
        </Box>
      </Box>

      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: "0 30px 80px rgba(0,0,0,0.22)",
          },
        }}
      >
        <DialogTitle
          sx={{
            pr: 6,
            pb: 1,
            fontWeight: 700,
          }}
        >
          Create Note
          <IconButton
            aria-label="Close"
            onClick={() => setModalOpen(false)}
            sx={{ position: "absolute", right: 12, top: 12 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 2.5 }}>
          <CreateNoteForm
            userId={userId}
            onCancel={() => setModalOpen(false)}
            onCreated={(created) => {
              setNotes((prev) => [created, ...prev]);
              setModalOpen(false);
              setSnackbarSeverity("success");
              setSnackbarMessage("Note created successfully");
              setSnackbarOpen(true);
            }}
            onError={(message) => {
              setSnackbarSeverity("error");
              setSnackbarMessage(message);
              setSnackbarOpen(true);
            }}
          />
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        autoHideDuration={3500}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ borderRadius: 2 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </AppLayout>
  );
}
