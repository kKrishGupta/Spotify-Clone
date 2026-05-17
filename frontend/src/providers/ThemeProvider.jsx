import { useEffect, useState } from "react";

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => localStorage.getItem("beatflow-theme") || "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark");
    localStorage.setItem("beatflow-theme", mode);
  }, [mode]);

  useEffect(() => {
    window.beatflowTheme = { mode, setMode };
  }, [mode]);

  return children;
}
