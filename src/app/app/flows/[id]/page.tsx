"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { useState } from "react";
import { useDemo } from "@/lib/demo/provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Textarea } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";

export default function FlowDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { store, updateFlow } = useDemo();
  const flow = store.flows.find((f) => f.id === id);
  const [edited, setEdited] = useState(flow);

  if (!flow || !edited) {
    return (
      <EmptyState
        title="Flow não encontrado"
        description="Este flow pode ter sido removido."
        actionLabel="Voltar"
        onAction={() => (window.location.href = "/app/flows")}
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
          <Button variant="ghost" size="sm">
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
            <Label>Nome</Label>
            <Input value={edited.name} onChange={(e) => setEdited({ ...edited, name: e.target.value })} />
          </div>
          <div>
            <Label>Descrição</Label>
            <Textarea
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
            <div key={step.id} className="rounded-lg border border-[var(--border)] p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[var(--accent-amber)]">Passo {i + 1}</span>
                <Badge>Risk {Math.round(step.riskWeight * 100)}%</Badge>
              </div>
              <p className="mt-2 text-sm">
                <span className="text-[var(--text-muted)]">Trigger: </span>
                {step.trigger}
              </p>
              <p className="mt-1 text-sm">
                <span className="text-[var(--text-muted)]">Esperado: </span>
                {step.expectedResponse}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Simulações deste flow</CardTitle>
        </CardHeader>
        <CardContent>
          {store.simulations
            .filter((s) => s.flowId === id)
            .map((sim) => (
              <Link
                key={sim.id}
                href={`/app/simulations/${sim.id}`}
                className="flex items-center justify-between rounded-lg border border-[var(--border)] p-3 hover:bg-[var(--bg-elevated)]"
              >
                <span className="text-sm">v{sim.flowVersion}</span>
                <Badge variant={sim.riskScore >= 70 ? "danger" : sim.riskScore >= 40 ? "warning" : "success"}>
                  Risk {sim.riskScore}
                </Badge>
              </Link>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
