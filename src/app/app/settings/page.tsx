"use client";

import { useEffect, useState } from "react";
import { useDemo } from "@/lib/demo/provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";

export default function SettingsPage() {
  const { store, workspace, updateWorkspace, setSession, resetDemo } = useDemo();
  const [wsName, setWsName] = useState(workspace?.name ?? "");
  const [userName, setUserName] = useState(store.session?.name ?? "");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setWsName(workspace?.name ?? "");
  }, [workspace?.name]);

  useEffect(() => {
    setUserName(store.session?.name ?? "");
  }, [store.session?.name]);

  function save() {
    if (workspace) {
      updateWorkspace({ ...workspace, name: wsName.trim() || workspace.name });
    }
    if (store.session) {
      setSession({ ...store.session, name: userName.trim() || store.session.name });
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Settings</h1>
        <p className="text-[var(--text-secondary)]">Configurações do workspace (demo local)</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workspace</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="ws-name">Nome</Label>
            <Input
              id="ws-name"
              value={wsName}
              onChange={(e) => setWsName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="ws-slug">Slug</Label>
            <Input id="ws-slug" value={workspace?.slug ?? ""} disabled readOnly />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="user-name">Nome</Label>
            <Input
              id="user-name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="user-email">E-mail</Label>
            <Input id="user-email" value={store.session?.email ?? ""} disabled readOnly />
          </div>
          <Button onClick={save}>{saved ? "Salvo" : "Salvar alterações"}</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Demo</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-[var(--text-secondary)]">
            Restaurar dados demo da Pizzaria Flow (flows, personas, simulações). Isso sobrescreve o
            localStorage atual.
          </p>
          <Button variant="destructive" onClick={resetDemo}>
            Reset demo data
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
