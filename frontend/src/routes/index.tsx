import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Login — Aurelia Suites",
      },
      {
        name: "description",
        content:
          "Sign in to your Aurelia Suites account to access hotel rooms, restaurant services, bookings, and orders.",
      },
    ],
  }),

  beforeLoad: () => {
    throw redirect({
      to: "/customer/login",
      replace: true,
    });
  },
});
