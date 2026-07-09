"use client";

import { useDemo } from "@/lib/demo/provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";

export default function SettingsPage() {
  const { store, workspace, resetDemo } = useDemo();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Settings</h1>
        <p className="text-[var(--text-secondary)]">Configurações do workspace</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workspace</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Nome</Label>
            <Input defaultValue={workspace?.name} />
          </div>
          <div>
            <Label>Slug</Label>
            <Input defaultValue={workspace?.slug} disabled />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Nome</Label>
            <Input defaultValue={store.session?.name} />
          </div>
          <div>
            <Label>E-mail</Label>
            <Input defaultValue={store.session?.email} disabled />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Demo</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-[var(--text-secondary)]">
            Restaurar dados demo da Pizzaria Flow (flows, personas, simulações).
          </p>
          <Button variant="destructive" onClick={resetDemo}>
            Reset demo data
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
