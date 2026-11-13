"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  CheckCircle2,
  Clock,
  Film,
  HardHat,
  Headphones,
  Lightbulb,
  Music,
  Paintbrush,
  Plus,
  Scissors,
  ShieldCheck,
  Truck,
  Users,
  Utensils,
  Video,
} from "lucide-react";
import { toast } from "sonner";

interface DepartmentInfo {
  id: string;
  name: string;
  headName: string;
  headTitle: string;
  crewCount: number;
  generalCallTime: string;
  status: "on_set" | "standby" | "wrapped";
  iconName: string;
}

const filmDepartments: DepartmentInfo[] = [
  {
    id: "dept-1",
    name: "Camera Department",
    headName: "Hoyte van Hoytema, ASC",
    headTitle: "Director of Photography",
    crewCount: 18,
    generalCallTime: "06:00 AM",
    status: "on_set",
    iconName: "Camera",
  },
  {
    id: "dept-2",
    name: "Direction & Continuity",
    headName: "Nilo Otero",
    headTitle: "First Assistant Director",
    crewCount: 8,
    generalCallTime: "05:45 AM",
    status: "on_set",
    iconName: "Film",
  },
  {
    id: "dept-3",
    name: "Lighting & Electric",
    headName: "Adam Chambers",
    headTitle: "Chief Lighting Technician / Gaffer",
    crewCount: 22,
    generalCallTime: "05:30 AM",
    status: "on_set",
    iconName: "Lightbulb",
  },
  {
    id: "dept-4",
    name: "Grip & Rigging",
    headName: "Ray Garcia",
    headTitle: "Key Grip",
    crewCount: 16,
    generalCallTime: "05:30 AM",
    status: "on_set",
    iconName: "HardHat",
  },
  {
    id: "dept-5",
    name: "Sound & Audio",
    headName: "Mark Weingarten",
    headTitle: "Production Sound Mixer",
    crewCount: 6,
    generalCallTime: "06:15 AM",
    status: "on_set",
    iconName: "Headphones",
  },
  {
    id: "dept-6",
    name: "Art Department & Props",
    headName: "Nathan Crowley",
    headTitle: "Production Designer",
    crewCount: 28,
    generalCallTime: "05:00 AM",
    status: "on_set",
    iconName: "Paintbrush",
  },
  {
    id: "dept-7",
    name: "Costume & Wardrobe",
    headName: "Jeffrey Kurland",
    headTitle: "Costume Designer",
    crewCount: 14,
    generalCallTime: "05:30 AM",
    status: "on_set",
    iconName: "Scissors",
  },
  {
    id: "dept-8",
    name: "Hair & Makeup (HMU)",
    headName: "Luisa Abel",
    headTitle: "Department Head Makeup",
    crewCount: 12,
    generalCallTime: "05:15 AM",
    status: "on_set",
    iconName: "Scissors",
  },
  {
    id: "dept-9",
    name: "Stunts & Precision",
    headName: "George Cottle",
    headTitle: "Stunt Coordinator",
    crewCount: 15,
    generalCallTime: "08:00 AM",
    status: "standby",
    iconName: "ShieldCheck",
  },
  {
    id: "dept-10",
    name: "Transportation & Fleet",
    headName: "Frank Perez",
    headTitle: "Transportation Coordinator",
    crewCount: 24,
    generalCallTime: "04:30 AM",
    status: "on_set",
    iconName: "Truck",
  },
  {
    id: "dept-11",
    name: "Catering & Craft",
    headName: "Chef Antonio Rossi",
    headTitle: "Head of Craft Services",
    crewCount: 10,
    generalCallTime: "05:00 AM",
    status: "on_set",
    iconName: "Utensils",
  },
  {
    id: "dept-12",
    name: "Post & VFX Supervision",
    headName: "Andrew Jackson",
    headTitle: "VFX Supervisor (On-Set)",
    crewCount: 5,
    generalCallTime: "06:30 AM",
    status: "on_set",
    iconName: "Video",
  },
];

export default function CrewManagementView() {
  const [departments, setDepartments] = useState<DepartmentInfo[]>(filmDepartments);
  const totalCrewCount = departments.reduce((s, d) => s + d.crewCount, 0);

  const handleCheckInAll = (deptName: string) => {
    toast.success(`All crew in ${deptName} marked checked-in on set. Time cards logged.`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Crew & 16 Film Production Departments"
        description="Department rosters, Department Heads (HOD), call times, and daily attendance tracking."
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => toast.info("Opening Crew Roster Dispatch Form...")}
              className="bg-[#167D8D] text-white hover:bg-[#126572] text-xs"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Crew Member
            </Button>
          </div>
        }
      />

      {/* Top Department Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-[#167D8D]">
          <span className="text-2xs font-bold uppercase tracking-wider text-muted-foreground block">
            Total Production Crew
          </span>
          <span className="text-2xl font-bold text-foreground mt-1 block">{totalCrewCount} Active</span>
          <span className="text-2xs text-muted-foreground mt-1 block">Across 16 production units</span>
        </Card>

        <Card className="p-4 border-l-4 border-l-emerald-600">
          <span className="text-2xs font-bold uppercase tracking-wider text-muted-foreground block">
            On-Set Attendance
          </span>
          <span className="text-2xl font-bold text-emerald-600 mt-1 block">98.4% Checked In</span>
          <span className="text-2xs text-success font-medium mt-1 block">Vasquez Rocks Basecamp</span>
        </Card>

        <Card className="p-4 border-l-4 border-l-primary">
          <span className="text-2xs font-bold uppercase tracking-wider text-muted-foreground block">
            Overtime Alert
          </span>
          <span className="text-2xl font-bold text-foreground mt-1 block">0 Overtime Hours</span>
          <span className="text-2xs text-muted-foreground mt-1 block">Shoot operating within 12h turnaround</span>
        </Card>

        <Card className="p-4 border-l-4 border-l-amber-500">
          <span className="text-2xs font-bold uppercase tracking-wider text-muted-foreground block">
            Union Compliance
          </span>
          <span className="text-2xl font-bold text-foreground mt-1 block">IATSE / DGA / Teamsters</span>
          <span className="text-2xs text-success font-medium mt-1 block">Meal penalties: 0 logged</span>
        </Card>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => (
          <Card key={dept.id} className="p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-2.5">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Users className="h-4 w-4" />
                </span>
                <h4 className="text-sm font-bold text-foreground">{dept.name}</h4>
              </div>
              <Badge variant={dept.status === "on_set" ? "success" : "secondary"}>
                {dept.status === "on_set" ? "ON SET" : "STANDBY"}
              </Badge>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Head of Dept:</span>
                <span className="font-semibold text-foreground">{dept.headName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Title:</span>
                <span className="text-muted-foreground">{dept.headTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Department Roster:</span>
                <span className="font-bold text-[#167D8D]">{dept.crewCount} Technicians</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">General Call:</span>
                <span className="font-mono font-semibold text-foreground">{dept.generalCallTime}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-border flex justify-between items-center">
              <span className="text-2xs text-muted-foreground">Check-in confirmed</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCheckInAll(dept.name)}
                className="h-7 text-2xs text-primary border-primary/40 hover:bg-primary/10"
              >
                Log Attendance
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

