import type {
  DemoSession,
  FailureReport,
  Flow,
  Persona,
  SimulationRun,
  User,
  Workspace,
  AgentBuild,
} from "@/lib/types";

export interface DemoStore {
  users: User[];
  workspaces: Workspace[];
  flows: Flow[];
  personas: Persona[];
  simulations: SimulationRun[];
  reports: FailureReport[];
  agentBuilds: AgentBuild[];
  session: DemoSession | null;
  webhookEvents: string[];
}

export const DEMO_STORAGE_KEY = "flowsentinel-demo-store";

function createId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function hasDemoStore(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(DEMO_STORAGE_KEY) !== null;
}

export function createEmptyStore(): DemoStore {
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

export function getDemoStore(): DemoStore {
  if (typeof window === "undefined") {
    return createEmptyStore();
  }
  try {
    const raw = localStorage.getItem(DEMO_STORAGE_KEY);
    if (!raw) return createEmptyStore();
    const parsed = JSON.parse(raw) as DemoStore;
    // Migrate older stores missing agentBuilds
    if (!Array.isArray(parsed.agentBuilds)) {
      parsed.agentBuilds = [];
    }
    return parsed;
  } catch {
    return createEmptyStore();
  }
}

export function saveDemoStore(store: DemoStore): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(store));
}

export function resetDemoStore(): DemoStore {
  const store = createEmptyStore();
  saveDemoStore(store);
  return store;
}

export function generateId(): string {
  return createId();
}

export function getServerDemoStore(): DemoStore {
  return globalThis.__flowsentinelStore ?? createEmptyStore();
}

export function setServerDemoStore(store: DemoStore): void {
  globalThis.__flowsentinelStore = store;
}

declare global {
  var __flowsentinelStore: DemoStore | undefined;
}
