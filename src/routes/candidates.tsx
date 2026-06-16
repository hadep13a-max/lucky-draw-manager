import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { examStore, useExamStore, type Candidate } from "@/lib/exam-store";
import { useAuthStore } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, Plus, Users } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/candidates")({
  head: () => ({ meta: [{ title: "Người thi — Hội đồng thi" }] }),
  component: Page,
});

function Page() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/login", search: { redirect: "/candidates" } });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const candidates = useExamStore((s) => s.candidates);
  const [editing, setEditing] = useState<Candidate | null>(null);
  const [form, setForm] = useState({ name: "", code: "", note: "" });

  const reset = () => {
    setEditing(null);
    setForm({ name: "", code: "", note: "" });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Vui lòng nhập tên");
    if (editing) {
      examStore.updateCandidate(editing.id, form);
      toast.success("Đã cập nhật người thi");
    } else {
      examStore.addCandidate(form);
      toast.success("Đã thêm người thi");
    }
    reset();
  };

  const startEdit = (c: Candidate) => {
    setEditing(c);
    setForm({ name: c.name, code: c.code ?? "", note: c.note ?? "" });
  };

  return (
    <AppShell>
      <div className="mb-6 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-secondary">
          <Users className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-semibold">Danh sách người thi</h1>
          <p className="text-sm text-muted-foreground">Thêm, sửa, xoá thí sinh tham gia bốc thăm.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <form
          onSubmit={submit}
          className="h-fit rounded-xl border border-border bg-card p-6 shadow-card"
        >
          <h2 className="mb-4 font-display text-lg font-semibold">
            {editing ? "Chỉnh sửa" : "Thêm người thi"}
          </h2>
          <div className="space-y-3">
            <div>
              <Label>Họ và tên *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="VD: Nguyễn Văn A" />
            </div>
            <div>
              <Label>Mã số</Label>
              <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="VD: TS001" />
            </div>
            <div>
              <Label>Ghi chú</Label>
              <Input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Tuỳ chọn" />
            </div>
          </div>
          <div className="mt-5 flex gap-2">
            <Button type="submit" className="flex-1">
              <Plus className="mr-1 h-4 w-4" /> {editing ? "Lưu" : "Thêm"}
            </Button>
            {editing && (
              <Button type="button" variant="outline" onClick={reset}>Huỷ</Button>
            )}
          </div>
        </form>

        <div className="rounded-xl border border-border bg-card shadow-card">
          <div className="border-b border-border px-6 py-4">
            <p className="text-sm text-muted-foreground">
              Tổng: <span className="font-semibold text-foreground">{candidates.length}</span> người thi
            </p>
          </div>
          {candidates.length === 0 ? (
            <p className="p-10 text-center text-sm text-muted-foreground">Chưa có người thi.</p>
          ) : (
            <ul className="divide-y divide-border">
              {candidates.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-4 px-6 py-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {c.code && (
                        <span className="rounded bg-secondary px-2 py-0.5 text-xs font-medium">
                          {c.code}
                        </span>
                      )}
                      <p className="truncate font-medium">{c.name}</p>
                    </div>
                    {c.note && <p className="mt-0.5 truncate text-sm text-muted-foreground">{c.note}</p>}
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button size="icon" variant="ghost" onClick={() => startEdit(c)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        examStore.deleteCandidate(c.id);
                        toast.success("Đã xoá");
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AppShell>
  );
}
