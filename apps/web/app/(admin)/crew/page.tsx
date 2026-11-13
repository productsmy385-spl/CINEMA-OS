import type { Metadata } from "next";
import CrewManagementView from "./view";

export const metadata: Metadata = {
  title: "Crew & Department Management | CINEMA OS",
  description: "Manage 16 film departments, heads of department (HOD), crew rosters, call times, and union compliance.",
};

export default function CrewPage() {
  return <CrewManagementView />;
}

