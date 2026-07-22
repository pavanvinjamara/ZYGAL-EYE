import { useAuthStore } from "@/stores/auth.store";
import { showToast } from "@/composables/toast.composable";

function loginRouteFor(path) {
  return path.startsWith("/admin") ? "AdminLogin" : "VendorLogin";
}

function dashboardRouteFor(portal) {
  return portal === "admin" ? "AdminDashboard" : "VendorDashboard";
}

export default function setupGuards(router) {
  router.beforeEach(async (to) => {
    const auth = useAuthStore();

    if (!auth.initialized) {
      await auth.restoreSession();
    }

    // Not logged in, hitting a protected route
    if (to.meta.requiresAuth && !auth.isAuthenticated) {
      const hadSession = !!localStorage.getItem("hadSession");

      showToast({
        type: "warning",
        message: hadSession ? "Session expired. Please log in again." : "Please log in to continue.",
      });

      return { name: loginRouteFor(to.path) };
    }

    // Logged in, hitting a login page
    if (to.meta.guestOnly && auth.isAuthenticated) {
      return { name: dashboardRouteFor(auth.portal) };
    }

    // Logged in, but wrong portal for this branch (vendor hitting /admin/* etc.)
    if (to.meta.allow && !to.meta.allow.includes(auth.portal)) {
      return { name: dashboardRouteFor(auth.portal) };
    }

    return true;
  });
}