// context/ThemeContext.js
import React, { createContext, useContext, useState } from "react";
import { useColorScheme } from "react-native";
import lightColors from "../theme/lightColors";
import darkColors from "../theme/darkColors";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme(); // modo del SO
  const [override, setOverride] = useState(null); // null = sigue al SO

  const isDark = override !== null ? override : systemScheme === "dark";
  const theme = isDark ? darkColors : lightColors;

  const toggleTheme = () => {
    // si volvés al valor del sistema, reseteás a null
    const next = !isDark;
    setOverride(next === (systemScheme === "dark") ? null : next);
  };


  // azul #023850

  return (
    <ThemeContext.Provider value={{ isDark, theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be inside ThemeProvider");
  return ctx;
}
