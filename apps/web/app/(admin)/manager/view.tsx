"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useCinema, type ManagedActor } from "@/lib/cinema-context";
import {
  CalendarDays,
  CheckCircle,
  Clock,
  DollarSign,
  FileCheck,
  FileText,
  MapPin,
  MessageSquare,
  Navigation,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  User,
  UserCheck,
  Users,
  Video,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { ManagerCalendarPalette } from "./components/manager-calendar-palette";

export default function ManagerConsoleView() {
  const {
    actors,
    selectedActor,
    setSelectedActor,
    addActor,
    meetings,
    shootSchedules,
    updateShootSchedule,
    locations,
    dispatchLocationToActor,
    dispatchedAlerts,
  } = useCinema();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"calendar" | "focus">("calendar");
  const [showAddActorModal, setShowAddActorModal] = useState(false);
  const [showEditScheduleModal, setShowEditScheduleModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(shootSchedules[0]);

  // Add Actor Form State
  const [newActorForm, setNewActorForm] = useState({
    stageName: "",
    legalName: "",
    email: "",
    phone: "",
    agencyName: "Apex Talent Agency",
    standardDayRate: 10000,
    status: "available" as ManagedActor["status"],
    height: "5' 11\"",
    weight: "170 lbs",
    hairColor: "Brown",
    eyeColor: "Brown",
    skills: "Classical Drama, Dialects",
    languages: "English",
    bio: "",
  });

  // Schedule Adjust Form State
  const [scheduleForm, setScheduleForm] = useState({
    pickupTime: "05:15 AM",
    hmuTime: "06:00 AM",
    onSetTime: "07:15 AM",
    specialWardrobeNotes: "",
  });

  const filteredActors = actors.filter((a) =>
    a.stageName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const actorMeetings = meetings.filter((m) => m.actorId === selectedActor.id);
  const actorSchedule = shootSchedules.find((s) => s.actorId === selectedActor.id);

  const handleOpenEditSchedule = (sch: typeof shootSchedules[0]) => {
    setSelectedSchedule(sch);
    setScheduleForm({
      pickupTime: sch.pickupTime,
      hmuTime: sch.hmuTime,
      onSetTime: sch.onSetTime,
      specialWardrobeNotes: sch.specialWardrobeNotes,
    });
    setShowEditScheduleModal(true);
  };

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSchedule) return;
    updateShootSchedule(selectedSchedule.id, {
      pickupTime: scheduleForm.pickupTime,
      hmuTime: scheduleForm.hmuTime,
      onSetTime: scheduleForm.onSetTime,
      specialWardrobeNotes: scheduleForm.specialWardrobeNotes,
    });
    setShowEditScheduleModal(false);
  };

  const handleCreateActor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActorForm.stageName) return;

    addActor({
      stageName: newActorForm.stageName,
      legalName: newActorForm.legalName || newActorForm.stageName,
      avatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80",
      email: newActorForm.email,
      phone: newActorForm.phone,
      agencyName: newActorForm.agencyName,
      standardDayRate: Number(newActorForm.standardDayRate),
      status: newActorForm.status,
      activeProjects: ["New Acquisition"],
      height: newActorForm.height,
      weight: newActorForm.weight,
      hairColor: newActorForm.hairColor,
      eyeColor: newActorForm.eyeColor,
      languages: newActorForm.languages.split(",").map((s) => s.trim()),
      skills: newActorForm.skills.split(",").map((s) => s.trim()),
      bio: newActorForm.bio,
    });

    setShowAddActorModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Talent Manager Command Station"
        description="Comprehensive workspace for representing actors, arranging high-stakes director meetings, coordinating call sheet reporting times, and broadcasting live location updates."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/manager/meetings">
              <Button size="sm" variant="outline" className="text-xs">
                <Video className="h-3.5 w-3.5 mr-1 text-[#167D8D]" />
                Arranged Meetings ({meetings.length})
              </Button>
            </Link>
            <Button
              size="sm"
              onClick={() => setShowAddActorModal(true)}
              className="bg-[#167D8D] text-white hover:bg-[#126572] text-xs"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Onboard Talent
            </Button>
          </div>
        }
      />

      {/* View Mode Switcher */}
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <button
          onClick={() => setActiveTab("calendar")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "calendar"
              ? "bg-[#071B2B] text-white shadow-sm ring-1 ring-[#167D8D]"
              : "bg-card text-muted-foreground hover:text-foreground border border-border"
          }`}
        >
          <CalendarDays className="h-4 w-4 text-[#B9E4E8]" />
          <span>Work Schedules & Calendar Palette</span>
          <span className="ml-1 rounded-full bg-[#167D8D] px-1.5 py-0.5 text-[10px] text-white">
            {shootSchedules.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("focus")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "focus"
              ? "bg-[#071B2B] text-white shadow-sm ring-1 ring-[#167D8D]"
              : "bg-card text-muted-foreground hover:text-foreground border border-border"
          }`}
        >
          <User className="h-4 w-4 text-[#167D8D]" />
          <span>Focus Talent & Day Call Sheet</span>
        </button>
      </div>

      {activeTab === "calendar" ? (
        <ManagerCalendarPalette />
      ) : (
        <>
          {/* Roster Switcher Bar */}
          <div className="rounded-xl border border-border bg-card p-3 shadow-card flex items-center gap-3 overflow-x-auto">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-2 shrink-0">
          Client Roster:
        </span>
        <div className="flex items-center gap-2">
          {actors.map((actor) => {
            const isSelected = selectedActor.id === actor.id;
            return (
              <button
                key={actor.id}
                onClick={() => setSelectedActor(actor)}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all shrink-0 ${
                  isSelected
                    ? "bg-[#071B2B] text-white border-[#167D8D] shadow-sm ring-1 ring-[#167D8D]"
                    : "bg-background text-foreground hover:bg-muted border-border"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={actor.avatarUrl}
                  alt={actor.stageName}
                  className="h-6 w-6 rounded-full object-cover"
                />
                <span className="font-bold">{actor.stageName}</span>
                <span
                  className={`h-2 w-2 rounded-full ${
                    actor.status === "on_set"
                      ? "bg-emerald-400"
                      : actor.status === "rehearsal"
                      ? "bg-amber-400"
                      : "bg-primary"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Focus Actor Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Actor Card & Today's Shoot Call */}
        <div className="lg:col-span-5 space-y-5">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-[#071B2B] to-[#0F2E47] p-4 text-white">
              <div className="flex items-center gap-3.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedActor.avatarUrl}
                  alt={selectedActor.stageName}
                  className="h-16 w-16 rounded-xl object-cover border-2 border-[#167D8D]"
                />
                <div>
                  <h3 className="text-base font-bold">{selectedActor.stageName}</h3>
                  <p className="text-2xs text-[#B9E4E8]">{selectedActor.agencyName} • {selectedActor.legalName}</p>
                  <p className="text-2xs text-muted-foreground mt-1">
                    Phone: {selectedActor.phone} • Rate: ${selectedActor.standardDayRate.toLocaleString()}/day
                  </p>
                </div>
              </div>
            </div>

            <CardContent className="pt-4 space-y-4">
              {/* Daily Shooting Schedule & Times */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Today&apos;s Principal Shoot Schedule
                  </span>
                  {actorSchedule && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleOpenEditSchedule(actorSchedule)}
                      className="h-6 text-2xs text-primary hover:bg-primary/10"
                    >
                      Adjust Times
                    </Button>
                  )}
                </div>

                {actorSchedule ? (
                  <div className="rounded-xl border border-[#167D8D]/40 bg-[#167D8D]/5 p-3.5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-foreground text-xs">{actorSchedule.project}</span>
                        <span className="text-2xs text-muted-foreground block">
                          Day {actorSchedule.dayNumber} of {actorSchedule.totalDays} • Role: {actorSchedule.characterName}
                        </span>
                      </div>
                      <Badge variant={actorSchedule.status === "acknowledged" ? "success" : "warning"}>
                        {actorSchedule.status.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2 rounded-lg bg-background border border-border">
                        <span className="text-muted-foreground block text-[10px] font-bold">PICKUP</span>
                        <span className="font-mono font-bold text-foreground">{actorSchedule.pickupTime}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-background border border-border">
                        <span className="text-muted-foreground block text-[10px] font-bold">H/MU CALL</span>
                        <span className="font-mono font-bold text-foreground">{actorSchedule.hmuTime}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
                        <span className="text-primary block text-[10px] font-bold">ON-SET CALL</span>
                        <span className="font-mono font-bold text-primary">{actorSchedule.onSetTime}</span>
                      </div>
                    </div>

                    <div className="text-2xs space-y-1 pt-1 border-t border-border/60">
                      <p className="text-muted-foreground">
                        <strong className="text-foreground">Location:</strong> {actorSchedule.locationName}
                      </p>
                      <p className="text-muted-foreground">
                        <strong className="text-foreground">Driver:</strong> {actorSchedule.assignedDriver} ({actorSchedule.driverPhone})
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-lg border border-border text-center text-xs text-muted-foreground">
                    No active call sheet assigned for {selectedActor.stageName} today.
                  </div>
                )}
              </div>

              {/* Instant Location Dispatch Section */}
              <div className="pt-2 border-t border-border space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                  Broadcast Shoot Location to Actor
                </span>
                <div className="p-3 rounded-lg border border-border bg-background space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">{locations[0].name}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(locations[0].gpsCoordinates);
                        toast.success("GPS Coordinates copied to clipboard.");
                      }}
                      className="text-primary font-mono text-2xs hover:underline flex items-center gap-1"
                    >
                      <Navigation className="h-3 w-3" />
                      {locations[0].gpsCoordinates}
                    </button>
                  </div>
                  <p className="text-2xs text-muted-foreground">{locations[0].address}</p>
                  <p className="text-2xs text-primary font-medium">{locations[0].basecampLot}</p>
                  <Button
                    size="sm"
                    onClick={() => dispatchLocationToActor(locations[0].id, selectedActor.id)}
                    className="w-full bg-[#167D8D] text-white hover:bg-[#126572] h-7 text-2xs"
                  >
                    <Send className="h-3 w-3 mr-1" />
                    Push Location Pin & Gate Pass to {selectedActor.stageName}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Arranged Meetings & Live Dispatch Feed */}
        <div className="lg:col-span-7 space-y-5">
          {/* Arranged Meetings for Actor */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold text-foreground">
                  Arranged Meetings for {selectedActor.stageName}
                </CardTitle>
                <CardDescription className="text-xs">
                  Director script readings, chemistry reads, pitch sessions, and wardrobe fittings.
                </CardDescription>
              </div>
              <Link href="/manager/meetings">
                <Button size="sm" className="bg-[#167D8D] text-white hover:bg-[#126572] text-xs">
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Arrange Meeting
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {actorMeetings.length > 0 ? (
                <div className="space-y-3">
                  {actorMeetings.map((mtg) => (
                    <div
                      key={mtg.id}
                      className="p-3.5 rounded-xl border border-border bg-card flex flex-col justify-between gap-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground text-sm">{mtg.title}</span>
                        <Badge
                          variant={mtg.status === "Confirmed" ? "success" : "warning"}
                          className="text-2xs"
                        >
                          {mtg.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-2xs text-[#167D8D] font-semibold">{mtg.meetingType}</p>
                      <p className="text-2xs text-muted-foreground">
                        With: {mtg.withWhom} • Studio: {mtg.companyOrStudio}
                      </p>
                      <div className="p-2 rounded bg-muted/40 flex items-center justify-between text-2xs">
                        <span className="font-mono font-bold text-foreground">{mtg.dateTime}</span>
                        <span className="text-muted-foreground">{mtg.format}</span>
                      </div>
                      {mtg.prepNotes && (
                        <p className="text-2xs text-foreground italic border-t border-border/60 pt-1.5">
                          <strong>Prep Notes:</strong> {mtg.prepNotes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 rounded-lg border border-dashed border-border text-center text-xs text-muted-foreground">
                  <p>No upcoming meetings scheduled for {selectedActor.stageName}.</p>
                  <Link href="/manager/meetings" className="mt-2 inline-block">
                    <Button size="sm" variant="outline" className="text-xs">
                      Schedule Director Script Read &rarr;
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Real-time Dispatch Alerts Ledger */}
          <Card>
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                <Send className="h-4 w-4 text-[#167D8D]" />
                <span>Real-Time Dispatches & Broadcast History</span>
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
      </>
      )}

      {/* Adjust Schedule Modal */}
      {showEditScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-modal space-y-4">
            <h3 className="text-base font-bold text-foreground">Adjust Actor Call Schedule</h3>
            <p className="text-xs text-muted-foreground">
              Modify pickup and on-set times for {selectedActor.stageName}. Changes will immediately dispatch to the actor.
            </p>
            <form onSubmit={handleSaveSchedule} className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <Input
                  label="Pickup Time"
                  value={scheduleForm.pickupTime}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, pickupTime: e.target.value })}
                  required
                />
                <Input
                  label="H/MU Time"
                  value={scheduleForm.hmuTime}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, hmuTime: e.target.value })}
                  required
                />
                <Input
                  label="On-Set Call"
                  value={scheduleForm.onSetTime}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, onSetTime: e.target.value })}
                  required
                />
              </div>
              <Input
                label="Wardrobe / Prop Instructions"
                placeholder="e.g. Sc. 42A duster coat check with wardrobe"
                value={scheduleForm.specialWardrobeNotes}
                onChange={(e) => setScheduleForm({ ...scheduleForm, specialWardrobeNotes: e.target.value })}
              />
              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setShowEditScheduleModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="default" className="bg-[#167D8D] text-white">
                  Broadcast Update
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Onboard Talent Modal */}
      {showAddActorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-modal space-y-4">
            <h3 className="text-base font-bold text-foreground">Onboard Talent to Management Roster</h3>
            <form onSubmit={handleCreateActor} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Stage / Professional Name"
                  placeholder="e.g. Liam Sterling"
                  value={newActorForm.stageName}
                  onChange={(e) => setNewActorForm({ ...newActorForm, stageName: e.target.value })}
                  required
                />
                <Input
                  label="Legal Name"
                  placeholder="e.g. Liam Patrick Sterling"
                  value={newActorForm.legalName}
                  onChange={(e) => setNewActorForm({ ...newActorForm, legalName: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="email"
                  label="Email"
                  placeholder="liam@talent.com"
                  value={newActorForm.email}
                  onChange={(e) => setNewActorForm({ ...newActorForm, email: e.target.value })}
                  required
                />
                <Input
                  type="tel"
                  label="Phone / Mobile"
                  placeholder="+1 (310) 555-0199"
                  value={newActorForm.phone}
                  onChange={(e) => setNewActorForm({ ...newActorForm, phone: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="number"
                  label="Standard Day Rate ($ USD)"
                  value={newActorForm.standardDayRate}
                  onChange={(e) => setNewActorForm({ ...newActorForm, standardDayRate: Number(e.target.value) })}
                  required
                />
                <Input
                  label="Special Stunt / Acting Skills"
                  placeholder="Combat, Equestrian, Dialects..."
                  value={newActorForm.skills}
                  onChange={(e) => setNewActorForm({ ...newActorForm, skills: e.target.value })}
                />
              </div>

              <Input
                label="Professional Biography"
                placeholder="Background, training, noteworthy credits..."
                value={newActorForm.bio}
                onChange={(e) => setNewActorForm({ ...newActorForm, bio: e.target.value })}
              />

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setShowAddActorModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="default" className="bg-[#167D8D] text-white">
                  Add to Roster
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
