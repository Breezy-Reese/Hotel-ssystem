import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { format } from "date-fns";
import { Star } from "lucide-react";

import { ModulePage } from "@/components/module-page";
import { LiveDataTable, type LiveColumn } from "@/components/live-data-table";
import { Badge } from "@/components/ui/badge";
import { reviewsApi } from "@/lib/resources";
import type { Guest, Review } from "@/lib/types";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Reviews & Feedback — Aurelia Suites" },
      {
        name: "description",
        content: "Collect and act on guest feedback for rooms, meals and services.",
      },
    ],
  }),
  component: ReviewsPage,
});

function guestName(g: Review["guest"]) {
  return typeof g === "string" ? g : ((g as Guest)?.name ?? "—");
}

const columns: LiveColumn<Review>[] = [
  { header: "Guest", render: (r) => guestName(r.guest) },
  { header: "Target", render: (r) => r.targetType },
  {
    header: "Rating",
    render: (r) => (
      <span className="inline-flex items-center gap-1">
        <Star className="size-3.5 fill-accent text-accent" /> {r.rating}/5
      </span>
    ),
  },
  { header: "Comment", render: (r) => r.comment || "—" },
  { header: "Date", render: (r) => format(new Date(r.date), "MMM d, yyyy") },
  {
    header: "Reviewed",
    render: (r) => (
      <Badge variant={r.reviewed ? "default" : "outline"}>{r.reviewed ? "Yes" : "No"}</Badge>
    ),
  },
];

function ReviewsPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = reviewsApi.useList({ search, sort: "-date" });
  const reviews = data?.data ?? [];

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : "—";

  const stats = {
    "Average rating": avgRating,
    "Room reviews": reviews.filter((r) => r.targetType === "Room").length,
    "Meal reviews": reviews.filter((r) => r.targetType === "Meal").length,
    Unread: reviews.filter((r) => !r.reviewed).length,
  };

  return (
    <ModulePage
      title="Reviews & Feedback"
      description="Collect and act on guest feedback for rooms, meals and services."
      stats={["Average rating", "Room reviews", "Meal reviews", "Unread"]}
      statValues={stats}
      columns={columns.map((c) => c.header)}
      capabilities={["Rate rooms", "Rate meals", "Comments", "Admin review"]}
      table={
        <LiveDataTable
          columns={columns}
          rows={reviews}
          isLoading={isLoading}
          isError={isError}
          search={search}
          onSearchChange={setSearch}
          recordCount={data?.total}
          emptyTitle="No reviews yet"
          emptyHint="Guest reviews submitted via the API will show up here."
        />
      }
    />
  );
}
