"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCinema } from "@/lib/cinema-context";
import {
  Calendar,
  CheckCircle2,
  Clapperboard,
  Clock,
  DollarSign,
  FileText,
  Film,
  FolderLock,
  Hospital,
  MapPin,
  MessageSquare,
  Navigation,
  Plus,
  Send,
  Sparkles,
  TrendingUp,
  User,
  UserCheck,
  Users,
  Video,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export function DashboardContent() {
  const { actors, selectedActor, setSelectedActor, meetings, shootSchedules, locations, dispatchedAlerts } = useCinema();

  const totalRosterGross = actors.reduce((sum, a) => sum + a.standardDayRate * 20, 0); // Est. monthly production volume
  const managerCommission = totalRosterGross * 0.1; // 10% standard talent management commission

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="CINEMA OS — Talent & Production Command Station"
        description="Integrated operating system connecting talent managers, actors, and production houses for meetings, call sheets, and location dispatches."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/manager/meetings">
              <Button size="sm" variant="outline" className="text-xs">
                <Video className="h-3.5 w-3.5 mr-1 text-[#167D8D]" />
                Arrange Meeting
              </Button>
            </Link>
            <Link href="/call-sheets">
              <Button size="sm" className="bg-[#167D8D] text-white hover:bg-[#126572] text-xs">
                <Clapperboard className="h-3.5 w-3.5 mr-1.5" />
                Live Call Sheet (Day 29)
              </Button>
            </Link>
          </div>
        }
      />

      {/* Live Operational Status Banner */}
      <div className="rounded-xl border border-[#167D8D]/50 bg-gradient-to-r from-[#071B2B] via-[#0B253A] to-[#071B2B] p-5 text-white shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#167D8D] text-white shadow-md">
              <Clapperboard className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-tight">PRINCIPAL PHOTOGRAPHY LIVE:</span>
                <span className="rounded bg-[#B9E4E8] px-2 py-0.5 text-2xs font-extrabold text-[#071B2B]">
                  CHRONO RAIDERS (DAY 29 OF 52)
                </span>
                <span className="rounded bg-success/20 px-2 py-0.5 text-2xs font-semibold text-success">
                  MAIN UNIT ON SCHEDULE
                </span>
              </div>
              <p className="mt-1 text-xs text-[#B9E4E8]/80">
                Location: Vasquez Rocks Natural Area Park • General Call: 06:30 AM • Est. Wrap: 07:30 PM
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/call-sheets">
              <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-xs">
                Review Scenes & Cast Calls
              </Button>
            </Link>
            <Link href="/manager">
              <Button size="sm" className="bg-[#167D8D] text-white hover:bg-[#126572] text-xs">
                Manager Console &rarr;
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Talent Management KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-[#167D8D]">
          <span className="text-2xs font-bold uppercase tracking-wider text-muted-foreground block">
            Represented Talent Roster
          </span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-bold text-foreground">{actors.length} Actors</span>
            <Users className="h-5 w-5 text-[#167D8D]" />
          </div>
          <span className="text-2xs text-success font-medium mt-1 block">Active talent representation</span>
        </Card>

        <Card className="p-4 border-l-4 border-l-emerald-600">
          <span className="text-2xs font-bold uppercase tracking-wider text-muted-foreground block">
            Arranged Meetings & Reads
          </span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-bold text-emerald-600">{meetings.length} Scheduled</span>
            <Video className="h-5 w-5 text-emerald-600" />
          </div>
          <span className="text-2xs text-muted-foreground mt-1 block">Directorial & pitch sessions</span>
        </Card>

        <Card className="p-4 border-l-4 border-l-[#071B2B]">
          <span className="text-2xs font-bold uppercase tracking-wider text-muted-foreground block">
            On-Set Shoots Today
          </span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-bold text-foreground">
              {actors.filter((a) => a.status === "on_set").length} Actors On Set
            </span>
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <span className="text-2xs text-success font-medium mt-1 block">Call times acknowledged</span>
        </Card>

        <Card className="p-4 border-l-4 border-l-amber-500">
          <span className="text-2xs font-bold uppercase tracking-wider text-muted-foreground block">
            Agency Commission (10%)
          </span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-bold text-foreground font-mono">
              ${managerCommission.toLocaleString()}
            </span>
            <DollarSign className="h-5 w-5 text-amber-500" />
          </div>
          <span className="text-2xs text-muted-foreground mt-1 block">Monthly talent fee projection</span>
        </Card>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Arranged Meetings & Shoot Schedules */}
        <div className="lg:col-span-7 space-y-6">
          {/* Upcoming Arranged Meetings */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold text-foreground">
                  Arranged Meetings, Pitches & Script Reads
                </CardTitle>
                <CardDescription className="text-xs">
                  Director script readings, chemistry reads, and studio meetings arranged by personal managers.
                </CardDescription>
              </div>
              <Link href="/manager/meetings">
                <Button size="sm" variant="outline" className="text-xs">
                  View All ({meetings.length}) &rarr;
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {meetings.map((mtg) => (
                  <div
                    key={mtg.id}
                    className="p-3.5 rounded-xl border border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">{mtg.title}</span>
                        <Badge
                          variant={mtg.status === "Confirmed" ? "success" : "warning"}
                          className="text-2xs"
                        >
                          {mtg.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-2xs text-[#167D8D] font-semibold">
                        Actor: {mtg.actorName} • With: {mtg.withWhom}
                      </p>
                      <p className="text-2xs text-muted-foreground">{mtg.locationOrLink}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono font-bold text-[#167D8D] block">{mtg.dateTime}</span>
                      <span className="text-2xs text-muted-foreground font-medium">{mtg.format}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Today's Shoot Call Times */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold text-foreground">
                  Coordinated Actor Call Times (Day 29)
                </CardTitle>
                <CardDescription className="text-xs">
                  Pickup times, HMU call times, and reporting status for represented actors.
                </CardDescription>
              </div>
              <Link href="/call-sheets">
                <Button size="sm" variant="outline" className="text-xs">
                  Full Call Sheet &rarr;
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {shootSchedules.map((sch) => (
                  <div
                    key={sch.id}
                    className="p-3.5 rounded-xl border border-border bg-card flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-foreground">{sch.actorName}</p>
                      <p className="text-2xs text-muted-foreground">
                        {sch.project} • Role: {sch.characterName}
                      </p>
                      <p className="text-2xs text-primary font-mono mt-0.5">
                        Driver: {sch.assignedDriver} ({sch.driverPhone})
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase block font-semibold">
                          Pickup / On-Set
                        </span>
                        <span className="font-mono font-bold text-[#167D8D]">
                          {sch.pickupTime} &bull; {sch.onSetTime}
                        </span>
                      </div>
                      <Badge variant={sch.status === "acknowledged" ? "success" : "warning"} className="text-2xs">
                        {sch.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Location Update Station & Live Alerts */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Location Bulletin */}
          <Card>
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-sm font-bold text-foreground flex items-center justify-between">
                <span>Active Shoot Location & GPS</span>
                <span className="text-2xs text-primary font-mono">Day 29</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 text-xs">
              <div>
                <h4 className="font-bold text-foreground">{locations[0].name}</h4>
                <p className="text-2xs text-muted-foreground mt-0.5">{locations[0].address}</p>
              </div>

              <div className="p-3 rounded-lg bg-muted/40 border border-border space-y-1.5 text-2xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Satellite Coordinates:</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(locations[0].gpsCoordinates);
                      toast.success("GPS Coordinates copied to clipboard.");
                    }}
                    className="font-mono font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    <Navigation className="h-3 w-3" />
                    {locations[0].gpsCoordinates}
                  </button>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Basecamp:</span>
                  <span className="font-semibold text-foreground text-right">{locations[0].basecampLot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Assigned Chauffeur:</span>
                  <span className="font-semibold text-foreground text-right">{locations[0].assignedChauffeur}</span>
                </div>
              </div>

              <p className="text-2xs text-muted-foreground bg-background p-2.5 rounded-lg border border-border/70">
                <strong>Access Instructions:</strong> {locations[0].securityPassInstructions}
              </p>

              <div className="pt-1">
                <Link href="/locations">
                  <Button className="w-full bg-[#167D8D] text-white hover:bg-[#126572] h-8 text-2xs">
                    <Send className="h-3.5 w-3.5 mr-1.5" />
                    Dispatch Location Update to Talent &rarr;
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Real-Time Dispatched Feed */}
          <Card>
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                <Send className="h-4 w-4 text-[#167D8D]" />
                <span>Live Dispatch Feed to Actors</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3 space-y-2.5">
              {dispatchedAlerts.map((alt) => (
                <div
                  key={alt.id}
                  className="p-3 rounded-lg border border-border bg-muted/20 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">{alt.title}</span>
                      <span className="rounded bg-primary/10 px-1.5 py-0.2 text-[9px] font-bold text-primary">
                        {alt.channel}
                      </span>
                    </div>
                    <p className="text-2xs text-muted-foreground">{alt.details}</p>
                    <span className="text-[10px] text-muted-foreground font-semibold">
                      To: {alt.actorName}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground shrink-0">{alt.timestamp}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
