import type { Metadata } from "next";
import ActorManagementView from "./view";

export const metadata: Metadata = {
  title: "Actor Management & Talent Hub | CINEMA OS",
  description: "Enterprise actor portfolios, showreels, verified filmography, daily call sheets, and remuneration ledger.",
};

export default function ActorPage() {
  return <ActorManagementView />;
}

