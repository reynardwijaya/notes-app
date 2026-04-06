import { createTheme } from "@mui/material/styles";

// global design system untuk MUI
export const appTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#fafafa",
      paper: "#ffffff",
    },
  },
  shape: {
    borderRadius: 6,
  },
});
