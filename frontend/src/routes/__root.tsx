
import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Bell, LogOut, Search } from "lucide-react";

import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider, useAuth } from "@/lib/auth";

import appCss from "../styles.css?url";

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Aurelia Suites — Hospitality Management",
      },
      {
        name: "description",
        content:
          "Aurelia Suites hotel management and customer booking portal.",
      },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  component: RootComponent,
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppShell />
      </AuthProvider>

      <Toaster />
    </QueryClientProvider>
  );
}

function AppShell() {
  const { isAuthenticated, isLoading, user, logout } = useAuth();

  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const navigate = useNavigate();

  // Customer pages use their own layout instead of the staff sidebar.
  const isCustomerRoute =
    pathname === "/" || pathname.startsWith("/customer");

  // These pages are accessible without a logged-in session.
  const isPublicRoute =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/customer/login" ||
    pathname === "/customer/register";

  // These customer pages already render their own logout controls.
  const customerPageHasOwnLogout =
    pathname === "/customer/rooms" ||
    pathname === "/customer/bookings" ||
    pathname.startsWith("/customer/book/");

  // Protect staff and customer pages.
  useEffect(() => {
    if (isLoading || isPublicRoute || isAuthenticated) {
      return;
    }

    if (isCustomerRoute) {
      void navigate({
        to: "/customer/login",
        replace: true,
      });
      return;
    }

    void navigate({
      to: "/login",
      replace: true,
    });
  }, [
    isLoading,
    isPublicRoute,
    isAuthenticated,
    isCustomerRoute,
    navigate,
  ]);

  if (isLoading) {
    return null;
  }

  // Login and registration pages do not show the application header.
  if (isPublicRoute) {
    return <Outlet />;
  }

  // Customer area: show a shared logout header on pages that need one.
  if (isCustomerRoute) {
    return (
      <div className="min-h-screen bg-background">
        {isAuthenticated && !customerPageHasOwnLogout && (
          <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur sm:px-6">
            <div className="min-w-0">
              <p className="font-display truncate text-sm font-semibold">
                Aurelia Suites
              </p>
              <p className="text-xs text-muted-foreground">
                Customer Portal
              </p>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <span className="hidden max-w-40 truncate text-sm text-muted-foreground sm:inline">
                {user?.name}
              </span>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  logout();
                  void navigate({
                    to: "/customer/login",
                    replace: true,
                  });
                }}
              >
                <LogOut className="mr-2 size-4" />
                Logout
              </Button>
            </div>
          </header>
        )}

        <main>
          <Outlet />
        </main>
      </div>
    );
  }

  // Staff and admin area.
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur">
            <SidebarTrigger />

            <div className="relative hidden w-full max-w-sm items-center sm:flex">
              <Search className="absolute left-2.5 size-4 text-muted-foreground" />

              <Input
                placeholder="Search rooms, guests, orders…"
                className="h-9 pl-8"
                aria-label="Search rooms, guests and orders"
              />
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Notifications"
                title="Notifications"
              >
                <Bell className="size-4" />
              </Button>

              <span
                className="bg-brass flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-accent-foreground"
                title={user?.name ?? "Account"}
                aria-label={`Signed in as ${user?.name ?? "user"}`}
              >
                {user?.name?.[0]?.toUpperCase() ?? "A"}
              </span>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="gap-2"
                aria-label="Sign out"
                title="Sign out"
                onClick={() => {
                  logout();
                  void navigate({
                    to: "/login",
                    replace: true,
                  });
                }}
              >
                <LogOut className="size-4" />
                <span>Logout</span>
              </Button>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
