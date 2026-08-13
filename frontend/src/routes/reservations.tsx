import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";

import { ModulePage } from "@/components/module-page";
import { LiveDataTable, type LiveColumn } from "@/components/live-data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { reservationsApi } from "@/lib/resources";
import type { Guest, Reservation, ReservationStatus, Room } from "@/lib/types";
import { ApiError } from "@/lib/api";

export const Route = createFileRoute("/reservations")({
  head: () => ({
    meta: [
      { title: "Reservations & Booking — Aurelia Suites" },
      {
        name: "description",
        content:
          "Book, confirm, check guests in and out, and manage cancellations across all branches.",
      },
    ],
  }),
  component: ReservationsPage,
});

const STATUS_VARIANT: Record<
  ReservationStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  Pending: "outline",
  Confirmed: "secondary",
  CheckedIn: "default",
  CheckedOut: "secondary",
  Cancelled: "destructive",
  NoShow: "destructive",
};

function guestName(g: Reservation["guest"]) {
  return typeof g === "string" ? g : (g as Guest).name;
}
function roomNumber(r: Reservation["room"]) {
  return typeof r === "string" ? r : (r as Room).roomNumber;
}

function ReservationsPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = reservationsApi.useList({ search, sort: "-checkIn" });
  const checkIn = reservationsApi.useAction<void, { status: string; data: Reservation }>(
    "patch",
    (id) => `/reservations/${id}/check-in`,
  );
  const checkOut = reservationsApi.useAction<void, { status: string; data: Reservation }>(
    "patch",
    (id) => `/reservations/${id}/check-out`,
  );

  const reservations = data?.data ?? [];

  const stats = {
    "Total reservations": data?.total ?? "—",
    "Checked in": reservations.filter((r) => r.status === "CheckedIn").length,
    Pending: reservations.filter((r) => r.status === "Pending").length,
    Cancelled: reservations.filter((r) => r.status === "Cancelled").length,
  };

  async function handleCheckIn(id: string) {
    try {
      await checkIn.mutateAsync({ id });
      toast.success("Guest checked in");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Check-in failed");
    }
  }

  async function handleCheckOut(id: string) {
    try {
      await checkOut.mutateAsync({ id });
      toast.success("Guest checked out");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Check-out failed");
    }
  }

  const columns: LiveColumn<Reservation>[] = [
    { header: "Ref", render: (r) => <span className="font-medium">{r.ref}</span> },
    { header: "Guest", render: (r) => guestName(r.guest) },
    { header: "Room", render: (r) => roomNumber(r.room) },
    { header: "Check-in", render: (r) => format(new Date(r.checkIn), "MMM d, yyyy") },
    { header: "Check-out", render: (r) => format(new Date(r.checkOut), "MMM d, yyyy") },
    {
      header: "Status",
      render: (r) => <Badge variant={STATUS_VARIANT[r.status]}>{r.status}</Badge>,
    },
  ];

  return (
    <ModulePage
      title="Reservations & Booking"
      description="Book, confirm, check guests in and out, and manage cancellations across all branches."
      stats={["Total reservations", "Checked in", "Pending", "Cancelled"]}
      statValues={stats}
      columns={columns.map((c) => c.header)}
      capabilities={[
        "Availability check",
        "Walk-in & online bookings",
        "Check-in / check-out",
        "Cancellations",
      ]}
      table={
        <LiveDataTable
          columns={columns}
          rows={reservations}
          isLoading={isLoading}
          isError={isError}
          search={search}
          onSearchChange={setSearch}
          recordCount={data?.total}
          emptyTitle="No reservations yet"
          emptyHint="Bookings created via the API will show up here."
          rowActions={(r) => (
            <div className="flex justify-end gap-2">
              {(r.status === "Confirmed" || r.status === "Pending") && (
                <Button size="sm" variant="outline" onClick={() => handleCheckIn(r._id)}>
                  Check in
                </Button>
              )}
              {r.status === "CheckedIn" && (
                <Button size="sm" variant="outline" onClick={() => handleCheckOut(r._id)}>
                  Check out
                </Button>
              )}
            </div>
          )}
        />
      }
    />
  );
}
