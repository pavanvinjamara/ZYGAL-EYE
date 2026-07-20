import { defineStore } from "pinia";
import apiService from "@/services/api.service";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: null,
    initialized: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async login(payload) {
      const res = await apiService.login(payload);

      this.token = res.data.accessToken;
      this.user = res.data.user;

      localStorage.setItem("token", this.token);
      localStorage.setItem("user", JSON.stringify(this.user));

      this.initialized = true;

      return res;
    },

    async restoreSession() {
      if (this.initialized) return;

      this.token = localStorage.getItem("token");

      const user = localStorage.getItem("user");
      this.user = user ? JSON.parse(user) : null;

      this.initialized = true;
    },

    logout() {
      this.user = null;
      this.token = null;
      this.initialized = true;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});