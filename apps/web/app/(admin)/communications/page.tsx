import type { Metadata } from "next";
import CommunicationsView from "./view";

export const metadata: Metadata = {
  title: "Communications Hub | CINEMA OS",
  description: "Real-time film production messaging, department chat channels, announcements, and video conferencing integrations.",
};

export default function CommunicationsPage() {
  return <CommunicationsView />;
}

