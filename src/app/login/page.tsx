"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { loginSchema } from "@/lib/validation/schemas";
import { ensureDemoData } from "@/lib/demo/seed";
import { saveDemoStore } from "@/lib/demo/store";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("demo@pizzariaflow.com.br");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setError(result.error.errors[0]?.message ?? "Dados inválidos");
      return;
    }
    setLoading(true);

    // Preserve existing lab data; only seed when storage was never created.
    const store = ensureDemoData();
    const user = store.users[0];
    const workspace = store.workspaces[0];
    store.session = {
      userId: user?.id ?? "user-demo",
      workspaceId: workspace?.id ?? store.session?.workspaceId ?? "ws-demo",
      email: result.data.email,
      name: user?.name ?? "Demo",
    };
    saveDemoStore(store);

    setTimeout(() => {
      router.push("/app");
    }, 400);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-ink)] px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-display text-2xl">Entrar</CardTitle>
          <CardDescription>
            Demo mode: use <code className="text-[var(--accent-amber)]">demo@pizzariaflow.com.br</code>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-[var(--risk-critical)]">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-[var(--text-secondary)]">
            Não tem conta?{" "}
            <Link href="/signup" className="text-[var(--accent-teal)] hover:underline">
              Criar conta
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
