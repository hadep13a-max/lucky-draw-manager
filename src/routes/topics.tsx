import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { examStore, useExamStore, type Topic } from "@/lib/exam-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2, Plus, BookOpen } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/topics")({
  head: () => ({ meta: [{ title: "Nội dung thi — Hội đồng thi" }] }),
  component: Page,
});

function Page() {
  const topics = useExamStore((s) => s.topics);
  const [editing, setEditing] = useState<Topic | null>(null);
  const [form, setForm] = useState({ title: "", detail: "" });

  const reset = () => {
    setEditing(null);
    setForm({ title: "", detail: "" });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error("Vui lòng nhập tiêu đề");
    if (editing) {
      examStore.updateTopic(editing.id, form);
      toast.success("Đã cập nhật");
    } else {
      examStore.addTopic(form);
      toast.success("Đã thêm nội dung");
    }
    reset();
  };

  const startEdit = (t: Topic) => {
    setEditing(t);
    setForm({ title: t.title, detail: t.detail ?? "" });
  };

  return (
    <AppShell>
      <div className="mb-6 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-lg bg-secondary">
          <BookOpen className="h-5 w-5" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-semibold">Nội dung thi</h1>
          <p className="text-sm text-muted-foreground">Quản lý kho đề / chủ đề để bốc thăm.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <form onSubmit={submit} className="h-fit rounded-xl border border-border bg-card p-6 shadow-card">
          <h2 className="mb-4 font-display text-lg font-semibold">
            {editing ? "Chỉnh sửa" : "Thêm nội dung"}
          </h2>
          <div className="space-y-3">
            <div>
              <Label>Tiêu đề *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="VD: Đề số 1" />
            </div>
            <div>
              <Label>Nội dung chi tiết</Label>
              <Textarea
                value={form.detail}
                onChange={(e) => setForm({ ...form, detail: e.target.value })}
                placeholder="Mô tả đề thi / yêu cầu..."
                rows={5}
              />
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
              Tổng: <span className="font-semibold text-foreground">{topics.length}</span> nội dung
            </p>
          </div>
          {topics.length === 0 ? (
            <p className="p-10 text-center text-sm text-muted-foreground">Chưa có nội dung nào.</p>
          ) : (
            <ul className="divide-y divide-border">
              {topics.map((t) => (
                <li key={t.id} className="flex items-start justify-between gap-4 px-6 py-4">
                  <div className="min-w-0">
                    <p className="font-medium">{t.title}</p>
                    {t.detail && <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">{t.detail}</p>}
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button size="icon" variant="ghost" onClick={() => startEdit(t)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        examStore.deleteTopic(t.id);
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
