import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Users, BookOpen, Shuffle, Trophy, LayoutDashboard } from "lucide-react";
import type { ReactNode } from "react";

const nav = [
  { to: "/", label: "Tổng quan", icon: LayoutDashboard },
  { to: "/candidates", label: "Người thi", icon: Users },
  { to: "/topics", label: "Nội dung thi", icon: BookOpen },
  { to: "/draw", label: "Bốc thăm", icon: Shuffle },
  { to: "/results", label: "Kết quả", icon: Trophy },
] as const;

export function AppShell({ children }: { children?: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top accent bar */}
      <div className="h-[3px] w-full bg-gold" />
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
          <Link to="/" className="group flex items-center gap-3">
            <span className="relative grid h-10 w-10 place-items-center rounded-lg bg-primary-gradient text-primary-foreground shadow-card">
              <Trophy className="h-5 w-5" />
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-gold ring-2 ring-background" />
            </span>
            <div className="leading-tight">
              <div className="font-display text-[19px] font-semibold tracking-tight">
                Hội đồng thi
              </div>
              <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Quản lý &amp; Bốc thăm
              </div>
            </div>
          </Link>
          <nav className="hidden items-center gap-0.5 rounded-full border border-border bg-card/60 p-1 shadow-card md:flex">
            {nav.map((n) => {
              const Icon = n.icon;
              const active = pathname === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[13px] font-medium transition ${
                    active
                      ? "bg-primary text-primary-foreground shadow-card"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {n.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex gap-1 overflow-x-auto px-4 pb-3 md:hidden">
          {nav.map((n) => {
            const Icon = n.icon;
            const active = pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {n.label}
              </Link>
            );
          })}
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children ?? <Outlet />}</main>
      <footer className="mx-auto max-w-6xl px-6 pb-10 pt-4">
        <div className="hairline mb-4" />
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Hội đồng thi · Hệ thống quản lý &amp; bốc thăm minh bạch
        </p>
      </footer>
    </div>
  );
}
