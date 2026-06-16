import { createFileRoute, Link } from "@tanstack/react-router";
import { useExamStore } from "@/lib/exam-store";
import { Users, BookOpen, Trophy, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import backgroundImage from "@/images/background.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tổng quan — Hội đồng thi" },
      { name: "description", content: "Tổng quan hệ thống quản lý người thi và bốc thăm." },
    ],
  }),
  component: Index,
});

function Index() {
  const candidates = useExamStore((s) => s.candidates);
  const topics = useExamStore((s) => s.topics);
  const results = useExamStore((s) => s.results);

  const stats = [
    { label: "Người thi", value: candidates.length, icon: Users, to: "/candidates" as const },
    { label: "Nội dung thi", value: topics.length, icon: BookOpen, to: "/topics" as const },
    { label: "Lượt bốc thăm", value: results.length, icon: Trophy, to: "/results" as const },
  ];

  return (
    <AppShell>
      <div className="relative overflow-hidden rounded-[28px] shadow-glow">
        <img
          src={backgroundImage}
          alt="Hội thi"
          className="w-full h-auto object-cover block"
        />
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              to={s.to}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-glow"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent opacity-0 transition group-hover:opacity-100" />
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    {s.label}
                  </p>
                  <p className="nums mt-2 font-display text-5xl font-semibold">{s.value}</p>
                </div>
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-secondary text-primary">
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-6 inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider text-primary opacity-60 transition group-hover:opacity-100">
                Quản lý <ArrowRight className="h-3 w-3" />
              </p>
            </Link>
          );
        })}
      </section>

      <section className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div>
            <h2 className="font-display text-xl font-semibold">Lượt bốc thăm gần đây</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">5 kết quả mới nhất</p>
          </div>
          <Link to="/results" className="text-sm font-medium text-primary hover:underline">
            Tất cả →
          </Link>
        </div>
        {results.length === 0 ? (
          <p className="py-14 text-center text-sm text-muted-foreground">
            Chưa có lượt bốc thăm nào. Hãy bắt đầu ở trang Bốc thăm.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {results.slice(0, 5).map((r, i) => (
              <li key={r.id} className="flex items-center justify-between gap-4 px-6 py-4 transition hover:bg-muted/40">
                <div className="flex min-w-0 items-center gap-4">
                  <span className="nums grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-secondary text-sm font-semibold text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{r.candidateName}</p>
                    <p className="truncate text-sm text-muted-foreground">{r.topicTitle}</p>
                  </div>
                </div>
                <span className="nums shrink-0 text-xs text-muted-foreground">
                  {new Date(r.drawnAt).toLocaleString("vi-VN")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AppShell>
  );
}
