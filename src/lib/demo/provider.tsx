"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { DemoStore } from "@/lib/demo/store";
import { getDemoStore, saveDemoStore } from "@/lib/demo/store";
import { ensureDemoData, seedDemoData } from "@/lib/demo/seed";
import type { Flow, Persona, SimulationRun, Workspace } from "@/lib/types";

interface DemoContextValue {
  store: DemoStore;
  workspace: Workspace | null;
  refresh: () => void;
  updateFlow: (flow: Flow) => void;
  deleteFlow: (id: string) => void;
  addFlow: (flow: Omit<Flow, "id" | "createdAt" | "updatedAt">) => Flow;
  updatePersona: (persona: Persona) => void;
  addPersona: (persona: Omit<Persona, "id" | "createdAt">) => Persona;
  deletePersona: (id: string) => void;
  addSimulation: (sim: SimulationRun) => void;
  updateSimulation: (sim: SimulationRun) => void;
  setSession: (session: DemoStore["session"]) => void;
  resetDemo: () => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<DemoStore>(() => createEmptyClientStore());

  const refresh = useCallback(() => {
    setStore(getDemoStore());
  }, []);

  useEffect(() => {
    const data = ensureDemoData();
    setStore(data);
  }, []);

  const persist = useCallback((next: DemoStore) => {
    saveDemoStore(next);
    setStore(next);
  }, []);

  const workspace = useMemo(
    () => store.workspaces.find((w) => w.id === store.session?.workspaceId) ?? null,
    [store],
  );

  const value = useMemo<DemoContextValue>(
    () => ({
      store,
      workspace,
      refresh,
      updateFlow: (flow) => {
        const next = { ...store, flows: store.flows.map((f) => (f.id === flow.id ? flow : f)) };
        persist(next);
      },
      deleteFlow: (id) => {
        persist({ ...store, flows: store.flows.filter((f) => f.id !== id) });
      },
      addFlow: (flowData) => {
        const now = new Date().toISOString();
        const flow: Flow = {
          ...flowData,
          id: `flow-${Date.now()}`,
          createdAt: now,
          updatedAt: now,
        };
        persist({ ...store, flows: [...store.flows, flow] });
        return flow;
      },
      updatePersona: (persona) => {
        persist({
          ...store,
          personas: store.personas.map((p) => (p.id === persona.id ? persona : p)),
        });
      },
      addPersona: (personaData) => {
        const persona: Persona = {
          ...personaData,
          id: `persona-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        persist({ ...store, personas: [...store.personas, persona] });
        return persona;
      },
      deletePersona: (id) => {
        persist({ ...store, personas: store.personas.filter((p) => p.id !== id) });
      },
      addSimulation: (sim) => {
        persist({ ...store, simulations: [sim, ...store.simulations] });
      },
      updateSimulation: (sim) => {
        persist({
          ...store,
          simulations: store.simulations.map((s) => (s.id === sim.id ? sim : s)),
        });
      },
      setSession: (session) => {
        persist({ ...store, session });
      },
      resetDemo: () => {
        persist(seedDemoData());
      },
    }),
    [store, workspace, refresh, persist],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

function createEmptyClientStore(): DemoStore {
  return {
    users: [],
    workspaces: [],
    flows: [],
    personas: [],
    simulations: [],
    reports: [],
    session: null,
    webhookEvents: [],
  };
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used within DemoProvider");
  return ctx;
}
