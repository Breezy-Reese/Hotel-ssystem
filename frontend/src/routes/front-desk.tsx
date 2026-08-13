import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { format } from "date-fns";

import { ModulePage } from "@/components/module-page";
import { LiveDataTable, type LiveColumn } from "@/components/live-data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { invoicesApi, reservationsApi } from "@/lib/resources";
import type { Guest, Reservation, Room } from "@/lib/types";
import { ApiError } from "@/lib/api";

export const Route = createFileRoute("/front-desk")({
  head: () => ({
    meta: [
      { title: "Front Desk — Aurelia Suites" },
      { name: "description", content: "Today's arrivals, departures and guest folios." },
    ],
  }),
  component: FrontDeskPage,
});

function guestName(g: Reservation["guest"]) {
  return typeof g === "string" ? g : (g as Guest).name;
}
function roomNumber(r: Reservation["room"]) {
  return typeof r === "string" ? r : (r as Room).roomNumber;
}

function FrontDeskPage() {
  const { data, isLoading, isError } = reservationsApi.useList({ sort: "checkIn", limit: 100 });
  const { data: invoiceData } = invoicesApi.useList({ status: "Open", limit: 1 });

  const checkIn = reservationsApi.useAction<void, { status: string; data: Reservation }>(
    "patch",
    (id) => `/reservations/${id}/check-in`,
  );
  const checkOut = reservationsApi.useAction<void, { status: string; data: Reservation }>(
    "patch",
    (id) => `/reservations/${id}/check-out`,
  );

  const today = new Date().toDateString();
  const reservations = (data?.data ?? []).filter((r) => {
    const inToday = new Date(r.checkIn).toDateString() === today;
    const outToday = new Date(r.checkOut).toDateString() === today;
    return (
      (inToday && ["Pending", "Confirmed"].includes(r.status)) ||
      (outToday && r.status === "CheckedIn")
    );
  });

  const stats = {
    "Awaiting check-in": reservations.filter((r) => ["Pending", "Confirmed"].includes(r.status))
      .length,
    "Awaiting check-out": reservations.filter((r) => r.status === "CheckedIn").length,
    "Open folios": invoiceData?.total ?? "—",
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
    { header: "Guest", render: (r) => <span className="font-medium">{guestName(r.guest)}</span> },
    { header: "Room", render: (r) => roomNumber(r.room) },
    { header: "Arrival", render: (r) => format(new Date(r.checkIn), "MMM d") },
    { header: "Departure", render: (r) => format(new Date(r.checkOut), "MMM d") },
    { header: "Status", render: (r) => <Badge variant="secondary">{r.status}</Badge> },
  ];

  return (
    <ModulePage
      title="Front Desk"
      description="Today's arrivals, departures and guest folios."
      action="Walk-in booking"
      stats={["Awaiting check-in", "Awaiting check-out", "Rooms assigned", "Open folios"]}
      statValues={stats}
      columns={["Guest", "Room", "Arrival", "Departure", "Balance", "Action"]}
      capabilities={[
        "Today's arrivals & departures",
        "One-click check-in / check-out",
        "Open guest folios",
      ]}
      table={
        <LiveDataTable
          columns={columns}
          rows={reservations}
          isLoading={isLoading}
          isError={isError}
          recordCount={reservations.length}
          emptyTitle="Nothing due today"
          emptyHint="Today's arrivals and departures will show up here."
          rowActions={(r) => (
            <div className="flex justify-end gap-2">
              {["Pending", "Confirmed"].includes(r.status) && (
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
