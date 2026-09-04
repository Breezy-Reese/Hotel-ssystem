import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { format } from "date-fns";

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
import { menuItemsApi } from "@/lib/resources";
import type { MenuItem } from "@/lib/types";
import { ApiError } from "@/lib/api";
import { formatCurrency } from "../lib/currency";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu Management — Aurelia Suites" },
      {
        name: "description",
        content:
          "Food and drink catalogue with categories, pricing, images, availability and offers.",
      },
    ],
  }),
  component: MenuPage,
});

const columns: LiveColumn<MenuItem>[] = [
  { header: "Item", render: (m) => <span className="font-medium">{m.name}</span> },
  { header: "Category", render: (m) => m.category },
  { header: "Price", render: (m) => formatCurrency(m.price) },
  {
    header: "Availability",
    render: (m) => (
      <Badge variant={m.availability ? "default" : "destructive"}>
        {m.availability ? "Available" : "Unavailable"}
      </Badge>
    ),
  },
  { header: "Updated", render: (m) => format(new Date(m.updatedAt), "MMM d, yyyy") },
];

function MenuPage() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data, isLoading, isError } = menuItemsApi.useList({ search, sort: "category" });
  const createItem = menuItemsApi.useCreate();

  const items = data?.data ?? [];
  const stats = {
    "Menu items": data?.total ?? "—",
    Categories: new Set(items.map((i) => i.category)).size,
    Unavailable: items.filter((i) => !i.availability).length,
  };

  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name")),
      category: String(form.get("category")),
      price: Number(form.get("price")),
      description: String(form.get("description") || ""),
    };
    try {
      await createItem.mutateAsync(payload);
      toast.success("Menu item added");
      setDialogOpen(false);
      e.currentTarget.reset();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to add item");
    }
  }

  return (
    <>
      <ModulePage
        title="Menu Management"
        description="Food and drink catalogue with categories, pricing, images, availability and offers."
        action="Add item"
        onAction={() => setDialogOpen(true)}
        stats={["Menu items", "Categories", "Unavailable"]}
        statValues={stats}
        columns={columns.map((c) => c.header)}
        capabilities={["Categories", "Prices", "Food images", "Availability", "Special offers"]}
        table={
          <LiveDataTable
            columns={columns}
            rows={items}
            isLoading={isLoading}
            isError={isError}
            search={search}
            onSearchChange={setSearch}
            recordCount={data?.total}
            emptyTitle="No menu items yet"
            emptyHint="Add your first dish or drink to get started."
          />
        }
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add menu item</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="category">Category</Label>
                <Input id="category" name="category" placeholder="Starters" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="price">Price (KSh)</Label>
                <Input id="price" name="price" type="number" min={0} step="0.01" required />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={createItem.isPending}>
                {createItem.isPending ? "Adding…" : "Add item"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
