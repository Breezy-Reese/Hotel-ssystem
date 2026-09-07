import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Loader2, ShieldCheck, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { ApiError } from "@/lib/api";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Sign in — Aurelia Suites" }],
  }),
  component: LoginPage,
});

type LoginType = "staff" | "customer";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [loginType, setLoginType] = useState<LoginType>("staff");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setError(null);
    setIsSubmitting(true);

    try {
      const loggedInUser = await login(email, password);
const role = loggedInUser.role?.toLowerCase();

      const staffRoles = [
        "admin",
        "staff",
        "manager",
        "receptionist",
        "accountant",
        "housekeeping",
      ];

      const customerRoles = ["customer", "guest"];

      if (loginType === "staff") {
        if (!role || !staffRoles.includes(role)) {
          setError("This account is not a staff or admin account.");
          return;
        }

        navigate({
          to: "/dashboard",
        });

        return;
      }

      if (loginType === "customer") {
        if (!role || !customerRoles.includes(role)) {
          setError("This account is not a customer account.");
          return;
        }

        navigate({
          to: "/",
        });
      }
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Unable to sign in. Check your connection.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md shadow-card">
        <CardHeader className="text-center">
          <CardTitle className="font-display text-2xl">
            Aurelia Suites
          </CardTitle>

          <CardDescription>
            Sign in to continue
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Login type */}
          <div className="mb-6">
            <Label className="mb-2 block">
              Login as
            </Label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setLoginType("staff");
                  setError(null);
                }}
                className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition ${
                  loginType === "staff"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:bg-muted"
                }`}
              >
                <ShieldCheck className="size-4" />
                Staff / Admin
              </button>

              <button
                type="button"
                onClick={() => {
                  setLoginType("customer");
                  setError(null);
                }}
                className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition ${
                  loginType === "customer"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:bg-muted"
                }`}
              >
                <UserRound className="size-4" />
                Customer
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">
                Email
              </Label>

              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  loginType === "staff"
                    ? "staff@aureliasuites.com"
                    : "customer@example.com"
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">
                Password
              </Label>

              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Loader2 className="size-4 animate-spin" />
              )}

              {isSubmitting
                ? "Signing in..."
                : loginType === "staff"
                  ? "Sign in as Staff"
                  : "Sign in as Customer"}
            </Button>
          </form>

          {loginType === "customer" && (
            <p className="mt-5 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <a
                href="/customer/register"
                className="font-semibold text-primary hover:underline"
              >
                Create one
              </a>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}