export default [
  {
    path: "vendor/login",
    name: "VendorLogin",
    component: () => import("@/views/vendor/auth/VendorLoginView.vue"),
    meta: {
      title: "Login",
      guestOnly: true,
    },
  },
  {
    path: "admin/login",
    name: "Login",
    component: () => import("@/views/admin/auth/AdminLoginView.vue"),
    meta: {
      title: "AdminLogin",
      guestOnly: true,
    },
  }

  // {
  //   path: "forgot-password",
  //   name: "ForgotPassword",
  //   component: () => import("@/views/auth/ForgotPasswordView.vue"),
  //   meta: {
  //     title: "Forgot Password",
  //     guestOnly: true,
  //   },
  // },

  // {
  //   path: "reset-password/:token",
  //   name: "ResetPassword",
  //   component: () => import("@/views/auth/ResetPasswordView.vue"),
  //   meta: {
  //     title: "Reset Password",
  //     guestOnly: true,
  //   },
  // },
];