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
import { guestsApi } from "@/lib/resources";
import type { Guest } from "@/lib/types";
import { ApiError } from "@/lib/api";

export const Route = createFileRoute("/guests")({
  head: () => ({
    meta: [
      { title: "Guest Management — Aurelia Suites" },
      {
        name: "description",
        content: "Guest profiles, contact details, stay history, preferences and special requests.",
      },
    ],
  }),
  component: GuestsPage,
});

const columns: LiveColumn<Guest>[] = [
  { header: "Guest", render: (g) => <span className="font-medium">{g.name}</span> },
  { header: "Phone", render: (g) => g.phone || "—" },
  { header: "Email", render: (g) => g.email || "—" },
  { header: "Stays", render: (g) => g.stays },
  { header: "VIP", render: (g) => (g.vip ? <Badge>VIP</Badge> : "—") },
];

function GuestsPage() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data, isLoading, isError } = guestsApi.useList({ search, sort: "name" });
  const createGuest = guestsApi.useCreate();

  const guests = data?.data ?? [];
  const stats = {
    "Total guests": data?.total ?? "—",
    "Returning guests": guests.filter((g) => g.stays > 1).length,
    "VIP guests": guests.filter((g) => g.vip).length,
  };

  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name")),
      phone: String(form.get("phone") || ""),
      email: String(form.get("email") || ""),
    };
    try {
      await createGuest.mutateAsync(payload);
      toast.success("Guest added");
      setDialogOpen(false);
      e.currentTarget.reset();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to add guest");
    }
  }

  return (
    <>
      <ModulePage
        title="Guest Management"
        description="Guest profiles, contact details, stay history, preferences and special requests."
        action="Add guest"
        onAction={() => setDialogOpen(true)}
        stats={["Total guests", "Returning guests", "VIP guests"]}
        statValues={stats}
        columns={columns.map((c) => c.header)}
        capabilities={[
          "Guest profiles",
          "Contact information",
          "Booking history",
          "Preferences",
          "Special requests",
          "Feedback",
        ]}
        table={
          <LiveDataTable
            columns={columns}
            rows={guests}
            isLoading={isLoading}
            isError={isError}
            search={search}
            onSearchChange={setSearch}
            recordCount={data?.total}
            emptyTitle="No guests yet"
            emptyHint="Add your first guest to get started."
          />
        }
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add guest</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={createGuest.isPending}>
                {createGuest.isPending ? "Adding…" : "Add guest"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
