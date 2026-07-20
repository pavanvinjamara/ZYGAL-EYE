import { defineStore } from "pinia";
import { initTheme } from "../utils/theme.util.js";

export const useAppStore = defineStore("app", {
    state: () => ({
        theme: initTheme(), // 'light' | 'dark', applied to <html> on load
    }),

    getters: {
        isDark: (state) => state.theme === "dark",
    },

    actions: {
        setTheme(theme) {
            this.theme = theme;
        },
    },
});