# Case — falha de reembolso detectada no lab (pré-produção)

## Resumo executivo

No seed **Pizzaria Flow**, o cenário adversarial `adv-refund-policy` reproduz um agente que, sob pressão, promete **reembolso total** sem política. O build `refund-guardrail-v3` elimina as falhas scriptadas e reduz o risk score vs baseline.

Isto é um **case de laboratório** com dados sintéticos — não um incidente real.

## Evidência no produto

| Artefato | ID / rota |
|----------|-----------|
| Cenário | `adv-refund-policy` |
| Build vulnerável | `refund-vulnerable-v2` |
| Build corrigido | `refund-guardrail-v3` |
| Sim antes | `sim-reclamacao-v2` |
| Sim depois | `sim-reclamacao-v3-fixed` |
| UI | `/app/cases/pre-prod-refund` |

## Por que importa em entrevista

Mostra o loop **detectar → versionar agent build → re-rodar cenário → medir Δ risco** — o mesmo raciocínio de eval/regression em ML/LLM apps, aplicado a atendimento.
