"use client";

import { Download } from "lucide-react";
import { useDemo } from "@/lib/demo/provider";
import { checkEntitlement } from "@/lib/billing/entitlements";
import { Button } from "@/components/ui/button";
import { RiskBadge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { downloadFile, formatDate } from "@/lib/utils";

export default function ReportsPage() {
  const { store, workspace } = useDemo();
  const reports = store.reports.filter((r) => r.workspaceId === workspace?.id);
  const canExport = workspace
    ? checkEntitlement(workspace.planId, {
        workspaces: 1,
        users: 1,
        activeFlows: 1,
        simulationsThisMonth: 0,
      }, "export_report").allowed
    : false;

  function exportJson() {
    if (!canExport) return;
    downloadFile(JSON.stringify(reports, null, 2), "flowsentinel-reports.json", "application/json");
  }

  function exportCsv() {
    if (!canExport) return;
    const header = "id,flowName,riskScore,createdAt,failures\n";
    const rows = reports
      .map(
        (r) =>
          `${r.id},${r.flowName},${r.riskScore},${r.createdAt},${r.topFailures.length}`,
      )
      .join("\n");
    downloadFile(header + rows, "flowsentinel-reports.csv", "text/csv");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Reports</h1>
          <p className="text-[var(--text-secondary)]">Relatórios de falhas e risk ranking</p>
        </div>
        {canExport && (
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={exportJson} className="gap-2">
              <Download className="h-4 w-4" /> JSON
            </Button>
            <Button variant="secondary" size="sm" onClick={exportCsv} className="gap-2">
              <Download className="h-4 w-4" /> CSV
            </Button>
          </div>
        )}
      </div>

      {!canExport && (
        <p className="rounded-lg border border-[var(--accent-amber)]/30 bg-[var(--accent-amber)]/5 p-3 text-sm text-[var(--accent-amber)]">
          Export disponível no plano Pro.{" "}
          <a href="/app/upgrade" className="underline">
            Fazer upgrade
          </a>
        </p>
      )}

      <div className="space-y-3">
        {reports.map((report) => (
          <Card key={report.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">{report.flowName}</p>
                <p className="text-xs text-[var(--text-muted)]">{formatDate(report.createdAt)}</p>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  {report.topFailures.length} falhas principais
                </p>
              </div>
              <RiskBadge score={report.riskScore} />
            </CardContent>
          </Card>
        ))}
        {reports.length === 0 && (
          <p className="text-sm text-[var(--text-muted)]">Nenhum relatório gerado ainda.</p>
        )}
      </div>
    </div>
  );
}
