"use client";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { appTheme } from "@/app/theme";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


// global wrapper: behavior & system global
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <ToastContainer
        position="top-center"
        autoClose={3200}
        closeOnClick
        pauseOnHover
        theme="light"
        limit={4}
      />
      {children}
    </ThemeProvider>
  );
}
