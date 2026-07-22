// router/guards.js
import { useAuthStore } from "@/stores/auth.store";
import { showToast } from "@/composables/toast.composable";

export default function setupGuards(router) {
  router.beforeEach(async (to) => {
    const auth = useAuthStore();
   

    if (!auth.initialized) {
      await auth.restoreSession();
    }

    if ((to.meta.requiresAuth && !auth.isAuthenticated) || (to.meta.guestOnly && to.fullPath == '/' && !auth.isAuthenticated)) {
     const hadToken = !localStorage.getItem("hadSession"); // see note below
      
      showToast({
        type: "warning",
        message: hadToken ? "Session expired. Please log in again." : "Please log in to continue.",
      });

      router.replace({
        name: "VendorLogin",
      });

    }

    if (to.meta.guestOnly && auth.isAuthenticated) {
      router.replace({
        name: "Dashboard",
      });

    }

    return true;
  });
}