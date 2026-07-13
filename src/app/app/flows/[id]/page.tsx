"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useDemo } from "@/lib/demo/provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Textarea } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import type { Flow } from "@/lib/types";

export default function FlowDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { store, hydrated, updateFlow } = useDemo();
  const flow = store.flows.find((f) => f.id === id);
  const [edited, setEdited] = useState<Flow | null>(null);

  useEffect(() => {
    if (flow) {
      setEdited(flow);
    }
  }, [flow]);

  if (!hydrated) {
    return (
      <div className="space-y-6" aria-busy="true" aria-label="Carregando flow">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!flow || !edited) {
    return (
      <EmptyState
        title="Flow não encontrado"
        description="Este flow pode ter sido removido."
        actionLabel="Voltar"
        onAction={() => router.push("/app/flows")}
      />
    );
  }

  function save() {
    if (!edited) return;
    updateFlow({ ...edited, updatedAt: new Date().toISOString(), version: edited.version + 1 });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/app/flows">
          <Button variant="ghost" size="sm" aria-label="Voltar para flows">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold">{flow.name}</h1>
          <div className="mt-1 flex gap-2">
            <Badge variant="info">{flow.channel}</Badge>
            <Badge>v{flow.version}</Badge>
          </div>
        </div>
        <Button onClick={save} className="gap-2">
          <Save className="h-4 w-4" /> Salvar v{edited.version + 1}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="flow-name">Nome</Label>
            <Input
              id="flow-name"
              value={edited.name}
              onChange={(e) => setEdited({ ...edited, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="flow-description">Descrição</Label>
            <Textarea
              id="flow-description"
              value={edited.description}
              onChange={(e) => setEdited({ ...edited, description: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Passos ({edited.steps.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {edited.steps.map((step, i) => (
            <div
              key={step.id}
              className="rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-4"
            >
              <div className="mb-2 flex items-center gap-2">
                <Badge variant="info">#{step.order}</Badge>
                <span className="text-sm font-medium text-[var(--text-secondary)]">
                  Passo {i + 1}
                </span>
              </div>
              <div className="space-y-3">
                <div>
                  <Label htmlFor={`trigger-${step.id}`}>Trigger</Label>
                  <Input
                    id={`trigger-${step.id}`}
                    value={step.trigger}
                    onChange={(e) => {
                      const steps = edited.steps.map((s) =>
                        s.id === step.id ? { ...s, trigger: e.target.value } : s,
                      );
                      setEdited({ ...edited, steps });
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor={`expected-${step.id}`}>Resposta esperada</Label>
                  <Textarea
                    id={`expected-${step.id}`}
                    value={step.expectedResponse}
                    onChange={(e) => {
                      const steps = edited.steps.map((s) =>
                        s.id === step.id ? { ...s, expectedResponse: e.target.value } : s,
                      );
                      setEdited({ ...edited, steps });
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
