import type { Metadata } from "next";
import LocationManagementView from "./view";

export const metadata: Metadata = {
  title: "Location Management & Permits | CINEMA OS",
  description: "Manage film shooting locations, tech recce assessments, municipal permits, and basecamp logistics.",
};

export default function LocationPage() {
  return <LocationManagementView />;
}

