import type { Metadata } from "next";
import ProductionHouseView from "./view";

export const metadata: Metadata = {
  title: "Production House Workspace | CINEMA OS",
  description: "Enterprise film studio workspace, active film slate, departmental coordination, and production budgets.",
};

export default function ProductionPage() {
  return <ProductionHouseView />;
}

