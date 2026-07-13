"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { signupSchema } from "@/lib/validation/schemas";
import { seedDemoData } from "@/lib/demo/seed";
import { saveDemoStore } from "@/lib/demo/store";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    workspaceName: "Meu Workspace",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const result = signupSchema.safeParse(form);
    if (!result.success) {
      setError(result.error.errors[0]?.message ?? "Dados inválidos");
      return;
    }
    setLoading(true);

    // Seed pizza demo flows/personas, then personalize session + workspace for the signup form.
    const store = seedDemoData();
    const workspace = store.workspaces[0];
    if (workspace) {
      workspace.name = result.data.workspaceName;
      workspace.slug = result.data.workspaceName
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    }
    const user = store.users[0];
    if (user) {
      user.name = result.data.name;
      user.email = result.data.email;
    }
    store.session = {
      userId: user?.id ?? "user-demo",
      workspaceId: workspace?.id ?? "ws-demo",
      email: result.data.email,
      name: result.data.name,
    };
    saveDemoStore(store);

    setTimeout(() => router.push("/onboarding"), 400);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-ink)] px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-display text-2xl">Criar conta</CardTitle>
          <CardDescription>
            Demo local: seed da Pizzaria Flow + seu nome/workspace no formulário
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {(["name", "email", "password", "workspaceName"] as const).map((field) => (
              <div key={field}>
                <Label htmlFor={field}>
                  {field === "workspaceName"
                    ? "Nome do workspace"
                    : field === "name"
                      ? "Nome"
                      : field === "email"
                        ? "E-mail"
                        : "Senha"}
                </Label>
                <Input
                  id={field}
                  type={field === "password" ? "password" : field === "email" ? "email" : "text"}
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  autoComplete={
                    field === "password" ? "new-password" : field === "email" ? "email" : "name"
                  }
                />
              </div>
            ))}
            {error && <p className="text-sm text-[var(--risk-critical)]">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Criando..." : "Criar conta"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-[var(--text-secondary)]">
            Já tem conta?{" "}
            <Link href="/login" className="text-[var(--accent-teal)] hover:underline">
              Entrar
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
