export type PlanId = "starter" | "pro" | "business" | "free";

export type SimulationStatus = "queued" | "running" | "completed" | "failed";

export type FailureSeverity = "low" | "medium" | "high" | "critical";

export type MessageRole = "user" | "agent" | "system";

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  planId: PlanId;
  ownerId: string;
  memberIds: string[];
  simulationsThisMonth: number;
  billingPeriodStart: string;
  createdAt: string;
}

export interface FlowStep {
  id: string;
  order: number;
  trigger: string;
  expectedResponse: string;
  riskWeight: number;
}

export interface Flow {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  channel: "whatsapp" | "webchat" | "voice";
  isActive: boolean;
  version: number;
  steps: FlowStep[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Persona {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  traits: string[];
  sampleMessages: string[];
  aggressionLevel: number;
  createdAt: string;
}

export interface ConversationMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  flagged?: boolean;
  failureReason?: string;
}

export interface SimulationFailure {
  id: string;
  stepId?: string;
  severity: FailureSeverity;
  category: string;
  message: string;
  turnIndex: number;
  suggestion: string;
}

export interface SimulationRun {
  id: string;
  workspaceId: string;
  flowId: string;
  flowVersion: number;
  personaId: string;
  status: SimulationStatus;
  riskScore: number;
  passRate: number;
  totalTurns: number;
  failures: SimulationFailure[];
  messages: ConversationMessage[];
  heatmap: number[];
  startedAt: string;
  completedAt?: string;
  regressionDelta?: number;
}

export interface FailureReport {
  id: string;
  workspaceId: string;
  simulationId: string;
  flowId: string;
  flowName: string;
  riskScore: number;
  topFailures: SimulationFailure[];
  createdAt: string;
}

export interface DemoSession {
  userId: string;
  workspaceId: string;
  email: string;
  name: string;
}
