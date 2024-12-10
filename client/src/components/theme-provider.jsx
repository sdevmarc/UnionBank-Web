import { createContext, useContext, useEffect, useState } from "react";

// Define the possible themes
const Theme = {
  DARK: "dark",
  LIGHT: "light",
  SYSTEM: "system"
};

// Define the initial state of the theme provider
const initialState = {
  theme: Theme.SYSTEM,
  setTheme: () => null
};

// Create the context for the theme provider
const ThemeProviderContext = createContext(initialState);

// Define the ThemeProvider component
export function ThemeProvider({
  children,
  defaultTheme = Theme.SYSTEM,
  storageKey = "vite-ui-theme",
  ...props
}) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(storageKey) || defaultTheme;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(Theme.LIGHT, Theme.DARK);

    if (theme === Theme.SYSTEM) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? Theme.DARK
        : Theme.LIGHT;
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme) => {
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
    }
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
