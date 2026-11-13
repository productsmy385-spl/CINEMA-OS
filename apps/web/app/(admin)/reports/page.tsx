import type { Metadata } from "next";
import ReportsView from "./view";

export const metadata: Metadata = {
  title: "Production Reports & Analytics | CINEMA OS",
  description: "Executive studio reporting, Daily Production Reports (DPR), script page velocity, and profit margins.",
};

export default function ReportsPage() {
  return <ReportsView />;
}

