import type { Metadata } from "next";
import AttendanceView from "./view";

export const metadata: Metadata = {
  title: "Daily Attendance & Wrap Logs | CINEMA OS",
  description: "Cast and crew check-in, scheduled call vs arrival verification, and daily production report logs.",
};

export default function AttendancePage() {
  return <AttendanceView />;
}

