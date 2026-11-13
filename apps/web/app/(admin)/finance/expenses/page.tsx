import type { Metadata } from "next";
import ExpensesView from "./view";

export const metadata: Metadata = {
  title: "Production Expenses & Approvals | CINEMA OS",
  description: "Review receipts, petty cash, vendor disbursements, and multi-tier line producer approvals.",
};

export default function ExpensesPage() {
  return <ExpensesView />;
}

