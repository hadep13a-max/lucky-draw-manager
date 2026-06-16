import { createFileRoute, Link } from "@tanstack/react-router";
import { useExamStore } from "@/lib/exam-store";
import { Users, BookOpen, Shuffle, Trophy, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/app-shell";

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
      <section className="relative overflow-hidden rounded-[28px] bg-stage p-10 text-primary-foreground shadow-glow md:p-14">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/15 bg-primary-foreground/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.25em] text-accent backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-float-soft" />
            Hội đồng thi · Phiên bản 2026
          </div>
          <h1 className="mt-5 font-display text-[44px] font-semibold leading-[1.05] tracking-tight md:text-6xl">
            Bốc thăm <span className="text-gold italic">minh bạch</span>,
            <br />
            tổ chức <span className="text-gold italic">chuyên nghiệp</span>.
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-primary-foreground/70 md:text-base">
            Quản lý danh sách thí sinh, kho đề thi và tổ chức bốc thăm trực tiếp
            với hiệu ứng quay số trên màn hình lớn — tất cả trong một không gian
            điều khiển duy nhất.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/draw"
              className="group inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-primary-foreground shadow-card transition hover:opacity-95"
            >
              <Shuffle className="h-4 w-4" /> Bắt đầu bốc thăm
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/results"
              className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 px-6 py-3 text-sm font-medium transition hover:bg-primary-foreground/10"
            >
              Xem kết quả
            </Link>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 right-20 h-80 w-80 rounded-full bg-primary/40 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              to={s.to}
              className="group rounded-xl border border-border bg-card p-6 shadow-card transition hover:-translate-y-0.5 hover:border-primary/40"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="mt-1 font-display text-4xl font-semibold">{s.value}</p>
                </div>
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-secondary text-secondary-foreground">
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition group-hover:opacity-100">
                Quản lý <ArrowRight className="h-3.5 w-3.5" />
              </p>
            </Link>
          );
        })}
      </section>

      <section className="mt-8 rounded-xl border border-border bg-card p-6 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Lượt bốc thăm gần đây</h2>
          <Link to="/results" className="text-sm font-medium text-primary hover:underline">
            Tất cả
          </Link>
        </div>
        {results.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Chưa có lượt bốc thăm nào. Hãy bắt đầu ở trang Bốc thăm.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {results.slice(0, 5).map((r) => (
              <li key={r.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">{r.candidateName}</p>
                  <p className="text-sm text-muted-foreground">{r.topicTitle}</p>
                </div>
                <span className="text-xs text-muted-foreground">
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
