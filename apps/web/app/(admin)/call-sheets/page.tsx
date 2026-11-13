import type { Metadata } from "next";
import CallSheetView from "./view";

export const metadata: Metadata = {
  title: "Call Sheet Management | CINEMA OS",
  description: "Enterprise daily film call sheets, actor reporting times, scene breakdown, and acknowledgment tracking.",
};

export default function CallSheetPage() {
  return <CallSheetView />;
}

