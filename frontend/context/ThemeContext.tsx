import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { getPalette, shadowsFor, type ThemePalette, type ThemeScheme } from "../theme";

type ThemeContextValue = {
  scheme: ThemeScheme;
  isDark: boolean;
  setDark: (next: boolean) => void;
  toggleDark: () => void;
  colors: ThemePalette;
  shadow: ReturnType<typeof shadowsFor>;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setDark] = useState(false);

  const scheme: ThemeScheme = isDark ? "dark" : "light";
  const colors = useMemo(() => getPalette(scheme), [scheme]);
  const shadow = useMemo(() => shadowsFor(colors), [colors]);

  const toggleDark = useCallback(() => setDark((d) => !d), []);

  const value = useMemo(
    (): ThemeContextValue => ({
      scheme,
      isDark,
      setDark,
      toggleDark,
      colors,
      shadow,
    }),
    [scheme, isDark, toggleDark, colors, shadow],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
