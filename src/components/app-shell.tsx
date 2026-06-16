import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Users, BookOpen, Shuffle, Trophy, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

const nav = [
  { to: "/", label: "Tổng quan", icon: Sparkles },
  { to: "/candidates", label: "Người thi", icon: Users },
  { to: "/topics", label: "Nội dung thi", icon: BookOpen },
  { to: "/draw", label: "Bốc thăm", icon: Shuffle },
  { to: "/results", label: "Kết quả", icon: Trophy },
] as const;

export function AppShell({ children }: { children?: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-gold text-primary-foreground shadow-card">
              <Trophy className="h-5 w-5" />
            </span>
            <div className="leading-tight">
              <div className="font-display text-lg font-semibold">Hội đồng thi</div>
              <div className="text-xs text-muted-foreground">Quản lý & bốc thăm</div>
            </div>
          </Link>
          <nav className="hidden gap-1 md:flex">
            {nav.map((n) => {
              const Icon = n.icon;
              const active = pathname === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-primary text-primary-foreground shadow-card"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {n.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex gap-1 overflow-x-auto px-4 pb-2 md:hidden">
          {nav.map((n) => {
            const Icon = n.icon;
            const active = pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium ${
                  active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {n.label}
              </Link>
            );
          })}
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children ?? <Outlet />}</main>
    </div>
  );
}
