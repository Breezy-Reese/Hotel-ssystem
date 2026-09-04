import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { ModulePage } from "@/components/module-page";
import { LiveDataTable, type LiveColumn } from "@/components/live-data-table";
import { api } from "@/lib/api";
import { useDashboardStats } from "@/lib/reports";
import { formatCurrency } from "../lib/currency";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Revenue & Financial Reports — Aurelia Suites" },
      {
        name: "description",
        content: "Hotel and restaurant revenue, expenses and profit by period.",
      },
    ],
  }),
  component: ReportsPage,
});

interface RevenueRow {
  period: string;
  hotelRevenue: number;
  restaurantRevenue: number;
  expenses: number;
  profit: number;
}

function useRevenueReport() {
  return useQuery({
    queryKey: ["reports", "revenue"],
    queryFn: () =>
      api.get<{ status: string; data: { rows: RevenueRow[]; totals: RevenueRow } }>(
        "/reports/revenue?groupBy=day",
      ),
  });
}

const columns: LiveColumn<RevenueRow & { _id: string }>[] = [
  { header: "Period", render: (r) => <span className="font-medium">{r.period}</span> },
  { header: "Hotel revenue", render: (r) => formatCurrency(r.hotelRevenue) },
  { header: "Restaurant revenue", render: (r) => formatCurrency(r.restaurantRevenue) },
  { header: "Expenses", render: (r) => formatCurrency(r.expenses) },
  { header: "Profit", render: (r) => formatCurrency(r.profit) },
];

function ReportsPage() {
  const { data: statsRes, isLoading: statsLoading } = useDashboardStats();
  const { data: revenueRes, isLoading: revenueLoading, isError } = useRevenueReport();

  const rows = (revenueRes?.data.rows ?? []).map((r) => ({ ...r, _id: r.period }));
  const stats = statsRes?.data;
  const totals = revenueRes?.data.totals;

  const statValues = {
    "Revenue today": stats ? formatCurrency(stats.billing.revenueToday) : "—",
    "Hotel revenue": totals ? formatCurrency(totals.hotelRevenue) : "—",
    "Restaurant revenue": totals ? formatCurrency(totals.restaurantRevenue) : "—",
    "Estimated profit": totals ? formatCurrency(totals.profit) : "—",
  };

  return (
    <ModulePage
      title="Revenue & Financial Reports"
      description="Hotel and restaurant revenue, expenses and profit by period."
      action="Export"
      stats={["Revenue today", "Hotel revenue", "Restaurant revenue", "Estimated profit"]}
      statValues={statsLoading ? undefined : statValues}
      columns={columns.map((c) => c.header)}
      capabilities={[
        "Daily & monthly breakdown",
        "Hotel vs restaurant split",
        "Expense tracking",
        "Profit estimate",
      ]}
      table={
        <LiveDataTable
          columns={columns}
          rows={rows}
          isLoading={revenueLoading}
          isError={isError}
          recordCount={rows.length}
          emptyTitle="No revenue recorded yet"
          emptyHint="Paid invoices and POS sales will populate this report."
        />
      }
    />
  );
}
