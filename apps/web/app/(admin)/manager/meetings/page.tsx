import type { Metadata } from "next";
import ManagerMeetingsView from "./view";

export const metadata: Metadata = {
  title: "Meetings & Pitch Coordination | CINEMA OS",
  description: "Arrange director script readings, producer pitch sessions, chemistry reads, and brand endorsement meetings for actors.",
};

export default function MeetingsPage() {
  return <ManagerMeetingsView />;
}

