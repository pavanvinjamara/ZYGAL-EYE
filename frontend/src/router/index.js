import { createRouter, createWebHistory } from "vue-router";

import authRoutes from "./routes/auth.routes";
import dashboardRoutes from "./routes/mainlayout.routes";

import AuthLayout from "@/layouts/AuthLayout.vue";
import MainLayout from "@/layouts/MainLayout.vue";

import NotFoundView from "@/views/NotFoundView.vue";



import setupGuards from "./guards";

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: "/",
      component: AuthLayout,
      meta: {
        guestOnly: true,
      },
      children: [...authRoutes],
    },

    {
      path: "/",
      component: MainLayout,
      meta: {
        requiresAuth: true,
      },
      children: dashboardRoutes,
    },

    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: NotFoundView,
      meta: {
        title: "Page Not Found",
      },
    },
  ],

  scrollBehavior() {
    return {
      top: 0,
    };
  },
});

setupGuards(router);

export default router;