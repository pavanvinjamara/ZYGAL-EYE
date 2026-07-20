import { useAuthStore } from "@/stores/auth.store";

export default function setupGuards(router) {
  router.beforeEach(async (to) => {
    const auth = useAuthStore();

    // Restore session only once
    if (!auth.initialized) {
      await auth.restoreSession();
    }

    // Protected pages
    if (to.meta.requiresAuth && !auth.isAuthenticated) {
      return {
        name: "Login",
        query: {
          redirect: to.fullPath,
        },
      };
    }

    // Guest pages
    if (to.meta.guestOnly && auth.isAuthenticated) {
      return {
        name: "Dashboard",
      };
    }

    return true;
  });
}