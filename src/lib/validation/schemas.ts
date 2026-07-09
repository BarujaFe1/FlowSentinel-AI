import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Informe um e-mail válido"),
  password: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
});

export const signupSchema = z.object({
  name: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  email: z.string().email("Informe um e-mail válido"),
  password: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
  workspaceName: z.string().min(2, "Nome do workspace é obrigatório"),
});

export const flowSchema = z.object({
  name: z.string().min(2, "Nome do fluxo é obrigatório"),
  description: z.string().optional(),
  channel: z.enum(["whatsapp", "webchat", "voice"]),
  isActive: z.boolean().default(true),
  tags: z.array(z.string()).default([]),
  steps: z
    .array(
      z.object({
        id: z.string(),
        order: z.number(),
        trigger: z.string().min(1),
        expectedResponse: z.string().min(1),
        riskWeight: z.number().min(0).max(1),
      }),
    )
    .min(1, "Adicione ao menos um passo"),
});

export const personaSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  traits: z.array(z.string()).min(1),
  sampleMessages: z.array(z.string()).min(1),
  aggressionLevel: z.number().min(1).max(10),
});

export const simulationRunSchema = z.object({
  flowId: z.string().min(1),
  personaId: z.string().min(1),
  workspaceId: z.string().min(1),
});

export const checkoutSchema = z.object({
  planId: z.enum(["starter", "pro", "business"]),
  workspaceId: z.string().min(1),
  email: z.string().email(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type FlowInput = z.infer<typeof flowSchema>;
export type PersonaInput = z.infer<typeof personaSchema>;
export type SimulationRunInput = z.infer<typeof simulationRunSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
