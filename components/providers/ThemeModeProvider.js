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
import {
  CONSENT,
  DEFAULT_THEME_MODE,
  THEME_STORAGE_KEY,
  canPersistPreferences,
  readConsentClient,
  readStoredThemeClient,
} from "@/lib/preferences";

const ThemeModeContext = createContext({
  mode: DEFAULT_THEME_MODE,
  setMode: () => {},
  resolvedMode: "light",
  setPreferencesPersistence: () => {},
});

function getSystemMode() {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolveMode(nextMode) {
  return nextMode === "system" ? getSystemMode() : nextMode;
}

/** Thème MUI identique SSR + 1er rendu client (toujours clair), puis prefs utilisateur si consentement. */
const SSR_MUI_MODE = "light";

export function ThemeModeProvider({ children }) {
  const [mode, setModeState] = useState(DEFAULT_THEME_MODE);
  const [resolvedMode, setResolvedMode] = useState(SSR_MUI_MODE);
  const [muiMode, setMuiMode] = useState(SSR_MUI_MODE);
  const [persistPreferences, setPersistPreferences] = useState(false);

  const setPreferencesPersistence = useCallback((enabled) => {
    setPersistPreferences(enabled);
  }, []);

  useEffect(() => {
    const consent = readConsentClient();
    const persist = canPersistPreferences(consent);
    setPersistPreferences(persist);
    setModeState(persist ? readStoredThemeClient() : DEFAULT_THEME_MODE);
  }, []);

  const applyDocumentTheme = useCallback((nextMode) => {
    const resolved = resolveMode(nextMode);
    document.documentElement.setAttribute("data-theme", nextMode);
    setResolvedMode(resolved);
    setMuiMode(resolved);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
    if (persistPreferences) {
      window.localStorage.setItem(THEME_STORAGE_KEY, mode);
    }
    const resolved = resolveMode(mode);
    setResolvedMode(resolved);
    setMuiMode(resolved);
  }, [mode, persistPreferences]);

  useEffect(() => {
    if (mode !== "system") return undefined;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyDocumentTheme("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [mode, applyDocumentTheme]);

  useEffect(() => {
    if (persistPreferences) return undefined;
    if (readConsentClient() === CONSENT.rejected) {
      setModeState(DEFAULT_THEME_MODE);
    }
  }, [persistPreferences]);

  const muiTheme = useMemo(() => buildMuiTheme(muiMode), [muiMode]);

  const setMode = useCallback((next) => {
    setModeState(next);
  }, []);

  const value = useMemo(
    () => ({ mode, setMode, resolvedMode, setPreferencesPersistence }),
    [mode, setMode, resolvedMode, setPreferencesPersistence],
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
