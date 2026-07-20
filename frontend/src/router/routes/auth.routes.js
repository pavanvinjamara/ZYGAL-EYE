export default [
  {
    path: "/login",
    name: "Login",

    component: () =>
      import("@/views/auth/LoginView.vue"),

    meta: {
      title: "Login",
      guestOnly: true,
    },
  }

//   {
//     path: "/forgot-password",
//     name: "ForgotPassword",

//     component: () =>
//       import("@/views/auth/ForgotPasswordView.vue"),

//     meta: {
//       title: "Forgot Password",
//       guestOnly: true,
//     },
//   },
];