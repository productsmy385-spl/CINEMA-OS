import type { Metadata } from "next";
import ManagerCalendarView from "./view";

export const metadata: Metadata = {
  title: "Talent Work Schedules & Calendar Palette | CINEMA OS",
  description:
    "Interactive color-coded talent work schedules, principal photography calls, director pitches, and wardrobe fittings for talent managers.",
};

export default function ManagerCalendarPage() {
  return <ManagerCalendarView />;
}

