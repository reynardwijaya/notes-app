"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

type Props = {
  open: boolean;
  title?: string;
  subtitle?: string;
  cancelText?: string;
  confirmText?: string;
  confirmColor?: "primary" | "error";
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
};

export default function ConfirmationModal({
  open,
  title = "Are you sure?",
  subtitle,
  cancelText = "Cancel",
  confirmText = "Confirm",
  confirmColor = "primary",
  loading = false,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 16px 42px rgba(15,23,42,0.16)",
        },
      }}
    >
      <DialogTitle sx={{ pb: 0.5, fontWeight: 700 }}>{title}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {subtitle}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          variant="text"
          sx={{ textTransform: "none", borderRadius: 1.5 }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={() => void onConfirm()}
          disabled={loading}
          color={confirmColor}
          variant="contained"
          sx={{
            textTransform: "none",
            borderRadius: 1.5,
            boxShadow: "none",
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

