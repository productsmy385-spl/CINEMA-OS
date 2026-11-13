import type { Metadata } from "next";
import ProductionBudgetsView from "./view";

export const metadata: Metadata = {
  title: "Production Budgets & Accounting | CINEMA OS",
  description: "GAAP film production budget management, Above-The-Line/Below-The-Line variances, and cash flow.",
};

export default function BudgetsPage() {
  return <ProductionBudgetsView />;
}

