import { type ReactNode, useState } from "react";
import { Inbox, Loader2 } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface LiveColumn<T> {
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

export function LiveDataTable<T extends { _id?: string; id?: string }>({
  columns,
  rows,
  isLoading,
  isError,
  emptyTitle = "No records yet",
  emptyHint = "Records will appear here once created.",
  search,
  onSearchChange,
  recordCount,
  rowActions,
}: {
  columns: LiveColumn<T>[];
  rows: T[];
  isLoading?: boolean | undefined;
  isError?: boolean | undefined;
  emptyTitle?: string | undefined;
  emptyHint?: string | undefined;
  search?: string | undefined;
  onSearchChange?: ((value: string) => void) | undefined;
  recordCount?: number | undefined;
  rowActions?: ((row: T) => ReactNode) | undefined;
}) {
  const [localSearch, setLocalSearch] = useState("");
  const searchValue = search ?? localSearch;
  const setSearchValue = onSearchChange ?? setLocalSearch;

  const totalColumns = columns.length + (rowActions ? 1 : 0);

  return (
    <Card className="shadow-card overflow-hidden">
      <CardHeader className="flex flex-wrap items-center gap-3 border-b border-border">
        <Input
          placeholder="Search records…"
          className="max-w-xs"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <span className="text-xs text-muted-foreground">
          {recordCount ?? rows.length} record{(recordCount ?? rows.length) === 1 ? "" : "s"}
        </span>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              {columns.map((c) => (
                <TableHead
                  key={c.header}
                  className={c.className ?? "text-xs tracking-wide uppercase"}
                >
                  {c.header}
                </TableHead>
              ))}
              {rowActions && <TableHead className="text-xs tracking-wide uppercase" />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={totalColumns} className="py-16 text-center">
                  <Loader2 className="mx-auto size-6 animate-spin text-muted-foreground" />
                  <p className="mt-3 text-sm text-muted-foreground">Loading…</p>
                </TableCell>
              </TableRow>
            )}

            {!isLoading && isError && (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={totalColumns} className="py-16 text-center">
                  <p className="text-sm font-medium text-destructive">Couldn't load data</p>
                  <p className="mx-auto mt-1 max-w-md text-xs text-muted-foreground">
                    Check that the backend is running and reachable at your configured API URL.
                  </p>
                </TableCell>
              </TableRow>
            )}

            {!isLoading && !isError && rows.length === 0 && (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={totalColumns} className="py-16 text-center">
                  <Inbox className="mx-auto size-8 text-muted-foreground/40" />
                  <p className="mt-3 text-sm font-medium">{emptyTitle}</p>
                  <p className="mx-auto mt-1 max-w-md text-xs text-muted-foreground">{emptyHint}</p>
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              !isError &&
              rows.map((row) => (
                <TableRow key={row._id ?? row.id}>
                  {columns.map((c) => (
                    <TableCell key={c.header}>{c.render(row)}</TableCell>
                  ))}
                  {rowActions && <TableCell className="text-right">{rowActions(row)}</TableCell>}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
