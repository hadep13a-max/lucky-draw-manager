import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { authStore, useAuthStore } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trophy, Lock, User } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Đăng nhập — Hội đồng thi" },
      { name: "description", content: "Đăng nhập tài khoản Quản trị viên để quản lý hệ thống." },
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => {
    return {
      redirect: (search.redirect as string) || "/",
    };
  },
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/login" });
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: search.redirect || "/" });
    }
  }, [isAuthenticated, navigate, search.redirect]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error("Vui lòng điền đầy đủ tên đăng nhập và mật khẩu");
      return;
    }

    setLoading(true);
    // Simulate brief network delay
    setTimeout(() => {
      const success = authStore.login(username, password);
      setLoading(false);
      if (success) {
        toast.success("Đăng nhập quản trị viên thành công!");
        navigate({ to: search.redirect || "/" });
      } else {
        toast.error("Tên đăng nhập hoặc mật khẩu không đúng!");
      }
    }, 400);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 h-[3px] w-full bg-gold" />

      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <span className="relative grid h-12 w-12 place-items-center rounded-xl bg-primary-gradient text-primary-foreground shadow-glow">
            <Trophy className="h-6 w-6" />
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-gold ring-2 ring-background" />
          </span>
          <h2 className="mt-6 font-display text-3xl font-bold tracking-tight">
            Hội đồng thi
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Đăng nhập tài khoản Quản trị viên để quản lý hệ thống
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="username">Tên đăng nhập</Label>
                <div className="relative mt-1.5">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    <User className="h-4 w-4" />
                  </span>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin"
                    className="pl-10"
                    disabled={loading}
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Mật khẩu</Label>
                <div className="relative mt-1.5">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    <Lock className="h-4 w-4" />
                  </span>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10"
                    disabled={loading}
                    autoComplete="current-password"
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full rounded-full py-6 font-semibold" disabled={loading}>
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
