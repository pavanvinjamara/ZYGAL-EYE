import { createRouter, createWebHistory } from "vue-router";

import authRoutes from "./routes/auth.routes";
import vendorRoutes from "./routes/vendor.routes";
import adminRoutes from "./routes/admin.routes";

import AuthLayout from "@/layouts/AuthLayout.vue";
import VendorLayout from "@/layouts/vendor/VendorLayout.vue";
import AdminLayout from "@/layouts/admin/AdminLayout.vue";

import NotFoundView from "@/views/NotFoundView.vue";
import setupGuards from "./guards";

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: "/",
      component: AuthLayout,
      meta: { guestOnly: true },
      children: [...authRoutes],
    },

    {
      path: "/vendor",
      component: VendorLayout,
      meta: { requiresAuth: true, allow: ["vendor"] },
      children: vendorRoutes,
    },

    {
      path: "/admin",
      component: AdminLayout,
      meta: { requiresAuth: true, allow: ["admin"] },
      children: adminRoutes,
    },

    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: NotFoundView,
      meta: { title: "Page Not Found" },
    },
  ],

  scrollBehavior() {
    return { top: 0 };
  },
});

setupGuards(router);
export default router;