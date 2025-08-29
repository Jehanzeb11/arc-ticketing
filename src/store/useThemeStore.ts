import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { PaletteMode } from "@mui/material";

interface ThemeState {
  themeMode: PaletteMode;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      themeMode: "light",
      toggleTheme: () =>
        set((state) => ({
          themeMode: state.themeMode === "light" ? "dark" : "light",
        })),
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
