"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useCinema, type ManagerMeeting } from "@/lib/cinema-context";
import {
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  MapPin,
  Plus,
  Send,
  Sparkles,
  User,
  Users,
  Video,
} from "lucide-react";
import { toast } from "sonner";

export default function ManagerMeetingsView() {
  const { actors, meetings, scheduleMeeting, updateMeetingStatus } = useCinema();
  const [filterType, setFilterType] = useState<string>("all");
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const [form, setForm] = useState({
    title: "",
    actorId: actors[0]?.id || "",
    withWhom: "",
    companyOrStudio: "",
    meetingType: "Director Script Reading" as ManagerMeeting["meetingType"],
    dateTime: "",
    format: "In-Person (Studio)" as ManagerMeeting["format"],
    locationOrLink: "",
    prepNotes: "",
  });

  const handleCreateMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.dateTime) {
      toast.error("Please fill in the meeting title and date/time.");
      return;
    }

    const actor = actors.find((a) => a.id === form.actorId) || actors[0];

    scheduleMeeting({
      title: form.title,
      actorId: actor.id,
      actorName: actor.stageName,
      withWhom: form.withWhom,
      companyOrStudio: form.companyOrStudio,
      meetingType: form.meetingType,
      dateTime: form.dateTime,
      format: form.format,
      locationOrLink: form.locationOrLink,
      prepNotes: form.prepNotes,
      status: "Scheduled",
    });

    setShowScheduleModal(false);
    setForm({
      title: "",
      actorId: actors[0]?.id || "",
      withWhom: "",
      companyOrStudio: "",
      meetingType: "Director Script Reading",
      dateTime: "",
      format: "In-Person (Studio)",
      locationOrLink: "",
      prepNotes: "",
    });
  };

  const filteredMeetings = meetings.filter((m) => {
    if (filterType === "all") return true;
    return m.status.toLowerCase() === filterType.toLowerCase();
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Arranged Meetings & Pitch Coordination"
        description="Schedule director script readings, producer pitch sessions, chemistry reads, and brand meetings on behalf of represented actors."
        actions={
          <Button
            size="sm"
            onClick={() => setShowScheduleModal(true)}
            className="bg-[#167D8D] text-white hover:bg-[#126572] text-xs"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Arrange New Meeting
          </Button>
        }
      />

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-2">
        {["all", "confirmed", "scheduled", "completed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterType(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
              filterType === tab
                ? "bg-[#167D8D] text-white shadow-xs"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {tab === "all" ? `All Meetings (${meetings.length})` : tab}
          </button>
        ))}
      </div>

      {/* Meetings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMeetings.map((mtg) => (
          <Card key={mtg.id} className="p-4 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <Badge variant="default" className="text-2xs font-semibold">
                  {mtg.meetingType}
                </Badge>
                <Badge
                  variant={
                    mtg.status === "Confirmed"
                      ? "success"
                      : mtg.status === "Completed"
                      ? "secondary"
                      : "warning"
                  }
                  className="text-2xs"
                >
                  {mtg.status.toUpperCase()}
                </Badge>
              </div>

              <div>
                <h3 className="text-sm font-bold text-foreground">{mtg.title}</h3>
                <div className="flex items-center gap-1.5 mt-1 text-2xs text-[#167D8D] font-bold">
                  <User className="h-3.5 w-3.5" />
                  <span>Representing: {mtg.actorName}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-muted/40 border border-border space-y-1.5 text-2xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">With / Attendees:</span>
                  <span className="font-semibold text-foreground text-right">{mtg.withWhom}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Production House:</span>
                  <span className="font-semibold text-foreground text-right">{mtg.companyOrStudio}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date & Time:</span>
                  <span className="font-mono font-bold text-primary text-right">{mtg.dateTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location / Link:</span>
                  <span className="font-semibold text-foreground text-right truncate max-w-[160px]">
                    {mtg.locationOrLink}
                  </span>
                </div>
              </div>

              {mtg.prepNotes && (
                <div className="space-y-1 text-2xs bg-background p-2.5 rounded-lg border border-border/70">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-muted-foreground block">
                    Manager Prep Notes for Talent
                  </span>
                  <p className="text-foreground leading-relaxed italic">{mtg.prepNotes}</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
              {mtg.status !== "Confirmed" && mtg.status !== "Completed" ? (
                <Button
                  size="sm"
                  onClick={() => updateMeetingStatus(mtg.id, "Confirmed")}
                  className="h-7 text-2xs bg-success text-white hover:bg-success/90"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                  Confirm with Studio
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast.success(`Meeting details & calendar invite sent to ${mtg.actorName}.`)}
                  className="h-7 text-2xs text-primary border-primary/40"
                >
                  <Send className="h-3 w-3 mr-1" />
                  Ping Actor
                </Button>
              )}

              {mtg.format.includes("Video") ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast.info(`Connecting to meeting room: ${mtg.locationOrLink}...`)}
                  className="h-7 text-2xs text-foreground"
                >
                  <Video className="h-3.5 w-3.5 mr-1 text-primary" />
                  Join Room
                </Button>
              ) : (
                <span className="text-2xs text-muted-foreground font-medium">In-Person</span>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Arrange Meeting Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-modal space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground">Arrange Meeting for Talent</h3>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateMeeting} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Select Actor</label>
                <select
                  className="w-full h-9 rounded-lg border border-border bg-background px-3 text-xs"
                  value={form.actorId}
                  onChange={(e) => setForm({ ...form, actorId: e.target.value })}
                >
                  {actors.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.stageName} ({a.agencyName})
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Meeting Purpose / Title"
                placeholder="e.g. Vanguard 2099 - Directorial Script Read"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Meeting Category</label>
                  <select
                    className="w-full h-9 rounded-lg border border-border bg-background px-3 text-xs"
                    value={form.meetingType}
                    onChange={(e) => setForm({ ...form, meetingType: e.target.value as any })}
                  >
                    <option value="Director Script Reading">Director Script Reading</option>
                    <option value="Producer Pitch Meeting">Producer Pitch Meeting</option>
                    <option value="Casting Callback">Casting Callback</option>
                    <option value="Wardrobe & Costume Fitting">Wardrobe & Costume Fitting</option>
                    <option value="Chemistry Read">Chemistry Read</option>
                    <option value="Brand Endorsement">Brand Endorsement</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Format</label>
                  <select
                    className="w-full h-9 rounded-lg border border-border bg-background px-3 text-xs"
                    value={form.format}
                    onChange={(e) => setForm({ ...form, format: e.target.value as any })}
                  >
                    <option value="In-Person (Studio)">In-Person (Studio / Lot)</option>
                    <option value="Video Call (Zoom / Meet)">Video Call (Google Meet / Zoom)</option>
                    <option value="On-Location">On-Location / Set Trailer</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="With Whom (Director / Exec)"
                  placeholder="e.g. Christopher Nolan (Director)"
                  value={form.withWhom}
                  onChange={(e) => setForm({ ...form, withWhom: e.target.value })}
                  required
                />
                <Input
                  label="Studio / Production Co."
                  placeholder="e.g. Syncopy / Universal"
                  value={form.companyOrStudio}
                  onChange={(e) => setForm({ ...form, companyOrStudio: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Date & Time"
                  placeholder="e.g. Tomorrow at 10:30 AM PST"
                  value={form.dateTime}
                  onChange={(e) => setForm({ ...form, dateTime: e.target.value })}
                  required
                />
                <Input
                  label="Location or Meeting Link"
                  placeholder="e.g. Stage 4 Suite or https://meet.google.com/..."
                  value={form.locationOrLink}
                  onChange={(e) => setForm({ ...form, locationOrLink: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Preparation Notes for Actor
                </label>
                <textarea
                  className="w-full h-20 p-2.5 rounded-lg border border-border bg-background text-xs outline-none"
                  placeholder="Guidance for scenes, wardrobe, background reading, or director expectations..."
                  value={form.prepNotes}
                  onChange={(e) => setForm({ ...form, prepNotes: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setShowScheduleModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="default" className="bg-[#167D8D] text-white">
                  Schedule & Dispatch Invite
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

