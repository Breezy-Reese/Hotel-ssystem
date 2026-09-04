import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { ModulePage } from "@/components/module-page";
import { LiveDataTable, type LiveColumn } from "@/components/live-data-table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { branchesApi, roomsApi } from "@/lib/resources";
import type { Room, RoomStatus, RoomType } from "@/lib/types";
import { ApiError } from "@/lib/api";
import { formatCurrency } from "../lib/currency";

export const Route = createFileRoute("/rooms")({
  head: () => ({
    meta: [
      { title: "Room Management — Aurelia Suites" },
      {
        name: "description",
        content:
          "Create and maintain room inventory: types, pricing, capacity, amenities and live status.",
      },
      { property: "og:title", content: "Room Management — Aurelia Suites" },
      {
        property: "og:description",
        content:
          "Create and maintain room inventory: types, pricing, capacity, amenities and live status.",
      },
    ],
  }),
  component: RoomsPage,
});

const STATUS_VARIANT: Record<RoomStatus, "default" | "secondary" | "destructive" | "outline"> = {
  Available: "default",
  Reserved: "secondary",
  Occupied: "outline",
  Cleaning: "secondary",
  Maintenance: "destructive",
};

const columns: LiveColumn<Room>[] = [
  { header: "Room #", render: (r) => <span className="font-medium">{r.roomNumber}</span> },
  { header: "Type", render: (r) => r.type },
  { header: "Capacity", render: (r) => r.capacity },
  { header: "Rate / night", render: (r) => formatCurrency(r.rate) },
  { header: "Amenities", render: (r) => r.amenities?.join(", ") || "—" },
  {
    header: "Status",
    render: (r) => <Badge variant={STATUS_VARIANT[r.status]}>{r.status}</Badge>,
  },
];

function RoomsPage() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data, isLoading, isError } = roomsApi.useList({ search, sort: "roomNumber" });
  const { data: branchesData } = branchesApi.useList({ limit: 100 });
  const createRoom = roomsApi.useCreate();

  const rooms = data?.data ?? [];
  const branches = branchesData?.data ?? [];

  const stats = {
    "Total rooms": data?.total ?? "—",
    Available: rooms.filter((r) => r.status === "Available").length,
    Occupied: rooms.filter((r) => r.status === "Occupied").length,
    "Out of service": rooms.filter((r) => r.status === "Maintenance").length,
  };

  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      roomNumber: String(form.get("roomNumber")),
      branch: String(form.get("branch")),
      type: String(form.get("type")) as RoomType,
      capacity: Number(form.get("capacity")),
      rate: Number(form.get("rate")),
      amenities: String(form.get("amenities") || "")
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
    };

    try {
      await createRoom.mutateAsync(payload);
      toast.success("Room added");
      setDialogOpen(false);
      e.currentTarget.reset();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to add room");
    }
  }

  return (
    <>
      <ModulePage
        title="Room Management"
        description="Create and maintain room inventory: types, pricing, capacity, amenities and live status."
        action="Add room"
        onAction={() => setDialogOpen(true)}
        stats={["Total rooms", "Available", "Occupied", "Out of service"]}
        statValues={stats}
        columns={columns.map((c) => c.header)}
        capabilities={[
          "Single",
          "Double",
          "Deluxe",
          "Executive",
          "Suite",
          "Room images",
          "Amenities",
          "Available",
          "Reserved",
          "Occupied",
          "Cleaning",
          "Maintenance",
        ]}
        table={
          <LiveDataTable
            columns={columns}
            rows={rooms}
            isLoading={isLoading}
            isError={isError}
            search={search}
            onSearchChange={setSearch}
            recordCount={data?.total}
            emptyTitle="No rooms yet"
            emptyHint="Add your first room to get started."
          />
        }
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add room</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="roomNumber">Room number</Label>
                <Input id="roomNumber" name="roomNumber" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="branch">Branch</Label>
                <Select name="branch" required>
                  <SelectTrigger id="branch">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((b) => (
                      <SelectItem key={b._id} value={b._id}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="type">Type</Label>
                <Select name="type" required defaultValue="Single">
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Single", "Double", "Deluxe", "Executive", "Suite"].map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min={1}
                  defaultValue={2}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="rate">Rate / night (KSh)</Label>
                <Input id="rate" name="rate" type="number" min={0} step="0.01" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="amenities">Amenities</Label>
                <Input id="amenities" name="amenities" placeholder="WiFi, TV, Minibar" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={createRoom.isPending}>
                {createRoom.isPending ? "Adding…" : "Add room"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
