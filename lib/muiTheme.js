"use client";

import { createTheme } from "@mui/material/styles";

/** Aligné sur app/globals.css — valeurs statiques (évite les écarts d’hydratation MUI/Emotion). */
/** Rouge et jaune du drapeau : identiques dans les deux modes. */
const FLAG = {
  primary: "#ce1126",
  primaryDark: "#9e0c1c",
  primaryLight: "#e23b4c",
  primaryContrast: "#ffffff",
  secondary: "#ffcd00",
  secondaryLight: "#ffe56a",
  secondaryContrast: "#171717",
};

const TOKENS = {
  light: {
    ...FLAG,
    backgroundDefault: "#f4f4f6",
    backgroundPaper: "#ffffff",
    textPrimary: "#171717",
    textSecondary: "#5c5c66",
    divider: "rgba(23, 23, 23, 0.1)",
    success: "#2f7d4a",
    error: "#ce1126",
    warning: "#ffcd00",
  },
  dark: {
    ...FLAG,
    backgroundDefault: "#0a0a0b",
    backgroundPaper: "#161618",
    textPrimary: "#ededed",
    textSecondary: "#a1a1a8",
    divider: "rgba(255, 255, 255, 0.1)",
    success: "#7dcea0",
    error: "#ff5a6a",
    warning: "#ffcd00",
  },
};

const SERIF = "var(--font-cormorant), Georgia, 'Times New Roman', serif";
const SANS = "var(--font-outfit), system-ui, sans-serif";

export function buildMuiTheme(modeHint = "light") {
  const isDark = modeHint === "dark";
  const t = isDark ? TOKENS.dark : TOKENS.light;

  return createTheme({
    palette: {
      mode: isDark ? "dark" : "light",
      primary: {
        main: t.primary,
        dark: t.primaryDark,
        light: t.primaryLight,
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
    shape: { borderRadius: 18 },
    typography: {
      fontFamily: SANS,
      h1: {
        fontFamily: SERIF,
        fontWeight: 500,
        letterSpacing: "-0.02em",
        lineHeight: 1.02,
      },
      h2: {
        fontFamily: SERIF,
        fontWeight: 500,
        letterSpacing: "-0.015em",
        lineHeight: 1.08,
      },
      h3: {
        fontFamily: SERIF,
        fontWeight: 500,
        letterSpacing: "-0.01em",
        lineHeight: 1.1,
      },
      h4: { fontFamily: SERIF, fontWeight: 500, lineHeight: 1.15 },
      h5: { fontFamily: SERIF, fontWeight: 500 },
      h6: { fontWeight: 600, letterSpacing: "-0.01em" },
      overline: {
        fontWeight: 600,
        letterSpacing: "0.22em",
        fontSize: "0.7rem",
      },
      button: {
        textTransform: "none",
        fontWeight: 600,
        letterSpacing: "0.01em",
      },
    },
    components: {
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: 999,
            paddingInline: 22,
            paddingBlock: 10,
            transition: "transform 220ms ease, box-shadow 220ms ease, background-color 220ms ease",
            "&:hover": { transform: "translateY(-1px)" },
          },
          containedPrimary: {
            boxShadow: "var(--shadow-gold)",
            "&:hover": { boxShadow: "var(--shadow-gold)" },
          },
          outlined: {
            borderColor: "var(--border-strong)",
          },
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
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 999, fontWeight: 500 },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: "none" },
        },
      },
      MuiTextField: {
        defaultProps: { size: "small" },
      },
    },
  });
}
