import type { Metadata } from "next";
import ProjectsView from "./view";

export const metadata: Metadata = {
  title: "Projects & Movie Management | CINEMA OS",
  description: "Enterprise movie slate, production milestones, shooting days, and budget utilization.",
};

export default function ProjectsPage() {
  return <ProjectsView />;
}

