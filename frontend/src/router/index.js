import { createRouter, createWebHistory } from "vue-router";

import authRoutes from "./routes/auth.routes";
// import dashboardRoutes from "./routes/dashboard.routes";

import AuthLayout from "@/layouts/AuthLayout.vue";
// import DashboardLayout from "@/layouts/DashboardLayout.vue";

// import NotFoundView from "@/views/NotFoundView.vue";

import setupGuards from "./guards";

const router = createRouter({
  history: createWebHistory(),

  routes: [
    // {
    //   path: "/",
    //   component: DashboardLayout,
    //   meta: {
    //     requiresAuth: true,
    //   },
    //   children: [...dashboardRoutes],
    // },

    {
      path: "/",
      component: AuthLayout,
      meta: {
        guestOnly: true,
      },
      children: [...authRoutes],
    },

    // {
    //   path: "/:pathMatch(.*)*",
    //   name: "NotFound",
    //   component: NotFoundView,
    // },
  ],

  scrollBehavior() {
    return {
      top: 0,
    };
  },
});

setupGuards(router);

export default router;