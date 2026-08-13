import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { ModulePage } from "@/components/module-page";
import { LiveDataTable, type LiveColumn } from "@/components/live-data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { invoicesApi } from "@/lib/resources";
import type { Guest, Invoice, InvoiceStatus } from "@/lib/types";
import { ApiError } from "@/lib/api";

export const Route = createFileRoute("/invoices")({
  head: () => ({
    meta: [
      { title: "Billing & Invoicing — Aurelia Suites" },
      {
        name: "description",
        content:
          "Consolidated folios: room, restaurant, room service, extras, taxes and discounts.",
      },
    ],
  }),
  component: InvoicesPage,
});

const STATUS_VARIANT: Record<InvoiceStatus, "default" | "secondary" | "destructive" | "outline"> = {
  Open: "outline",
  Issued: "secondary",
  Paid: "default",
  Overdue: "destructive",
  Cancelled: "destructive",
};

function guestName(g: Invoice["guest"]) {
  return typeof g === "string" ? g : (g as Guest).name;
}

function invoiceTotal(inv: Invoice) {
  if (inv.total !== undefined) return inv.total;
  const subtotal = inv.charges.reduce((s, c) => s + c.amount, 0);
  return subtotal + (subtotal * inv.tax) / 100 - inv.discount;
}

function InvoicesPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = invoicesApi.useList({ search, sort: "-updatedAt" });
  const payInvoice = invoicesApi.useAction<{ method: string; amount: number }>(
    "post",
    (id) => `/invoices/${id}/pay`,
  );

  const invoices = data?.data ?? [];
  const stats = {
    "Open folios": invoices.filter((i) => i.status === "Open").length,
    Issued: invoices.filter((i) => i.status === "Issued").length,
    Paid: invoices.filter((i) => i.status === "Paid").length,
    Outstanding: invoices.filter((i) => i.status !== "Paid" && i.status !== "Cancelled").length,
  };

  async function markPaid(inv: Invoice) {
    try {
      await payInvoice.mutateAsync({
        id: inv._id,
        payload: { method: "Cash", amount: invoiceTotal(inv) },
      });
      toast.success("Invoice marked paid");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Payment failed");
    }
  }

  const columns: LiveColumn<Invoice>[] = [
    { header: "Invoice #", render: (i) => <span className="font-medium">{i.invoiceNumber}</span> },
    { header: "Guest", render: (i) => guestName(i.guest) },
    { header: "Tax", render: (i) => `${i.tax}%` },
    { header: "Discount", render: (i) => `$${i.discount.toFixed(2)}` },
    { header: "Total", render: (i) => `$${invoiceTotal(i).toFixed(2)}` },
    {
      header: "Status",
      render: (i) => <Badge variant={STATUS_VARIANT[i.status]}>{i.status}</Badge>,
    },
  ];

  return (
    <ModulePage
      title="Billing & Invoicing"
      description="Consolidated folios: room, restaurant, room service, extras, taxes and discounts."
      stats={["Open folios", "Issued", "Paid", "Outstanding"]}
      statValues={stats}
      columns={columns.map((c) => c.header)}
      capabilities={[
        "Room charges",
        "Restaurant charges",
        "Room service",
        "Additional services",
        "Taxes",
        "Discounts",
        "Download / print",
      ]}
      table={
        <LiveDataTable
          columns={columns}
          rows={invoices}
          isLoading={isLoading}
          isError={isError}
          search={search}
          onSearchChange={setSearch}
          recordCount={data?.total}
          emptyTitle="No invoices yet"
          emptyHint="Invoices created via the API will show up here."
          rowActions={(i) =>
            i.status !== "Paid" && i.status !== "Cancelled" ? (
              <Button size="sm" variant="outline" onClick={() => markPaid(i)}>
                Mark paid
              </Button>
            ) : null
          }
        />
      }
    />
  );
}
