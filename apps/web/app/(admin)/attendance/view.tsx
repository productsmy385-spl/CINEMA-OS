"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Download,
  Search,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";

interface AttendanceRecord {
  id: string;
  name: string;
  role: string;
  department: string;
  callTime: string;
  arrivalTime: string;
  wrapTime: string;
  status: "on_time" | "late" | "on_set" | "wrapped";
  overtimeMinutes: number;
}

const initialAttendance: AttendanceRecord[] = [
  {
    id: "ATT-01",
    name: "Marcus Sterling",
    role: "Lead Actor (Thorne)",
    department: "Cast",
    callTime: "07:15 AM",
    arrivalTime: "07:05 AM",
    wrapTime: "Pending Wrap",
    status: "on_set",
    overtimeMinutes: 0,
  },
  {
    id: "ATT-02",
    name: "Elena Rostova",
    role: "Lead Actress (Elena)",
    department: "Cast",
    callTime: "07:15 AM",
    arrivalTime: "07:10 AM",
    wrapTime: "Pending Wrap",
    status: "on_set",
    overtimeMinutes: 0,
  },
  {
    id: "ATT-03",
    name: "Hoyte van Hoytema",
    role: "Director of Photography",
    department: "Camera",
    callTime: "06:00 AM",
    arrivalTime: "05:50 AM",
    wrapTime: "Pending Wrap",
    status: "on_set",
    overtimeMinutes: 0,
  },
  {
    id: "ATT-04",
    name: "Ray Garcia",
    role: "Key Grip",
    department: "Grip",
    callTime: "05:30 AM",
    arrivalTime: "05:40 AM",
    wrapTime: "Pending Wrap",
    status: "late",
    overtimeMinutes: 0,
  },
  {
    id: "ATT-05",
    name: "Mark Weingarten",
    role: "Sound Mixer",
    department: "Sound",
    callTime: "06:15 AM",
    arrivalTime: "06:10 AM",
    wrapTime: "Pending Wrap",
    status: "on_set",
    overtimeMinutes: 0,
  },
];

export default function AttendanceView() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(initialAttendance);
  const [search, setSearch] = useState("");

  const handleMarkArrival = (id: string, name: string) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setAttendance(
      attendance.map((a) => (a.id === id ? { ...a, arrivalTime: timeNow, status: "on_set" } : a))
    );
    toast.success(`Check-in logged for ${name} at ${timeNow}.`);
  };

  const filtered = attendance.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.department.toLowerCase().includes(search.toLowerCase()) ||
      a.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Daily Production Attendance & Call Times"
        description="Actor and crew check-in, actual arrival vs scheduled call time, late arrival alerts, and union overtime logging."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.success("Daily Production Report (DPR) Attendance Summary exported.")}
              className="text-xs"
            >
              <Download className="h-3.5 w-3.5 mr-1" />
              Export DPR Attendance
            </Button>
          </div>
        }
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base font-bold text-foreground">
              Day 29 Call Time Check-In Roster
            </CardTitle>
            <CardDescription className="text-xs">
              Verified on-set arrival logging for SAG-AFTRA, DGA, and IATSE union reporting.
            </CardDescription>
          </div>
          <div className="relative w-64">
            <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search personnel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8 pl-8 pr-3 text-xs rounded-lg border border-border bg-background"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-muted-foreground">
                  <th className="py-2.5 px-3 font-semibold">Name</th>
                  <th className="py-2.5 px-3 font-semibold">Department</th>
                  <th className="py-2.5 px-3 font-semibold">Production Role</th>
                  <th className="py-2.5 px-3 font-semibold">Scheduled Call</th>
                  <th className="py-2.5 px-3 font-semibold">Actual Arrival</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((att) => (
                  <tr key={att.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-3 font-bold text-foreground">{att.name}</td>
                    <td className="py-3 px-3">
                      <span className="rounded bg-muted px-2 py-0.5 text-2xs font-semibold">
                        {att.department}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-muted-foreground">{att.role}</td>
                    <td className="py-3 px-3 font-mono font-semibold text-foreground">{att.callTime}</td>
                    <td className="py-3 px-3 font-mono font-bold text-[#167D8D]">{att.arrivalTime}</td>
                    <td className="py-3 px-3">
                      <Badge variant={att.status === "late" ? "warning" : "success"}>
                        {att.status === "late" ? "LATE (+10m)" : "CHECKED IN"}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleMarkArrival(att.id, att.name)}
                        className="h-7 text-2xs text-primary hover:bg-primary/10"
                      >
                        Re-log Time
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

