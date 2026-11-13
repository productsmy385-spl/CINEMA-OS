"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useCinema } from "@/lib/cinema-context";
import {
  Award,
  Calendar,
  CheckCircle2,
  DollarSign,
  Eye,
  EyeOff,
  Film,
  Lock,
  Mail,
  MapPin,
  Phone,
  Play,
  Send,
  ShieldCheck,
  Star,
  User,
  Video,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function ActorManagementView() {
  const { actors, selectedActor, setSelectedActor, meetings, shootSchedules, dispatchedAlerts } = useCinema();
  const [activeTab, setActiveTab] = useState<"overview" | "meetings" | "schedule" | "remuneration">("overview");
  const [isDobPrivate, setIsDobPrivate] = useState(true);
  const [requestLeaveModal, setRequestLeaveModal] = useState(false);
  const [leaveDates, setLeaveDates] = useState({ start: "", end: "", reason: "" });

  const actorMeetings = meetings.filter((m) => m.actorId === selectedActor.id);
  const actorSchedule = shootSchedules.find((s) => s.actorId === selectedActor.id);

  const handleTogglePrivacy = () => {
    setIsDobPrivate(!isDobPrivate);
    toast.info(
      isDobPrivate
        ? "Date of birth & contact details are now visible to authorized Casting Directors."
        : "Privacy enabled: Personal bio-data is restricted."
    );
  };

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestLeaveModal(false);
    toast.success(`Leave request submitted for ${leaveDates.start} to ${leaveDates.end}. Sent to Line Producer.`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Actor Workspace & Talent Station"
        description="Actor professional profiles, daily shoot schedules, director meeting prep, and remuneration records."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleTogglePrivacy}
              className="border-border text-xs flex items-center gap-1.5"
            >
              {isDobPrivate ? <EyeOff className="h-3.5 w-3.5 text-muted-foreground" /> : <Eye className="h-3.5 w-3.5 text-primary" />}
              {isDobPrivate ? "Confidentiality: Strict" : "Confidentiality: Open"}
            </Button>
            <Button
              size="sm"
              onClick={() => setRequestLeaveModal(true)}
              className="bg-[#167D8D] text-white hover:bg-[#126572] text-xs"
            >
              <Calendar className="h-3.5 w-3.5 mr-1" />
              Request Hiatus / Leave
            </Button>
          </div>
        }
      />

      {/* Actor Switcher & Top Roster */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 border-b border-border">
        {actors.map((actor) => {
          const isSelected = selectedActor.id === actor.id;
          return (
            <button
              key={actor.id}
              onClick={() => setSelectedActor(actor)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all text-left shrink-0 ${
                isSelected
                  ? "bg-[#071B2B] text-white border-[#167D8D] shadow-md ring-1 ring-[#167D8D]"
                  : "bg-card hover:bg-muted border-border text-foreground"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={actor.avatarUrl}
                alt={actor.stageName}
                className="h-9 w-9 rounded-full object-cover border border-[#167D8D]/40"
              />
              <div>
                <p className="text-xs font-bold leading-tight">{actor.stageName}</p>
                <p className="text-[10px] text-muted-foreground">{actor.agencyName}</p>
              </div>
              <Badge
                variant={actor.status === "on_set" ? "default" : "secondary"}
                className="ml-2 text-[10px] uppercase font-semibold"
              >
                {actor.status.replace("_", " ")}
              </Badge>
            </button>
          );
        })}
      </div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Actor Bio & Specifications */}
        <div className="lg:col-span-4 space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-5">
              <div className="flex flex-col items-center text-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedActor.avatarUrl}
                  alt={selectedActor.stageName}
                  className="h-28 w-28 rounded-2xl object-cover border-2 border-[#167D8D] shadow-md mb-3"
                />
                <h2 className="text-lg font-bold text-foreground">{selectedActor.stageName}</h2>
                <p className="text-xs text-muted-foreground">{selectedActor.legalName}</p>
                <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-[#167D8D]/10 px-2.5 py-0.5 text-2xs font-bold text-[#167D8D]">
                  <ShieldCheck className="h-3 w-3" />
                  SAG-AFTRA Signatory
                </span>
              </div>

              {/* Physical Specifications */}
              <div className="border-t border-border pt-4 space-y-2.5 text-xs">
                <h3 className="font-bold text-foreground text-xs uppercase tracking-wider text-muted-foreground">
                  Physical Profile & Attributes
                </h3>
                <div className="grid grid-cols-2 gap-2 text-2xs">
                  <div className="p-2 rounded bg-muted/40">
                    <span className="text-muted-foreground block">Height:</span>
                    <span className="font-semibold text-foreground">{selectedActor.height}</span>
                  </div>
                  <div className="p-2 rounded bg-muted/40">
                    <span className="text-muted-foreground block">Weight:</span>
                    <span className="font-semibold text-foreground">{selectedActor.weight}</span>
                  </div>
                  <div className="p-2 rounded bg-muted/40">
                    <span className="text-muted-foreground block">Eye Color:</span>
                    <span className="font-semibold text-foreground">{selectedActor.eyeColor}</span>
                  </div>
                  <div className="p-2 rounded bg-muted/40">
                    <span className="text-muted-foreground block">Hair Color:</span>
                    <span className="font-semibold text-foreground">{selectedActor.hairColor}</span>
                  </div>
                </div>
              </div>

              {/* Languages & Special Skills */}
              <div className="border-t border-border pt-4 space-y-2 text-xs">
                <span className="font-bold text-foreground block uppercase text-2xs tracking-wider text-muted-foreground">
                  Spoken Languages
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedActor.languages.map((l, i) => (
                    <span key={i} className="rounded bg-muted px-2 py-0.5 text-2xs text-foreground font-medium">
                      {l}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <span className="font-bold text-foreground block uppercase text-2xs tracking-wider text-muted-foreground">
                  Stunt & Special Skills
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedActor.skills.map((s, i) => (
                    <span
                      key={i}
                      className="rounded bg-[#167D8D]/10 px-2 py-0.5 text-2xs text-[#167D8D] font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Day Rate & Agency Representation */}
              <div className="border-t border-border pt-4 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Management Agency:</span>
                  <span className="font-semibold text-foreground">{selectedActor.agencyName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Standard Rate:</span>
                  <span className="font-bold text-[#167D8D] font-mono">
                    ${selectedActor.standardDayRate.toLocaleString()} / Day
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Tabbed Views */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === "overview"
                  ? "bg-[#167D8D] text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Shooting Call Today
            </button>
            <button
              onClick={() => setActiveTab("meetings")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === "meetings"
                  ? "bg-[#167D8D] text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Arranged Meetings ({actorMeetings.length})
            </button>
            <button
              onClick={() => setActiveTab("schedule")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === "schedule"
                  ? "bg-[#167D8D] text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Biography & Film Slate
            </button>
          </div>

          {/* TAB 1: Today's Shoot Call Sheet */}
          {activeTab === "overview" && (
            <div className="space-y-4">
              {actorSchedule ? (
                <Card className="border-l-4 border-l-[#167D8D]">
                  <CardHeader className="pb-3 border-b border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base font-bold text-foreground">
                          Call Sheet for {actorSchedule.project} (Day {actorSchedule.dayNumber})
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Role: {actorSchedule.characterName} • Date: {actorSchedule.shootDate}
                        </CardDescription>
                      </div>
                      <Badge variant={actorSchedule.status === "acknowledged" ? "success" : "warning"}>
                        {actorSchedule.status.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    {/* Key Timings */}
                    <div className="grid grid-cols-3 gap-3 text-center text-xs">
                      <div className="p-3 rounded-xl bg-muted/40 border border-border">
                        <span className="text-muted-foreground block text-2xs font-bold uppercase">
                          Van Pickup Time
                        </span>
                        <span className="font-mono text-base font-bold text-foreground">
                          {actorSchedule.pickupTime}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-muted/40 border border-border">
                        <span className="text-muted-foreground block text-2xs font-bold uppercase">
                          H/MU Call
                        </span>
                        <span className="font-mono text-base font-bold text-foreground">
                          {actorSchedule.hmuTime}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-[#167D8D]/10 border border-[#167D8D]/40">
                        <span className="text-[#167D8D] block text-2xs font-bold uppercase">
                          On-Set Reporting
                        </span>
                        <span className="font-mono text-base font-bold text-[#167D8D]">
                          {actorSchedule.onSetTime}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-background border border-border space-y-2 text-xs">
                      <p className="text-foreground">
                        <strong className="text-muted-foreground">Location:</strong> {actorSchedule.locationName}
                      </p>
                      <p className="text-foreground font-mono text-2xs">
                        {actorSchedule.locationAddress}
                      </p>
                      <p className="text-foreground">
                        <strong className="text-muted-foreground">Assigned Driver:</strong> {actorSchedule.assignedDriver} ({actorSchedule.driverPhone})
                      </p>
                      {actorSchedule.specialWardrobeNotes && (
                        <p className="text-primary italic">
                          <strong>Wardrobe Note:</strong> {actorSchedule.specialWardrobeNotes}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 flex justify-end">
                      <Link href="/call-sheets">
                        <Button className="bg-[#167D8D] text-white hover:bg-[#126572] text-xs">
                          Open Full Interactive Call Sheet & PDF &rarr;
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground text-xs">
                    No shoot scheduled for {selectedActor.stageName} today.
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* TAB 2: Arranged Meetings */}
          {activeTab === "meetings" && (
            <div className="space-y-3">
              {actorMeetings.length > 0 ? (
                actorMeetings.map((mtg) => (
                  <Card key={mtg.id} className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-foreground">{mtg.title}</h4>
                      <Badge variant={mtg.status === "Confirmed" ? "success" : "warning"}>
                        {mtg.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-2xs text-[#167D8D] font-bold">{mtg.meetingType}</p>
                    <p className="text-2xs text-muted-foreground">
                      With: {mtg.withWhom} • {mtg.companyOrStudio}
                    </p>
                    <div className="p-2.5 rounded-lg bg-muted/40 border border-border flex justify-between items-center text-2xs">
                      <span className="font-mono font-bold text-foreground">{mtg.dateTime}</span>
                      <span className="text-primary font-semibold">{mtg.format}</span>
                    </div>
                    {mtg.prepNotes && (
                      <p className="text-2xs text-foreground italic bg-background p-2 rounded border border-border">
                        <strong>Preparation Notes from Manager:</strong> {mtg.prepNotes}
                      </p>
                    )}
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground text-xs">
                    No arranged meetings on schedule.
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* TAB 3: Biography & Film Slate */}
          {activeTab === "schedule" && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-foreground">Professional Biography & Slate</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground leading-relaxed space-y-4">
                <p>{selectedActor.bio}</p>
                <div>
                  <h4 className="font-bold text-foreground uppercase tracking-wider text-2xs mb-2">
                    Current Active Film Productions
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedActor.activeProjects.map((p, i) => (
                      <span key={i} className="rounded-lg bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Leave Request Modal */}
      {requestLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-modal space-y-4">
            <h3 className="text-base font-bold text-foreground">Request Schedule Hiatus / Leave</h3>
            <p className="text-xs text-muted-foreground">
              Notify personal managers and line producers of blackout dates to prevent overlapping commitments.
            </p>
            <form onSubmit={handleLeaveSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="date"
                  label="Start Date"
                  value={leaveDates.start}
                  onChange={(e) => setLeaveDates({ ...leaveDates, start: e.target.value })}
                  required
                />
                <Input
                  type="date"
                  label="End Date"
                  value={leaveDates.end}
                  onChange={(e) => setLeaveDates({ ...leaveDates, end: e.target.value })}
                  required
                />
              </div>
              <Input
                label="Reason / Note"
                placeholder="Personal hiatus, promotional press tour..."
                value={leaveDates.reason}
                onChange={(e) => setLeaveDates({ ...leaveDates, reason: e.target.value })}
                required
              />
              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setRequestLeaveModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="default" className="bg-[#167D8D] text-white">
                  Submit Request
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
