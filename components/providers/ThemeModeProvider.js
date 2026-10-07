"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { buildMuiTheme } from "@/lib/muiTheme";

const STORAGE_KEY = "dndela-theme-mode";

const ThemeModeContext = createContext({
  mode: "system",
  setMode: () => {},
  resolvedMode: "light",
});

function getSystemMode() {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function readStoredMode() {
  if (typeof window === "undefined") return "system";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }
  return "system";
}

function resolveMode(nextMode) {
  return nextMode === "system" ? getSystemMode() : nextMode;
}

/** Thème MUI identique SSR + 1er rendu client (toujours clair), puis prefs utilisateur. */
const SSR_MUI_MODE = "light";

export function ThemeModeProvider({ children }) {
  const [mode, setModeState] = useState("system");
  const [resolvedMode, setResolvedMode] = useState(SSR_MUI_MODE);
  const [muiMode, setMuiMode] = useState(SSR_MUI_MODE);

  useEffect(() => {
    setModeState(readStoredMode());
  }, []);

  const applyDocumentTheme = useCallback((nextMode) => {
    const resolved = resolveMode(nextMode);
    document.documentElement.setAttribute("data-theme", nextMode);
    setResolvedMode(resolved);
    setMuiMode(resolved);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
    window.localStorage.setItem(STORAGE_KEY, mode);
    const resolved = resolveMode(mode);
    setResolvedMode(resolved);
    setMuiMode(resolved);
  }, [mode]);

  useEffect(() => {
    if (mode !== "system") return undefined;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyDocumentTheme("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [mode, applyDocumentTheme]);

  const muiTheme = useMemo(() => buildMuiTheme(muiMode), [muiMode]);

  const setMode = useCallback((next) => {
    setModeState(next);
  }, []);

  const value = useMemo(
    () => ({ mode, setMode, resolvedMode }),
    [mode, setMode, resolvedMode],
  );

  return (
    <ThemeModeContext.Provider value={value}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline enableColorScheme />
        {children}
      </MuiThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  return useContext(ThemeModeContext);
}
