import type { Metadata } from "next";
import AuditLogsView from "./view";

export const metadata: Metadata = {
  title: "Audit & Compliance Ledger | CINEMA OS",
  description: "Tamper-evident activity logs, call sheet dispatches, contract executions, and financial audit trails.",
};

export default function AuditPage() {
  return <AuditLogsView />;
}

