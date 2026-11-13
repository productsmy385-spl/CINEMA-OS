import type { Metadata } from "next";
import ManagerConsoleView from "./view";

export const metadata: Metadata = {
  title: "Talent Manager Console | CINEMA OS",
  description: "Manage multiple actors, fast profile switcher, audition pipelines, and agency commission analytics.",
};

export default function ManagerPage() {
  return <ManagerConsoleView />;
}

