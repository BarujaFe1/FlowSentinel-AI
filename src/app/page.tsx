"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, FlaskConical, GitBranch, Shield, Zap } from "lucide-react";
import { MarketingNav, MarketingFooter } from "@/components/layout/marketing-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: GitBranch,
    title: "Flow CRUD",
    description: "Mapeie cada passo do seu agente WhatsApp com pesos de risco por etapa.",
  },
  {
    icon: FlaskConical,
    title: "Simulação com Personas",
    description: "Teste contra clientes ansiosos, indecisos e reclamões antes do deploy.",
  },
  {
    icon: Shield,
    title: "Risk Score",
    description: "Score de risco, heatmap de falhas e detecção de regressão entre versões.",
  },
  {
    icon: Zap,
    title: "Replay & Reports",
    description: "Replay conversacional frame-a-frame e export JSON/CSV para o time.",
  },
];

export default function LandingPage() {
  return (
    <div className="gradient-hero min-h-screen">
      <MarketingNav />
      <main className="mx-auto max-w-6xl px-4 pt-28 sm:px-6 sm:pt-32">
        <section className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="mb-4 text-sm font-medium uppercase tracking-widest text-[var(--accent-teal)]">
              QA Lab for AI Support Agents
            </p>
            <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
              Simule falhas
              <br />
              <span className="text-[var(--accent-amber)]">antes do cliente</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--text-secondary)]">
              FlowSentinel AI é o laboratório de QA para agentes WhatsApp e suporte com IA.
              Simule conversas, ranqueie riscos e reproduza falhas — tudo antes do deploy.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/signup">
                <Button size="lg" className="gap-2">
                  Começar demo grátis <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/app">
                <Button variant="secondary" size="lg">
                  Ver demo Pizzaria Flow
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-16 max-w-4xl"
          >
            <Card className="overflow-hidden border-[var(--border)]">
              <CardContent className="p-0">
                <div className="grid gap-px bg-[var(--border)] sm:grid-cols-3">
                  {[
                    { label: "Risk Score", value: "34", sub: "Pedido Pizza v3", color: "text-[var(--success)]" },
                    { label: "Falhas críticas", value: "1", sub: "Reclamação v2", color: "text-[var(--risk-critical)]" },
                    { label: "Simulações", value: "12", sub: "Este mês", color: "text-[var(--accent-amber)]" },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-[var(--bg-surface)] p-6 text-left">
                      <p className="text-xs uppercase tracking-wider text-[var(--text-muted)]">{stat.label}</p>
                      <p className={`font-display mt-1 text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                      <p className="text-xs text-[var(--text-secondary)]">{stat.sub}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        <section id="features" className="mt-32">
          <h2 className="font-display text-center text-3xl font-bold">Tudo que seu agente precisa</h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-[var(--text-secondary)]">
            Do mapeamento de fluxos ao replay de falhas — um QA lab completo para times de suporte.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full transition-colors hover:border-[var(--accent-amber)]/30">
                  <CardContent className="p-6">
                    <f.icon className="h-8 w-8 text-[var(--accent-amber)]" />
                    <h3 className="font-display mt-4 text-lg font-semibold">{f.title}</h3>
                    <p className="mt-2 text-sm text-[var(--text-secondary)]">{f.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mt-32 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-8 text-center sm:p-12">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Pronto para testar seu agente?</h2>
          <p className="mt-3 text-[var(--text-secondary)]">
            Demo completa com cenário Pizzaria Flow — sem credenciais necessárias.
          </p>
          <Link href="/signup" className="mt-6 inline-block">
            <Button size="lg">Criar conta grátis</Button>
          </Link>
        </section>
      </main>
      <div className="mt-24">
        <MarketingFooter />
      </div>
    </div>
  );
}
