"use client";

import {
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { NoteWithCategory } from "@/app/(dashboard)/actions/notes/types";

type Props = {
  open: boolean;
  note: NoteWithCategory | null;
  onClose: () => void;
};

function formatCreatedAt(value: string) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export default function NoteDetailModal({ open, note, onClose }: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 18px 48px rgba(15,23,42,0.16)",
        },
      }}
    >
      <DialogTitle sx={{ pr: 6, pb: 1, fontWeight: 800 }}>
        {note?.title ?? ""}
        <IconButton
          aria-label="Close"
          onClick={onClose}
          sx={{ position: "absolute", right: 12, top: 12 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2.25 }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
          <Chip
            label={note?.category_name || "Uncategorized"}
            size="small"
            sx={{
              borderRadius: 1.5,
              bgcolor: "grey.100",
              "& .MuiChip-label": { px: 1, fontSize: 12 },
            }}
          />
          <Typography variant="caption" sx={{ color: "text.secondary", pt: 0.6 }}>
            {formatCreatedAt(note?.created_at ?? "")}
          </Typography>
        </Box>

        <Typography
          variant="body2"
          sx={{
            whiteSpace: "pre-wrap",
            lineHeight: 1.75,
            color: "text.primary",
          }}
        >
          {note?.content ?? ""}
        </Typography>
      </DialogContent>
    </Dialog>
  );
}

