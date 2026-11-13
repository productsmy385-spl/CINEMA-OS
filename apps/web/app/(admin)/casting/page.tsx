import type { Metadata } from "next";
import CastingView from "./view";

export const metadata: Metadata = {
  title: "Casting & Role Management | CINEMA OS",
  description: "Character breakdowns, casting notices, audition appointments, and automated role agreements.",
};

export default function CastingPage() {
  return <CastingView />;
}

