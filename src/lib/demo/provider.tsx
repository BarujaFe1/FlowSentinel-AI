"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { DemoStore } from "@/lib/demo/store";
import { getDemoStore, hasDemoStore, saveDemoStore } from "@/lib/demo/store";
import { ensureDemoData, seedDemoData } from "@/lib/demo/seed";
import type { FailureReport, Flow, Persona, SimulationRun, Workspace } from "@/lib/types";

interface DemoContextValue {
  store: DemoStore;
  hydrated: boolean;
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
  updateWorkspace: (workspace: Workspace) => void;
  setSession: (session: DemoStore["session"]) => void;
  resetDemo: () => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<DemoStore>(() => createEmptyClientStore());
  const [hydrated, setHydrated] = useState(false);

  const refresh = useCallback(() => {
    setStore(getDemoStore());
  }, []);

  useEffect(() => {
    const data = ensureDemoData();
    setStore(data);
    setHydrated(true);
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
      hydrated,
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
        const flow = store.flows.find((f) => f.id === sim.flowId);
        const report: FailureReport = {
          id: `report-${sim.id}`,
          workspaceId: sim.workspaceId,
          simulationId: sim.id,
          flowId: sim.flowId,
          flowName: flow?.name ?? "Flow",
          riskScore: sim.riskScore,
          topFailures: sim.failures.slice(0, 3),
          createdAt: sim.completedAt ?? sim.startedAt,
        };
        const workspaces = store.workspaces.map((w) =>
          w.id === sim.workspaceId
            ? { ...w, simulationsThisMonth: w.simulationsThisMonth + 1 }
            : w,
        );
        persist({
          ...store,
          workspaces,
          simulations: [sim, ...store.simulations],
          reports: [report, ...store.reports],
        });
      },
      updateSimulation: (sim) => {
        persist({
          ...store,
          simulations: store.simulations.map((s) => (s.id === sim.id ? sim : s)),
        });
      },
      updateWorkspace: (ws) => {
        persist({
          ...store,
          workspaces: store.workspaces.map((w) => (w.id === ws.id ? ws : w)),
        });
      },
      setSession: (session) => {
        persist({ ...store, session });
      },
      resetDemo: () => {
        persist(seedDemoData());
      },
    }),
    [store, hydrated, workspace, refresh, persist],
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
    agentBuilds: [],
    session: null,
    webhookEvents: [],
  };
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used within DemoProvider");
  return ctx;
}

export { hasDemoStore };
