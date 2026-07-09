"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { signupSchema } from "@/lib/validation/schemas";
import { seedDemoData } from "@/lib/demo/seed";

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
    seedDemoData();
    setTimeout(() => router.push("/onboarding"), 400);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-ink)] px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-display text-2xl">Criar conta</CardTitle>
          <CardDescription>Comece com demo data da Pizzaria Flow</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {(["name", "email", "password", "workspaceName"] as const).map((field) => (
              <div key={field}>
                <Label htmlFor={field}>
                  {field === "workspaceName" ? "Nome do workspace" : field === "name" ? "Nome" : field === "email" ? "E-mail" : "Senha"}
                </Label>
                <Input
                  id={field}
                  type={field === "password" ? "password" : field === "email" ? "email" : "text"}
                  value={form[field]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
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
