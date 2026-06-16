import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { examStore, useExamStore, type Candidate, type Topic } from "@/lib/exam-store";
import { Button } from "@/components/ui/button";
import { Shuffle, Users, BookOpen, Save, RotateCw } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/draw")({
  head: () => ({ meta: [{ title: "Bốc thăm — Hội đồng thi" }] }),
  component: Page,
});

function useDrawer<T extends { id: string }>(items: T[]) {
  const [current, setCurrent] = useState<T | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [display, setDisplay] = useState<T | null>(null);
  const intRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const spin = (exclude: Set<string> = new Set()) => {
    const pool = items.filter((x) => !exclude.has(x.id));
    if (pool.length === 0) {
      toast.error("Không còn lựa chọn khả dụng");
      return;
    }
    setSpinning(true);
    setCurrent(null);
    if (intRef.current) clearInterval(intRef.current);
    intRef.current = setInterval(() => {
      setDisplay(pool[Math.floor(Math.random() * pool.length)]);
    }, 70);
    const duration = 1800 + Math.random() * 800;
    setTimeout(() => {
      if (intRef.current) clearInterval(intRef.current);
      const picked = pool[Math.floor(Math.random() * pool.length)];
      setDisplay(picked);
      setCurrent(picked);
      setSpinning(false);
    }, duration);
  };

  const clear = () => {
    setCurrent(null);
    setDisplay(null);
  };

  return { current, display, spinning, spin, clear };
}

function Page() {
  const candidates = useExamStore((s) => s.candidates);
  const topics = useExamStore((s) => s.topics);
  const results = useExamStore((s) => s.results);

  const drawnCandidateIds = new Set(results.map((r) => r.candidateId));
  const [excludeDrawn, setExcludeDrawn] = useState(true);

  const cd = useDrawer<Candidate>(candidates);
  const td = useDrawer<Topic>(topics);

  const save = () => {
    if (!cd.current || !td.current) {
      toast.error("Cần bốc thăm cả người thi và nội dung");
      return;
    }
    examStore.saveResult(cd.current, td.current);
    toast.success(`Đã lưu: ${cd.current.name} → ${td.current.title}`);
    cd.clear();
    td.clear();
  };

  return (
    <AppShell>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-gold text-primary-foreground">
            <Shuffle className="h-5 w-5" />
          </span>
          <div>
            <h1 className="font-display text-2xl font-semibold">Khu vực bốc thăm</h1>
            <p className="text-sm text-muted-foreground">
              Bốc thăm song song người thi và nội dung thi.
            </p>
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={excludeDrawn}
            onChange={(e) => setExcludeDrawn(e.target.checked)}
            className="h-4 w-4 accent-[color:var(--primary)]"
          />
          Loại trừ người đã bốc
        </label>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DrawCard
          title="Bốc thăm người thi"
          icon={<Users className="h-5 w-5" />}
          empty="Chưa có người thi"
          emptyLink={{ to: "/candidates", label: "Thêm người thi" }}
          itemsCount={candidates.length}
          spinning={cd.spinning}
          display={cd.display?.name}
          subDisplay={cd.display && "code" in cd.display ? (cd.display as Candidate).code : undefined}
          current={cd.current?.name}
          onSpin={() => cd.spin(excludeDrawn ? drawnCandidateIds : new Set())}
          tone="primary"
        />
        <DrawCard
          title="Bốc thăm nội dung"
          icon={<BookOpen className="h-5 w-5" />}
          empty="Chưa có nội dung thi"
          emptyLink={{ to: "/topics", label: "Thêm nội dung" }}
          itemsCount={topics.length}
          spinning={td.spinning}
          display={td.display?.title}
          subDisplay={td.display?.detail}
          current={td.current?.title}
          onSpin={() => td.spin()}
          tone="accent"
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-5 shadow-card">
        <div className="text-sm">
          {cd.current && td.current ? (
            <span>
              Sẵn sàng lưu: <strong>{cd.current.name}</strong> — <strong>{td.current.title}</strong>
            </span>
          ) : (
            <span className="text-muted-foreground">Bốc thăm cả hai bên rồi lưu kết quả.</span>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { cd.clear(); td.clear(); }}>
            <RotateCw className="mr-1 h-4 w-4" /> Đặt lại
          </Button>
          <Button onClick={save} disabled={!cd.current || !td.current}>
            <Save className="mr-1 h-4 w-4" /> Lưu kết quả
          </Button>
        </div>
      </div>
    </AppShell>
  );
}

type DrawCardProps = {
  title: string;
  icon: React.ReactNode;
  empty: string;
  emptyLink: { to: "/candidates" | "/topics"; label: string };
  itemsCount: number;
  spinning: boolean;
  display?: string;
  subDisplay?: string;
  current?: string;
  onSpin: () => void;
  tone: "primary" | "accent";
};

function DrawCard(p: DrawCardProps) {
  const empty = p.itemsCount === 0;
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-2.5 font-medium">
          <span className={`grid h-8 w-8 place-items-center rounded-lg ${p.tone === "primary" ? "bg-primary/10 text-primary" : "bg-accent/25 text-accent-foreground"}`}>
            {p.icon}
          </span>
          <span className="text-[15px]">{p.title}</span>
        </div>
        <span className="nums rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
          {p.itemsCount} mục
        </span>
      </div>
      <div className="relative bg-stage px-6 py-14 text-center text-primary-foreground">
        {empty ? (
          <div className="space-y-3">
            <p className="text-sm text-primary-foreground/70">{p.empty}</p>
            <Link
              to={p.emptyLink.to}
              className="inline-block rounded-full bg-primary-foreground/10 px-4 py-2 text-sm font-medium hover:bg-primary-foreground/15"
            >
              {p.emptyLink.label}
            </Link>
          </div>
        ) : (
          <div className={p.spinning ? "" : "animate-pop-in"}>
            <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-accent">
              {p.spinning ? "Đang quay" : p.current ? "Kết quả" : "Sẵn sàng"}
            </p>
            <p
              className={`mt-4 font-display text-[40px] font-semibold leading-[1.05] tracking-tight md:text-[52px] ${p.spinning ? "text-primary-foreground/85" : "text-gold italic"}`}
            >
              {p.display ?? "—"}
            </p>
            {p.subDisplay && !p.spinning && (
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-primary-foreground/70">
                {p.subDisplay}
              </p>
            )}
          </div>
        )}
        {p.spinning && <div className="shimmer pointer-events-none absolute inset-0" />}
      </div>
      <div className="px-6 py-4">
        <Button onClick={p.onSpin} disabled={empty || p.spinning} className="w-full rounded-full" size="lg">
          <Shuffle className={`mr-2 h-4 w-4 ${p.spinning ? "animate-spin-slow" : ""}`} />
          {p.spinning ? "Đang quay..." : p.current ? "Quay lại" : "Bốc thăm"}
        </Button>
      </div>
    </div>
  );
}
