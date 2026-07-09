"use client";

import { useState } from "react";
import { Users, Plus } from "lucide-react";
import { useDemo } from "@/lib/demo/provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input, Label, Textarea } from "@/components/ui/input";

export default function PersonasPage() {
  const { store, workspace, addPersona, deletePersona } = useDemo();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const personas = store.personas.filter((p) => p.workspaceId === workspace?.id);

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!workspace) return;
    addPersona({
      workspaceId: workspace.id,
      name,
      description,
      traits: ["custom"],
      sampleMessages: ["Olá, preciso de ajuda"],
      aggressionLevel: 5,
    });
    setName("");
    setDescription("");
    setShowForm(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Personas</h1>
          <p className="text-[var(--text-secondary)]">Perfis de clientes para simulação</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Nova persona
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <Label>Nome</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <Label>Descrição</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
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

      {personas.length === 0 ? (
        <EmptyState
          icon={<Users className="h-12 w-12" />}
          title="Nenhuma persona"
          description="Crie personas para simular diferentes tipos de clientes."
          actionLabel="Criar persona"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {personas.map((persona) => (
            <Card key={persona.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold">{persona.name}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (confirm("Excluir persona?")) deletePersona(persona.id);
                    }}
                  >
                    ×
                  </Button>
                </div>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">{persona.description}</p>
                <div className="mt-4 flex flex-wrap gap-1">
                  {persona.traits.map((t) => (
                    <Badge key={t} variant="default">
                      {t}
                    </Badge>
                  ))}
                </div>
                <p className="mt-3 text-xs text-[var(--text-muted)]">
                  Agressividade: {persona.aggressionLevel}/10
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
