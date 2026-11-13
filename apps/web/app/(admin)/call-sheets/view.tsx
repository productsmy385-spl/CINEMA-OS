"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { activeCallSheet, type CallSheetItem } from "@/data/film-data";
import { useCinema } from "@/lib/cinema-context";
import { generateCallSheetPDF } from "@/lib/call-sheet-pdf";
import {
  AlertTriangle,
  Bell,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  Film,
  Hospital,
  MapPin,
  Phone,
  Plus,
  RefreshCw,
  Send,
  ShieldCheck,
  Sun,
  Sunrise,
  Sunset,
  Users,
  Utensils,
  Video,
} from "lucide-react";
import { toast } from "sonner";

export default function CallSheetView() {
  const { shootSchedules, acknowledgeSchedule } = useCinema();
  const [callSheet, setCallSheet] = useState<CallSheetItem>(activeCallSheet);
  const [isExporting, setIsExporting] = useState(false);
  const [showAddSceneModal, setShowAddSceneModal] = useState(false);
  const [newScene, setNewScene] = useState({
    sceneNumber: "Sc. 45",
    intExt: "INT" as "INT" | "EXT",
    dayNight: "DAY" as "DAY" | "NIGHT",
    description: "",
    scriptPages: "1 4/8 pgs",
    castNumbers: "1, 2",
    location: "Command Bunker A",
    timeSlot: "06:15 PM - 07:15 PM",
  });

  const handleExportPDF = () => {
    setIsExporting(true);
    try {
      generateCallSheetPDF(callSheet);
      toast.success("Official PDF Call Sheet generated and downloaded.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF. Check console logs.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleAcknowledgeCast = (castId: string, actorName: string) => {
    setCallSheet((prev) => ({
      ...prev,
      castCalls: prev.castCalls.map((c) =>
        c.id === castId
          ? {
              ...c,
              status: "acknowledged",
              acknowledgedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " Today",
            }
          : c
      ),
    }));

    // Also acknowledge in context if found
    const matchingSchedule = shootSchedules.find((s) => s.actorName.includes(actorName));
    if (matchingSchedule) {
      acknowledgeSchedule(matchingSchedule.id);
    } else {
      toast.success(`Call time acknowledged for ${actorName}.`);
    }
  };

  const handleSimulateRevision = () => {
    const newVersion = callSheet.version + 1;
    setCallSheet((prev) => ({
      ...prev,
      version: newVersion,
      status: "revised",
      generalCallTime: "07:00 AM", // 30 min weather delay
      weather: {
        ...prev.weather,
        temperature: "76°F / 24°C (Wind gust advisory)",
      },
    }));
    toast.warning(`Call Sheet revised to v${newVersion}! Push notifications dispatched to 42 cast & crew.`);
  };

  const handleAddSceneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScene.description) {
      toast.error("Please enter a scene description");
      return;
    }
    setCallSheet((prev) => ({
      ...prev,
      scenes: [...prev.scenes, { ...newScene }],
    }));
    setShowAddSceneModal(false);
    toast.success(`Scene ${newScene.sceneNumber} added to shooting schedule.`);
  };

  const acknowledgedCount = callSheet.castCalls.filter((c) => c.status === "acknowledged").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Call Sheet Schedules & Dispatch"
        description="Daily shooting schedule, actor reporting times, scene breakdown, and real-time cast acknowledgment tracking."
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSimulateRevision}
              className="border-amber-500/30 text-amber-600 hover:bg-amber-500/10 dark:text-amber-400 text-xs"
            >
              <RefreshCw className="h-4 w-4 mr-1.5" />
              Publish Revision (v{callSheet.version + 1})
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleExportPDF}
              isLoading={isExporting}
              className="bg-[#167D8D] text-white hover:bg-[#126572] text-xs"
            >
              <Download className="h-4 w-4 mr-1.5" />
              Export Official PDF
            </Button>
          </div>
        }
      />

      {/* Project & Day Banner */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-8 rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-4">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#071B2B] text-[#B9E4E8]">
                <Film className="h-6 w-6" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-foreground">{callSheet.projectTitle}</h2>
                  <span className="rounded-md bg-primary/10 px-2 py-0.5 text-2xs font-bold text-primary">
                    {callSheet.projectCode}
                  </span>
                  <Badge variant={callSheet.status === "revised" ? "warning" : "default"}>
                    {callSheet.status.toUpperCase()} v{callSheet.version}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Day {callSheet.dayNumber} of {callSheet.totalDays} • {callSheet.unit} • {callSheet.date}
                </p>
              </div>
            </div>

            {/* General Call Timers */}
            <div className="flex items-center gap-4 bg-muted/50 rounded-lg p-2.5 border border-border/60">
              <div className="text-left">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                  Crew General Call
                </span>
                <span className="text-sm font-bold text-[#167D8D] flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {callSheet.generalCallTime}
                </span>
              </div>
              <div className="h-6 w-px bg-border" />
              <div className="text-left">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                  Est. Wrap Time
                </span>
                <span className="text-sm font-bold text-foreground flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {callSheet.estimatedWrapTime}
                </span>
              </div>
            </div>
          </div>

          {/* Location & Key Hospital Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs">
            <div className="space-y-1.5 p-3 rounded-lg bg-background border border-border/70">
              <div className="flex items-center gap-1.5 font-semibold text-foreground">
                <MapPin className="h-3.5 w-3.5 text-[#167D8D]" />
                <span>Primary Location & Parking:</span>
              </div>
              <p className="text-muted-foreground pl-5">{callSheet.location.name}</p>
              <p className="text-muted-foreground pl-5 font-mono text-2xs">{callSheet.location.address}</p>
              <p className="text-muted-foreground pl-5 text-2xs italic font-medium text-primary">
                {callSheet.location.parking}
              </p>
            </div>

            <div className="space-y-1.5 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
              <div className="flex items-center gap-1.5 font-semibold text-destructive">
                <Hospital className="h-3.5 w-3.5" />
                <span>Nearest Emergency Hospital:</span>
              </div>
              <p className="text-foreground pl-5 font-medium">{callSheet.location.nearestHospital.name}</p>
              <p className="text-muted-foreground pl-5 font-mono text-2xs">
                {callSheet.location.nearestHospital.address}
              </p>
              <div className="pl-5 flex items-center gap-2 text-destructive font-semibold text-2xs">
                <Phone className="h-3 w-3" />
                <span>{callSheet.location.nearestHospital.emergencyPhone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Weather & Cast Acknowledgement Status */}
        <div className="lg:col-span-4 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                <span>Cast Acknowledgments</span>
                <span className="text-primary font-bold">
                  {acknowledgedCount} / {callSheet.castCalls.length} Confirmed
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden mb-3">
                <div
                  className="bg-[#167D8D] h-2 transition-all duration-300"
                  style={{ width: `${(acknowledgedCount / callSheet.castCalls.length) * 100}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {acknowledgedCount === callSheet.castCalls.length
                  ? "All cast members have acknowledged today's call time."
                  : "Waiting for remaining talent confirmations. Automated alert queued for T-2 hours."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Sun className="h-4 w-4 text-amber-500" />
                <span>On-Set Weather Conditions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex items-center justify-between font-medium">
                <span className="text-foreground">{callSheet.weather.temperature}</span>
                <span className="text-muted-foreground">{callSheet.weather.condition}</span>
              </div>
              <div className="flex items-center justify-between text-2xs text-muted-foreground border-t border-border/80 pt-2">
                <span className="flex items-center gap-1">
                  <Sunrise className="h-3.5 w-3.5 text-amber-400" /> Sunrise: {callSheet.weather.sunrise}
                </span>
                <span className="flex items-center gap-1">
                  <Sunset className="h-3.5 w-3.5 text-orange-400" /> Sunset: {callSheet.weather.sunset}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Scheduled Scenes Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base font-bold text-foreground">Scheduled Shooting Scenes</CardTitle>
            <CardDescription className="text-xs">
              Scene order, location setups, script page count, and estimated shooting windows.
            </CardDescription>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowAddSceneModal(true)}
            className="text-xs"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add Scene
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-muted-foreground">
                  <th className="py-2.5 px-3 font-semibold">Scene #</th>
                  <th className="py-2.5 px-3 font-semibold">Set / Light</th>
                  <th className="py-2.5 px-3 font-semibold">Description</th>
                  <th className="py-2.5 px-3 font-semibold">Pages</th>
                  <th className="py-2.5 px-3 font-semibold">Cast #</th>
                  <th className="py-2.5 px-3 font-semibold">Location</th>
                  <th className="py-2.5 px-3 font-semibold">Time Slot</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {callSheet.scenes.map((scene, i) => (
                  <tr key={i} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-3 font-bold text-foreground">{scene.sceneNumber}</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 font-semibold text-2xs px-2 py-0.5 rounded bg-muted text-foreground">
                        {scene.intExt} / {scene.dayNight}
                      </span>
                    </td>
                    <td className="py-3 px-3 max-w-md text-foreground font-medium">{scene.description}</td>
                    <td className="py-3 px-3 font-mono text-muted-foreground">{scene.scriptPages}</td>
                    <td className="py-3 px-3">
                      <span className="rounded bg-primary/10 px-1.5 py-0.5 text-2xs font-bold text-primary">
                        {scene.castNumbers}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-muted-foreground">{scene.location}</td>
                    <td className="py-3 px-3 font-semibold text-primary">{scene.timeSlot}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Cast & Talent Call Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base font-bold text-foreground">Cast & Talent Call Times</CardTitle>
            <CardDescription className="text-xs">
              Individual pickup, hair/makeup, on-set reporting times, and digital acknowledgment confirmation.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-muted-foreground">
                  <th className="py-2.5 px-3 font-semibold">#</th>
                  <th className="py-2.5 px-3 font-semibold">Character</th>
                  <th className="py-2.5 px-3 font-semibold">Actor</th>
                  <th className="py-2.5 px-3 font-semibold">Pickup</th>
                  <th className="py-2.5 px-3 font-semibold">H / MU Call</th>
                  <th className="py-2.5 px-3 font-semibold">On-Set Call</th>
                  <th className="py-2.5 px-3 font-semibold">Special Notes / Wardrobe</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {callSheet.castCalls.map((cast) => (
                  <tr key={cast.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-3 font-bold text-muted-foreground">{cast.castNumber}</td>
                    <td className="py-3 px-3 font-bold text-foreground">{cast.characterName}</td>
                    <td className="py-3 px-3 text-foreground font-medium">{cast.actorName}</td>
                    <td className="py-3 px-3 text-muted-foreground font-mono">{cast.pickupTime}</td>
                    <td className="py-3 px-3 text-muted-foreground font-mono">{cast.hmuTime}</td>
                    <td className="py-3 px-3 font-bold text-[#167D8D] font-mono">{cast.onSetTime}</td>
                    <td className="py-3 px-3 text-muted-foreground max-w-xs">{cast.notes}</td>
                    <td className="py-3 px-3">
                      {cast.status === "acknowledged" ? (
                        <div className="flex items-center gap-1 text-success font-semibold text-2xs">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Acknowledged</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-amber-500 font-semibold text-2xs">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          <span>Pending Acknowledgment</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {cast.status === "pending" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAcknowledgeCast(cast.id, cast.actorName)}
                          className="h-7 text-2xs border-primary/40 text-primary hover:bg-primary/10"
                        >
                          Confirm Receipt
                        </Button>
                      ) : (
                        <span className="text-2xs text-muted-foreground">{cast.acknowledgedAt}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Scene Modal Dialog */}
      {showAddSceneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-modal space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground">Add Shooting Scene</h3>
              <button
                onClick={() => setShowAddSceneModal(false)}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddSceneSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Scene Number"
                  value={newScene.sceneNumber}
                  onChange={(e) => setNewScene({ ...newScene, sceneNumber: e.target.value })}
                  required
                />
                <Input
                  label="Script Pages"
                  value={newScene.scriptPages}
                  onChange={(e) => setNewScene({ ...newScene, scriptPages: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Set Setting</label>
                  <select
                    className="w-full h-9 rounded-lg border border-border bg-background px-3 text-xs"
                    value={newScene.intExt}
                    onChange={(e) => setNewScene({ ...newScene, intExt: e.target.value as "INT" | "EXT" })}
                  >
                    <option value="INT">INT (Interior)</option>
                    <option value="EXT">EXT (Exterior)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Lighting</label>
                  <select
                    className="w-full h-9 rounded-lg border border-border bg-background px-3 text-xs"
                    value={newScene.dayNight}
                    onChange={(e) => setNewScene({ ...newScene, dayNight: e.target.value as "DAY" | "NIGHT" })}
                  >
                    <option value="DAY">DAY</option>
                    <option value="NIGHT">NIGHT</option>
                    <option value="DUSK">DUSK</option>
                    <option value="DAWN">DAWN</option>
                  </select>
                </div>
              </div>
              <Input
                label="Scene Action / Description"
                placeholder="Brief summary of actors and actions..."
                value={newScene.description}
                onChange={(e) => setNewScene({ ...newScene, description: e.target.value })}
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Location / Set"
                  value={newScene.location}
                  onChange={(e) => setNewScene({ ...newScene, location: e.target.value })}
                  required
                />
                <Input
                  label="Time Slot"
                  value={newScene.timeSlot}
                  onChange={(e) => setNewScene({ ...newScene, timeSlot: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setShowAddSceneModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="default" className="bg-[#167D8D] text-white">
                  Add to Call Sheet
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
