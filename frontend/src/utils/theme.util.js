import { buildWaveKeyframes } from "./waveTransition.util.js";

const STORAGE_KEY = "iifl-eye-theme";

export function getStoredTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
}

export function applyThemeClass(theme) {
    document.documentElement.classList.toggle("dark", theme === "dark");
}

export function initTheme() {
    const theme = getStoredTheme();
    applyThemeClass(theme);
    return theme;
}

export function toggleThemeWithWave(currentTheme, event) {

    const nextTheme = currentTheme === "dark" ? "light" : "dark";

    const applyChange = () => {
        applyThemeClass(nextTheme);
        localStorage.setItem(STORAGE_KEY, nextTheme);
    };

    const x = event?.clientX ?? window.innerWidth / 2;
    const y = event?.clientY ?? window.innerHeight / 2;

    const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
    ) + 40; // pad past the wobble amplitude so edges never clip visible content

    if (!document.startViewTransition) {

        document.documentElement.classList.add("theme-fade-fallback");
        applyChange();

        setTimeout(() => {
            document.documentElement.classList.remove("theme-fade-fallback");
        }, 350);

        return nextTheme;
    }

    const transition = document.startViewTransition(() => {
        applyChange();
    });

    transition.ready.then(() => {

        const keyframes = buildWaveKeyframes(x, y, endRadius, 48, {
            waveCount: 7,
            waveCount2: 13,
            rotationSpeed: 1.4,
            rotationSpeed2: -2.1,
            maxAmplitude: 26
        });

        document.documentElement.animate(
            keyframes,
            {
                duration: 850,
                easing: "linear",
                pseudoElement: "::view-transition-new(root)"
            }
        );

    });

    return nextTheme;
}