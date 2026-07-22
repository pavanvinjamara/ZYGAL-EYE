export default [
  {
    path: "",
    name: "Dashboard",
    component: () => import("@/views/vendor/dashboard/DashboardView.vue"),
    meta: {
      title: "Dashboard",
    },
  },

//   {
//     path: "tickets",
//     name: "Tickets",
//     component: () => import("@/views/tickets/TicketsView.vue"),
//     meta: {
//       title: "Tickets",
//     },
//   },

//   {
//     path: "tickets/:id",
//     name: "TicketDetail",
//     component: () => import("@/views/tickets/TicketDetailView.vue"),
//     meta: {
//       title: "Ticket Details",
//     },
//   },

//   {
//     path: "profile",
//     name: "Profile",
//     component: () => import("@/views/profile/ProfileView.vue"),
//     meta: {
//       title: "Profile",
//     },
//   },
];