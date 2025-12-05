import { getItem, setItem } from "@/lib/localStorage";
import React, { use, useEffect } from "react";
import { createContext, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeProviderState>({
  theme: "system",
  setTheme: () => {},
});

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "editor-theme",
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    getItem(storageKey) ?? defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
      setItem(storageKey, systemTheme);
      return;
    }

    root.classList.add(theme);
    setItem(storageKey, theme);
  }, [storageKey, theme]);

  return <ThemeContext value={{ theme, setTheme }}>{children}</ThemeContext>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const context = use(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
