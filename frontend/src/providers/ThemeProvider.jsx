import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const ThemeContext =
  createContext(null);

export function ThemeProvider({
  children,
}) {

  const [theme, setTheme] =
    useState(() => {

      return (
        localStorage.getItem(
          "beatflow-theme"
        ) || "dark"
      );
    });

  useEffect(() => {

    document.documentElement.classList.remove(
      "dark",
      "light"
    );

    document.documentElement.classList.add(
      theme
    );

    localStorage.setItem(
      "beatflow-theme",
      theme
    );

  }, [theme]);

  const toggleTheme =
    () => {

      setTheme((prev) =>
        prev === "dark"
          ? "light"
          : "dark"
      );
    };

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
    }),
    [theme]
  );

  return (
    <ThemeContext.Provider
      value={value}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {

  const context =
    useContext(
      ThemeContext
    );

  if (!context) {

    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
}