"use client";

import Link from "next/link";
import { useState } from "react";
import { GitBranch, Plus, Trash2 } from "lucide-react";
import { useDemo } from "@/lib/demo/provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { formatDate } from "@/lib/utils";

export default function FlowsPage() {
  const { store, workspace, addFlow, deleteFlow } = useDemo();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [channel, setChannel] = useState<"whatsapp" | "webchat" | "voice">("whatsapp");

  const flows = store.flows.filter((f) => f.workspaceId === workspace?.id);

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!workspace || !name.trim()) return;
    addFlow({
      workspaceId: workspace.id,
      name,
      description,
      channel,
      isActive: true,
      version: 1,
      tags: [],
      steps: [
        {
          id: `step-${Date.now()}`,
          order: 1,
          trigger: "Início da conversa",
          expectedResponse: "Cumprimentar o cliente",
          riskWeight: 0.2,
        },
      ],
    });
    setName("");
    setDescription("");
    setShowForm(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Flows</h1>
          <p className="text-[var(--text-secondary)]">Mapeie e versione fluxos do agente</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="h-4 w-4" /> Novo flow
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="desc">Descrição</Label>
                <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="channel">Canal</Label>
                <Select id="channel" value={channel} onChange={(e) => setChannel(e.target.value as typeof channel)}>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="webchat">Webchat</option>
                  <option value="voice">Voice</option>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button type="submit">Criar</Button>
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {flows.length === 0 ? (
        <EmptyState
          icon={<GitBranch className="h-12 w-12" />}
          title="Nenhum flow"
          description="Crie seu primeiro fluxo de conversa para começar a simular."
          actionLabel="Criar flow"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {flows.map((flow) => (
            <Card key={flow.id} className="group">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <Link href={`/app/flows/${flow.id}`} className="flex-1">
                    <h3 className="font-semibold group-hover:text-[var(--accent-amber)]">{flow.name}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-[var(--text-secondary)]">{flow.description}</p>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (confirm("Excluir este flow?")) deleteFlow(flow.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-[var(--risk-critical)]" />
                  </Button>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="info">{flow.channel}</Badge>
                  <Badge>v{flow.version}</Badge>
                  <Badge variant={flow.isActive ? "success" : "default"}>
                    {flow.isActive ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                <p className="mt-3 text-xs text-[var(--text-muted)]">
                  {flow.steps.length} passos · Atualizado {formatDate(flow.updatedAt)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
