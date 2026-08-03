import { createFileRoute } from "@tanstack/react-router";

import { ModulePage } from "@/components/module-page";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Reviews & Feedback — Aurelia Suites" },
      { name: "description", content: "Guest ratings and comments for rooms, meals and services." },
      { property: "og:title", content: "Reviews & Feedback — Aurelia Suites" },
      { property: "og:description", content: "Guest ratings and comments for rooms, meals and services." },
    ],
  }),
  component: ReviewsPage,
});

function ReviewsPage() {
  return (
    <ModulePage
      title="Reviews & Feedback"
      description="Guest ratings and comments for rooms, meals and services."
      
      stats={["Average rating", "Room reviews", "Meal reviews", "Unread"]}
      columns={["Guest", "Target", "Rating", "Comment", "Date", "Reviewed"]}
      capabilities={["Rate rooms", "Rate meals", "Comments", "Admin review"]}
    />
  );
}
