"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function NoDataAvailableDialog({ open }: { open: boolean }) {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: 2.5,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 10px 35px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.06)",
          backdropFilter: "blur(20px)",
          background: "rgba(255,255,255,0.95)",
          mx: "auto",
          mt: "12vh",
        },
      }}
    >
      <DialogContent sx={{ p: 4, pb: 3 }}>
        {/* Icon */}
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 2,
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          }}
        >
          <Typography
            variant="h4"
            sx={{ color: "text.secondary", fontWeight: 200 }}
          >
            📝
          </Typography>
        </Box>

        {/* Title */}
        <Typography
          variant="h5"
          sx={{
            textAlign: "center",
            fontWeight: 600,
            color: "text.primary",
            mb: 1,
            fontSize: "1.125rem",
          }}
        >
          No Data Yet
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="body2"
          sx={{
            textAlign: "center",
            color: "text.secondary",
            lineHeight: 1.6,
            fontSize: "0.875rem",
          }}
        >
          This user hasn&apos;t created any notes or categories yet.
        </Typography>

        {/* Close Button */}
        <IconButton
          aria-label="Close"
          onClick={() => setIsOpen(false)}
          sx={{
            position: "absolute",
            right: 12,
            top: 12,
            color: "text.secondary",
            width: 36,
            height: 36,
            "&:hover": {
              background: "rgba(148, 163, 184, 0.12)",
              transform: "scale(1.05)",
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogContent>
    </Dialog>
  );
}
