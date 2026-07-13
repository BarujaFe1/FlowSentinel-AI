# Changelog — evidence / regression pass

## 2026-07-13 — lab evidence pack

### Added
- Deterministic scoring module (`src/lib/demo/scoring.ts`)
- Adversarial scenario suite (`src/lib/demo/adversarial-scenarios.ts`)
- Agent builds in demo store + seed (vulnerable vs guardrail)
- Real regression delta vs baseline simulation
- In-app case study `/app/cases/pre-prod-refund`
- Docs: DEMO_GUIDE, CASE_PRE_PROD_REFUND, SCREENSHOTS, PORTFOLIO_HANDOFF
- Tests: `tests/scoring-adversarial.test.ts`

### Fixed
- Login no longer force-reseeds (preserves lab data)
- Mock checkout applies `?plan=` on billing page
- Fake random `regressionDelta` removed
- Heatmap labeled as risk weight (not empirical fail %)
- Simulation detail hydrate + honest regression copy

### Changed
- Simulations UI: scenario + agent build selectors
- Seed metrics aligned with scoring helpers
- README reframed for honest lab/portfolio claims
