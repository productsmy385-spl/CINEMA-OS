"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, ShieldCheck, Lock, FileCheck, DollarSign, Clock } from "lucide-react";

export default function AuditLogsView() {
  const auditEntries = [
    {
      id: "AUD-9912",
      action: "CALL_SHEET_REVISED",
      user: "Nilo Otero (1st AD)",
      entity: "CallSheet CR-2026-D29 v2",
      details: "General call shifted from 06:30 AM to 07:00 AM due to wind gust advisory. Dispatched to 42 recipients.",
      ip: "172.56.21.90",
      time: "2026-11-13 19:10:44 PST",
      status: "COMPLIANT",
    },
    {
      id: "AUD-9911",
      action: "CONTRACT_EXECUTED",
      user: "Marcus Sterling (Lead Actor)",
      entity: "Agreement DOC-2026-01",
      details: "Performer agreement electronically signed with cryptographic device fingerprint.",
      ip: "108.48.112.5",
      time: "2026-11-13 18:32:15 PST",
      status: "VERIFIED",
    },
    {
      id: "AUD-9910",
      action: "EXPENSE_APPROVED",
      user: "David Ellison (UPM)",
      entity: "Expense EXP-8891 ($48,500)",
      details: "Camera equipment rental from Panavision Hollywood approved against Account Code ATL-1010.",
      ip: "192.168.1.45",
      time: "2026-11-13 17:15:20 PST",
      status: "APPROVED",
    },
    {
      id: "AUD-9909",
      action: "TENANT_ROLE_CHECK",
      user: "System RBAC Guard",
      entity: "Organization Vance Global Pictures",
      details: "Verified zero-cross-tenant boundary for Super Admin session.",
      ip: "10.0.0.1",
      time: "2026-11-13 16:50:00 PST",
      status: "PROTECTED",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs & Compliance Ledger"
        description="Immutable, tamper-evident security audit trail tracking call sheet dispatches, contract executions, and financial approvals."
      />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-foreground">System Audit Stream</CardTitle>
          <CardDescription className="text-xs">
            Append-only event journal recorded with verified IP addresses and cryptographic hashes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-muted-foreground">
                  <th className="py-2.5 px-3 font-semibold">Event ID</th>
                  <th className="py-2.5 px-3 font-semibold">Action</th>
                  <th className="py-2.5 px-3 font-semibold">Authorized Actor</th>
                  <th className="py-2.5 px-3 font-semibold">Affected Resource</th>
                  <th className="py-2.5 px-3 font-semibold">Event Summary</th>
                  <th className="py-2.5 px-3 font-semibold">Timestamp</th>
                  <th className="py-2.5 px-3 font-semibold">Integrity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {auditEntries.map((a) => (
                  <tr key={a.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-muted-foreground">{a.id}</td>
                    <td className="py-3 px-3">
                      <span className="rounded bg-primary/10 px-2 py-0.5 text-2xs font-bold text-primary font-mono">
                        {a.action}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-foreground">{a.user}</td>
                    <td className="py-3 px-3 font-semibold text-foreground">{a.entity}</td>
                    <td className="py-3 px-3 text-muted-foreground max-w-sm">{a.details}</td>
                    <td className="py-3 px-3 font-mono text-2xs text-muted-foreground">{a.time}</td>
                    <td className="py-3 px-3">
                      <Badge variant="success" className="text-2xs font-bold">
                        {a.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

