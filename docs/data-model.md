# Data Model

## Core Entities

### Workspace
Multi-tenant container. Has plan, billing period, simulation usage counter.

### Flow
Conversation flow definition with versioned steps. Each step has trigger, expected response, and risk weight.

### Persona
Simulated customer profile with traits, sample messages, and aggression level (1–10).

### SimulationRun
Execution of a flow against a persona. Produces risk score, pass rate, messages, failures, and heatmap.

### FailureReport
Aggregated report from a simulation with top failures and risk ranking.

## Relationships

```
Workspace 1──* Flow
Workspace 1──* Persona
Workspace 1──* SimulationRun
Flow 1──* FlowStep
SimulationRun 1──* ConversationMessage
SimulationRun 1──* SimulationFailure
SimulationRun 1──1 FailureReport
```

## Plan Limits

| Feature | Starter | Pro | Business |
|---------|---------|-----|----------|
| Workspaces | 1 | 3 | ∞ |
| Users | 3 | 10 | ∞ |
| Active flows | 5 | 20 | ∞ |
| Simulations/month | 50 | 500 | ∞ |
| History | 7 days | 90 days | Full |
| Export | ✗ | ✓ | ✓ |
| Automations | ✗ | ✓ | ✓ |

## Demo Seed: Pizzaria Flow

- **Flows**: Pedido de Pizza WhatsApp (6 steps), Reclamação e Reembolso (3 steps)
- **Personas**: Cliente Ansioso, Indeciso, Reclamão
- **Simulations**: 2 completed runs with realistic failures

See `supabase/migrations/001_init.sql` for production schema.
