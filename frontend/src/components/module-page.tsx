import type { ReactNode } from "react";
import { Inbox, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: string | undefined;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
      <div className="max-w-2xl">
        <h1 className="font-display text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
      </div>
      {action && (
        <Button>
          <Plus className="size-4" />
          {action}
        </Button>
      )}
    </div>
  );
}

export function StatGrid({ stats }: { stats: string[] }) {
  if (!stats.length) return null;
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((label) => (
        <Card key={label} className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-3xl font-semibold text-muted-foreground/40">—</p>
            <p className="mt-1 text-xs text-muted-foreground">Awaiting data source</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function DataTableShell({
  columns,
  emptyTitle,
  emptyHint,
  toolbar = true,
}: {
  columns: string[];
  emptyTitle: string;
  emptyHint: string;
  toolbar?: boolean;
}) {
  return (
    <Card className="shadow-card overflow-hidden">
      {toolbar && (
        <CardHeader className="flex flex-wrap items-center gap-3 border-b border-border">
          <Input placeholder="Search records…" className="max-w-xs" />
          <span className="text-xs text-muted-foreground">0 records</span>
        </CardHeader>
      )}
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {columns.map((c) => (
                <TableHead key={c} className="text-xs tracking-wide uppercase">
                  {c}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={columns.length} className="py-16 text-center">
                <Inbox className="mx-auto size-8 text-muted-foreground/40" />
                <p className="mt-3 text-sm font-medium">{emptyTitle}</p>
                <p className="mx-auto mt-1 max-w-md text-xs text-muted-foreground">{emptyHint}</p>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function FeatureChecklist({ title, items }: { title: string; items: string[] }) {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {items.map((i) => (
          <span
            key={i}
            className="rounded-full border border-border bg-secondary px-3 py-1 text-xs text-secondary-foreground"
          >
            {i}
          </span>
        ))}
      </CardContent>
    </Card>
  );
}

export function ModulePage({
  title,
  description,
  action,
  stats = [],
  columns,
  emptyTitle = "No records yet",
  emptyHint = "Connect your backend and this table will populate automatically.",
  capabilities = [],
  children,
}: {
  title: string;
  description: string;
  action?: string | undefined;
  stats?: string[];
  columns: string[];
  emptyTitle?: string;
  emptyHint?: string;
  capabilities?: string[];
  children?: ReactNode;
}) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} action={action} />
      <StatGrid stats={stats} />
      {children}
      <DataTableShell columns={columns} emptyTitle={emptyTitle} emptyHint={emptyHint} />
      {capabilities.length > 0 && (
        <FeatureChecklist title="Module capabilities" items={capabilities} />
      )}
    </div>
  );
}
