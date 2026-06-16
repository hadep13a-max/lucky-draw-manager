import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { examStore, useExamStore } from "@/lib/exam-store";
import { useAuthStore } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import { Trophy, Trash2, Download } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/results")({
  head: () => ({ meta: [{ title: "Kết quả — Hội đồng thi" }] }),
  component: Page,
});

function Page() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/login", search: { redirect: "/results" } });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const results = useExamStore((s) => s.results);

  const exportCsv = () => {
    const rows = [
      ["STT", "Người thi", "Nội dung thi", "Thời gian"],
      ...results.map((r, i) => [
        String(i + 1),
        r.candidateName,
        r.topicTitle,
        new Date(r.drawnAt).toLocaleString("vi-VN"),
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ket-qua-boc-tham-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppShell>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-gold text-primary-foreground">
            <Trophy className="h-5 w-5" />
          </span>
          <div>
            <h1 className="font-display text-2xl font-semibold">Kết quả tổng</h1>
            <p className="text-sm text-muted-foreground">
              Tổng hợp tất cả lượt bốc thăm đã thực hiện.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCsv} disabled={results.length === 0}>
            <Download className="mr-1 h-4 w-4" /> Xuất CSV
          </Button>
          <Button
            variant="outline"
            disabled={results.length === 0}
            onClick={() => {
              if (confirm("Xoá toàn bộ kết quả?")) {
                examStore.clearResults();
                toast.success("Đã xoá tất cả");
              }
            }}
          >
            <Trash2 className="mr-1 h-4 w-4 text-destructive" /> Xoá hết
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
        {results.length === 0 ? (
          <p className="p-12 text-center text-sm text-muted-foreground">
            Chưa có kết quả nào. Hãy đến trang Bốc thăm để bắt đầu.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-secondary text-secondary-foreground">
              <tr>
                <th className="px-4 py-3 text-left font-medium">STT</th>
                <th className="px-4 py-3 text-left font-medium">Người thi</th>
                <th className="px-4 py-3 text-left font-medium">Nội dung thi</th>
                <th className="px-4 py-3 text-left font-medium">Thời gian</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {results.map((r, i) => (
                <tr key={r.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                  <td className="px-4 py-3 font-medium">{r.candidateName}</td>
                  <td className="px-4 py-3">{r.topicTitle}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(r.drawnAt).toLocaleString("vi-VN")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        examStore.deleteResult(r.id);
                        toast.success("Đã xoá");
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AppShell>
  );
}
