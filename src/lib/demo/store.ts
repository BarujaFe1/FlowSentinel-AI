import type {
  DemoSession,
  FailureReport,
  Flow,
  Persona,
  SimulationRun,
  User,
  Workspace,
} from "@/lib/types";

export interface DemoStore {
  users: User[];
  workspaces: Workspace[];
  flows: Flow[];
  personas: Persona[];
  simulations: SimulationRun[];
  reports: FailureReport[];
  session: DemoSession | null;
  webhookEvents: string[];
}

const STORAGE_KEY = "flowsentinel-demo-store";

function createId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function createEmptyStore(): DemoStore {
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

export function getDemoStore(): DemoStore {
  if (typeof window === "undefined") {
    return createEmptyStore();
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createEmptyStore();
    return JSON.parse(raw) as DemoStore;
  } catch {
    return createEmptyStore();
  }
}

export function saveDemoStore(store: DemoStore): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
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
  // eslint-disable-next-line no-var
  var __flowsentinelStore: DemoStore | undefined;
}
