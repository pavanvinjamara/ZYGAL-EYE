// stores/auth.store.js
import { defineStore } from "pinia";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import apiService from "@/services/api.service";

const TOKEN_KEY = "token";
const USER_KEY = "user";

const cookieOptions = {
  expires: 7,
  sameSite: "strict",
  secure: window.location.protocol === "https:",
};

function isTokenExpired(token) {
  if (!token) return true;

  try {
    const { exp } = jwtDecode(token);
    if (!exp) return false; // no exp claim, assume valid
    return Date.now() >= exp * 1000;
  } catch {
    return true; // malformed token, treat as invalid
  }
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: null,
    initialized: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !isTokenExpired(state.token),
  },

  actions: {
    async login(payload) {
      const res = await apiService.login(payload);

      this.token = res.data.accessToken;
      this.user = res.data.user;

      Cookies.set(TOKEN_KEY, this.token, cookieOptions);
      Cookies.set(USER_KEY, JSON.stringify(this.user), cookieOptions);

      this.initialized = true;
      // in auth.store.js login()
      localStorage.setItem("hadSession", "true");
      return res;
    },

    async restoreSession() {
      if (this.initialized) return;

      const token = Cookies.get(TOKEN_KEY) || null;
      const user = Cookies.get(USER_KEY);

      if (token && isTokenExpired(token)) {
        // stale cookie left over — clear it out
        Cookies.remove(TOKEN_KEY);
        Cookies.remove(USER_KEY);
        this.token = null;
        this.user = null;
        localStorage.removeItem("hadSession");
      } else {
        this.token = token;
        this.user = user ? JSON.parse(user) : null;
      }

      this.initialized = true;
    },

    logout() {
      localStorage.removeItem("hadSession");
      this.user = null;
      this.token = null;
      this.initialized = true;

      Cookies.remove(TOKEN_KEY);
      Cookies.remove(USER_KEY);
    },
  },
});