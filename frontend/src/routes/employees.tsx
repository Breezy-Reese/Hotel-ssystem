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
import { employeesApi } from "@/lib/resources";
import type { Employee, EmployeeStatus } from "@/lib/types";
import { ApiError } from "@/lib/api";

export const Route = createFileRoute("/employees")({
  head: () => ({
    meta: [
      { title: "Employee Management — Aurelia Suites" },
      {
        name: "description",
        content: "Staff directory with departments, roles, schedules and employment status.",
      },
    ],
  }),
  component: EmployeesPage,
});

const STATUS_VARIANT: Record<EmployeeStatus, "default" | "secondary" | "destructive" | "outline"> =
  {
    Active: "default",
    OnLeave: "secondary",
    Terminated: "destructive",
  };

const columns: LiveColumn<Employee>[] = [
  { header: "Employee", render: (e) => <span className="font-medium">{e.name}</span> },
  { header: "Department", render: (e) => e.department },
  { header: "Role", render: (e) => e.role },
  { header: "Shift", render: (e) => e.shift },
  { header: "Phone", render: (e) => e.phone || "—" },
  { header: "Status", render: (e) => <Badge variant={STATUS_VARIANT[e.status]}>{e.status}</Badge> },
];

const DEPARTMENTS = [
  "Front Desk",
  "Housekeeping",
  "Maintenance",
  "Kitchen",
  "Restaurant",
  "Accounting",
  "HR",
  "Management",
  "Inventory",
  "Security",
];

function EmployeesPage() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data, isLoading, isError } = employeesApi.useList({ search, sort: "name" });
  const createEmployee = employeesApi.useCreate();

  const employees = data?.data ?? [];
  const stats = {
    Employees: data?.total ?? "—",
    "On duty": employees.filter((e) => e.status === "Active").length,
    "On leave": employees.filter((e) => e.status === "OnLeave").length,
    Departments: new Set(employees.map((e) => e.department)).size,
  };

  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name")),
      department: String(form.get("department")),
      role: String(form.get("role")),
      shift: String(form.get("shift")) as Employee["shift"],
      phone: String(form.get("phone") || ""),
      email: String(form.get("email") || ""),
    };
    try {
      await createEmployee.mutateAsync(payload);
      toast.success("Employee added");
      setDialogOpen(false);
      e.currentTarget.reset();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to add employee");
    }
  }

  return (
    <>
      <ModulePage
        title="Employee Management"
        description="Staff directory with departments, roles, schedules and employment status."
        action="Add employee"
        onAction={() => setDialogOpen(true)}
        stats={["Employees", "On duty", "On leave", "Departments"]}
        statValues={stats}
        columns={columns.map((c) => c.header)}
        capabilities={[
          "Staff profiles",
          "Departments",
          "Job roles",
          "Work schedules",
          "Staff status",
        ]}
        table={
          <LiveDataTable
            columns={columns}
            rows={employees}
            isLoading={isLoading}
            isError={isError}
            search={search}
            onSearchChange={setSearch}
            recordCount={data?.total}
            emptyTitle="No employees yet"
            emptyHint="Add your first staff member to get started."
          />
        }
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add employee</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="department">Department</Label>
                <Select name="department" required defaultValue={DEPARTMENTS[0] as string}>
                  <SelectTrigger id="department">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="role">Role</Label>
                <Input id="role" name="role" placeholder="e.g. Receptionist" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="shift">Shift</Label>
                <Select name="shift" required defaultValue="Morning">
                  <SelectTrigger id="shift">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Morning", "Afternoon", "Night"].map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={createEmployee.isPending}>
                {createEmployee.isPending ? "Adding…" : "Add employee"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
