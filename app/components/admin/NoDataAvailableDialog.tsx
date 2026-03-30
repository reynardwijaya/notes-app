"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
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
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 18px 48px rgba(15,23,42,0.16)",
          border: "1px solid",
          borderColor: "divider",
        },
      }}
    >
      <DialogTitle sx={{ pr: 6, pb: 0.75, fontWeight: 800 }}>
        No Data Available
        <IconButton
          aria-label="Close"
          onClick={() => setIsOpen(false)}
          sx={{ position: "absolute", right: 10, top: 10 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 1.5, pb: 2.5 }}>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          This user has not created any notes or categories yet.
        </Typography>
      </DialogContent>
    </Dialog>
  );
}

