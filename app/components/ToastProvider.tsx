"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { Alert, Snackbar } from "@mui/material";

type ToastType = "success" | "error";

type ToastState = {
  open: boolean;
  message: string;
  type: ToastType;
  autoHideDuration: number;
};

type ToastApi = {
  showToast: (input: { message: string; type: ToastType; autoHideDuration?: number }) => void;
  success: (message: string, autoHideDuration?: number) => void;
  error: (message: string, autoHideDuration?: number) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ToastState>({
    open: false,
    message: "",
    type: "success",
    autoHideDuration: 3000,
  });

  const close = useCallback(() => {
    setState((s) => ({ ...s, open: false }));
  }, []);

  const showToast = useCallback<ToastApi["showToast"]>((input) => {
    setState({
      open: true,
      message: input.message,
      type: input.type,
      autoHideDuration: input.autoHideDuration ?? 3000,
    });
  }, []);

  const api = useMemo<ToastApi>(() => {
    return {
      showToast,
      success: (message, autoHideDuration) =>
        showToast({ message, type: "success", autoHideDuration }),
      error: (message, autoHideDuration) =>
        showToast({ message, type: "error", autoHideDuration }),
    };
  }, [showToast]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <Snackbar
        open={state.open}
        onClose={close}
        autoHideDuration={state.autoHideDuration}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={close}
          severity={state.type}
          variant="filled"
          sx={{ borderRadius: 2, boxShadow: "0 12px 30px rgba(15,23,42,0.14)" }}
        >
          {state.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}

