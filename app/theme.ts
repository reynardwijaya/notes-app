import { createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#fafafa",
      paper: "#ffffff",
    },
  },
  shape: {
    borderRadius: 8,
  },
});
