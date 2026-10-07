"use client";

import { createTheme } from "@mui/material/styles";

/** Aligné sur app/globals.css — pas de getComputedStyle (évite l’hydratation MUI/Emotion). */
const TOKENS = {
  light: {
    primary: "#8b3045",
    primaryDark: "#6f2436",
    primaryContrast: "#ffffff",
    secondary: "#182d25",
    secondaryLight: "#2a4538",
    secondaryContrast: "#f8f2e8",
    backgroundDefault: "#f8f2e8",
    backgroundPaper: "#fffcf7",
    textPrimary: "#182d25",
    textSecondary: "#3d5548",
    divider: "#e8dfd0",
    success: "#6b8f4e",
    error: "#b54760",
    warning: "#bda77c",
  },
  dark: {
    primary: "#b54760",
    primaryDark: "#8b3045",
    primaryContrast: "#ffffff",
    secondary: "#f8f2e8",
    secondaryLight: "#fffcf7",
    secondaryContrast: "#0d1c16",
    backgroundDefault: "#0d1c16",
    backgroundPaper: "#1a3026",
    textPrimary: "#f8f2e8",
    textSecondary: "#c9dcc0",
    divider: "#2a4538",
    success: "#6b8f4e",
    error: "#b54760",
    warning: "#bda77c",
  },
};

export function buildMuiTheme(modeHint = "light") {
  const isDark = modeHint === "dark";
  const t = isDark ? TOKENS.dark : TOKENS.light;

  return createTheme({
    palette: {
      mode: isDark ? "dark" : "light",
      primary: {
        main: t.primary,
        dark: t.primaryDark,
        contrastText: t.primaryContrast,
      },
      secondary: {
        main: t.secondary,
        light: t.secondaryLight,
        contrastText: t.secondaryContrast,
      },
      background: {
        default: t.backgroundDefault,
        paper: t.backgroundPaper,
      },
      text: {
        primary: t.textPrimary,
        secondary: t.textSecondary,
      },
      divider: t.divider,
      success: { main: t.success },
      error: { main: t.error },
      warning: { main: t.warning },
    },
    shape: { borderRadius: 14 },
    typography: {
      fontFamily: "var(--font-display), system-ui, sans-serif",
      h1: { fontWeight: 800, letterSpacing: "-0.03em" },
      h2: { fontWeight: 800, letterSpacing: "-0.02em" },
      button: { textTransform: "none", fontWeight: 700 },
    },
    components: {
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { borderRadius: 999 },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            border: `1px solid ${t.divider}`,
            backgroundImage: "none",
          },
        },
      },
    },
  });
}
