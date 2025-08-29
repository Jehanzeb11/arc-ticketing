import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#f2f2f2" },
    background: { default: "#ffffff", paper: "#ffffff" },
  },
  typography: {
    fontFamily: "var(--font-poppins), var(--font-poppins), sans-serif",
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#000000" },
    background: { default: "#1d1d1d", paper: "#1d1d1d" },
  },
  typography: {
    fontFamily: "var(--font-poppins), var(--font-poppins), sans-serif",
  },
});
