import React, { createContext, useContext, useState } from "react";

export type ThemeMode = "dark" | "light";

export interface ThemeColors {
  mode: ThemeMode;
  background: string;
  card: string;
  cardSecondary: string;
  text: string;
  textSecondary: string;
  border: string;
  primary: string;
  accent: string;
}

const darkColors: ThemeColors = {
  mode: "dark",
  background: "#0B0F1A",
  card: "#141A29",
  cardSecondary: "#1E2638",
  text: "#FFFFFF",
  textSecondary: "#A0AEC0",
  border: "#242C42",
  primary: "#6C5CE7",
  accent: "#00CEC9",
};

const lightColors: ThemeColors = {
  mode: "light",
  background: "#F4F6F8",
  card: "#FFFFFF",
  cardSecondary: "#EDF2F7",
  text: "#1A202C",
  textSecondary: "#4A5568",
  border: "#E2E8F0",
  primary: "#6C5CE7",
  accent: "#0984E3",
};

interface ThemeContextType {
  mode: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: "dark",
  colors: darkColors,
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>("dark");

  const toggleTheme = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const colors = mode === "dark" ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ mode, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
