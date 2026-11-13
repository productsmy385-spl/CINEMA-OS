"use client";

import React, { useState, useMemo } from "react";
import {
  useCinema,
  type ShootScheduleCall,
  type ScheduleCategory,
  type ManagedActor,
} from "@/lib/cinema-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { generateCallSheetPDF } from "@/lib/call-sheet-pdf";
import { activeCallSheet } from "@/data/film-data";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Film,
  Filter,
  MapPin,
  Navigation,
  Phone,
  Plus,
  Send,
  Sparkles,
  User,
  Users,
  Video,
  AlertTriangle,
  FileDown,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

// Official Palette definitions
const PALETTE = {
  navy: "#071B2B",
  teal: "#167D8D",
  cyan: "#B9E4E8",
  softGrey: "#EEEEEE",
  white: "#FFFFFF",
};

interface PaletteCategoryConfig {
  key: ScheduleCategory;
  label: string;
  sublabel: string;
  bgHex: string;
  textHex: string;
  borderHex: string;
  badgeStyle: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CATEGORY_CONFIGS: Record<ScheduleCategory, PaletteCategoryConfig> = {
  shoot: {
    key: "shoot",
    label: "Principal Photography",
    sublabel: "Active Shoot & Set Call Times",
    bgHex: "#071B2B",
    textHex: "#FFFFFF",
    borderHex: "#167D8D",
    badgeStyle: "bg-[#071B2B] text-white border-[#167D8D]",
    icon: Film,
  },
  pitch: {
    key: "pitch",
    label: "Director Pitches & Reads",
    sublabel: "Script Readings & Callbacks",
    bgHex: "#167D8D",
    textHex: "#FFFFFF",
    borderHex: "#071B2B",
    badgeStyle: "bg-[#167D8D] text-white border-[#071B2B]",
    icon: Video,
  },
  fitting: {
    key: "fitting",
    label: "Wardrobe & HMU Tests",
    sublabel: "Costume Trials & Screen Tests",
    bgHex: "#B9E4E8",
    textHex: "#071B2B",
    borderHex: "#167D8D",
    badgeStyle: "bg-[#B9E4E8] text-[#071B2B] border-[#167D8D]/40 font-bold",
    icon: Sparkles,
  },
  travel: {
    key: "travel",
    label: "Production Travel & Transit",
    sublabel: "Flights, Chauffeur & Per Diem",
    bgHex: "#EEEEEE",
    textHex: "#071B2B",
    borderHex: "#167D8D",
    badgeStyle: "bg-[#EEEEEE] text-[#071B2B] border-border dark:bg-muted dark:text-foreground font-semibold",
    icon: MapPin,
  },
  blackout: {
    key: "blackout",
    label: "Actor Blackout & Rest",
    sublabel: "SAG Turnaround & Leave Days",
    bgHex: "#FFFFFF",
    textHex: "#B91C1C",
    borderHex: "#EF4444",
    badgeStyle: "bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 font-bold",
    icon: Clock,
  },
};

export function ManagerCalendarPalette() {
  const {
    actors,
    selectedActor,
    setSelectedActor,
    shootSchedules,
    addShootSchedule,
    updateShootSchedule,
    locations,
    dispatchLocationToActor,
  } = useCinema();

  // Active filters
  const [selectedActorFilter, setSelectedActorFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<ScheduleCategory | "all">("all");
  const [selectedIsoDate, setSelectedIsoDate] = useState<string>("2026-11-14");
  const [viewMode, setViewMode] = useState<"month" | "timeline" | "day">("month");

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [activeEditingSchedule, setActiveEditingSchedule] = useState<ShootScheduleCall | null>(null);

  // New Schedule form state
  const [newSchedule, setNewSchedule] = useState({
    actorId: selectedActor?.id || actors[0]?.id || "act-1",
    project: "Chrono Raiders",
    characterName: "Lead Character",
    isoDate: "2026-11-16",
    category: "shoot" as ScheduleCategory,
    dayNumber: 30,
    totalDays: 52,
    pickupTime: "05:30 AM",
    hmuTime: "06:15 AM",
    onSetTime: "07:15 AM",
    estimatedWrapTime: "07:30 PM",
    locationName: locations[0]?.name || "Vasquez Rocks Natural Area Park",
    locationAddress: locations[0]?.address || "10700 Escondido Canyon Rd, Agua Dulce, CA 91390",
    assignedDriver: "Frank Perez (Driver #4)",
    driverPhone: "+1 (310) 555-0822",
    specialWardrobeNotes: "Primary costume and prosthetics.",
  });

  // Adjust schedule form state
  const [adjustForm, setAdjustForm] = useState({
    pickupTime: "",
    hmuTime: "",
    onSetTime: "",
    estimatedWrapTime: "",
    specialWardrobeNotes: "",
  });

  // Days in November 2026 (Starts on Sunday, Nov 1; 30 days)
  // Calendar grid: We display 35 days (Nov 1 to Nov 30 + first few of Dec)
  const novemberDays = useMemo(() => {
    const days: { dayNumber: number; isoDate: string; isCurrentMonth: boolean }[] = [];
    // 2026-11-01 was a Sunday. If week starts on Monday, we have 6 offset days in October.
    // Let's do Monday start: Oct 26-31 (6 days) then Nov 1-30 (30 days), then Dec 1-5 (5 days)
    // For clean presentation:
    const startOffset = 6; // Oct 26-31
    for (let i = startOffset; i > 0; i--) {
      const d = 31 - i + 1;
      days.push({ dayNumber: d, isoDate: `2026-10-${d}`, isCurrentMonth: false });
    }
    for (let d = 1; d <= 30; d++) {
      const padded = d < 10 ? `0${d}` : `${d}`;
      days.push({ dayNumber: d, isoDate: `2026-11-${padded}`, isCurrentMonth: true });
    }
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      const padded = d < 10 ? `0${d}` : `${d}`;
      days.push({ dayNumber: d, isoDate: `2026-12-${padded}`, isCurrentMonth: false });
    }
    return days;
  }, []);

  // Filtered schedules
  const filteredSchedules = useMemo(() => {
    return shootSchedules.filter((sch) => {
      const matchActor = selectedActorFilter === "all" || sch.actorId === selectedActorFilter;
      const matchCategory = categoryFilter === "all" || sch.category === categoryFilter;
      return matchActor && matchCategory;
    });
  }, [shootSchedules, selectedActorFilter, categoryFilter]);

  // Schedules for the selected day
  const selectedDaySchedules = useMemo(() => {
    return shootSchedules.filter((sch) => sch.isoDate === selectedIsoDate);
  }, [shootSchedules, selectedIsoDate]);

  // Conflict Detection: check if any actor has > 1 schedule on the selected day
  const detectedConflicts = useMemo(() => {
    const actorCounts: Record<string, { actorName: string; count: number; items: ShootScheduleCall[] }> = {};
    shootSchedules.forEach((sch) => {
      const key = `${sch.actorId}-${sch.isoDate}`;
      if (!actorCounts[key]) {
        actorCounts[key] = { actorName: sch.actorName, count: 0, items: [] };
      }
      actorCounts[key].count++;
      actorCounts[key].items.push(sch);
    });
    return Object.values(actorCounts).filter((item) => item.count > 1);
  }, [shootSchedules]);

  // Day conflicts for currently selected date
  const selectedDayConflicts = useMemo(() => {
    return detectedConflicts.filter((c) =>
      c.items.some((item) => item.isoDate === selectedIsoDate)
    );
  }, [detectedConflicts, selectedIsoDate]);

  const handleCreateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const actor = actors.find((a) => a.id === newSchedule.actorId) || actors[0];

    addShootSchedule({
      actorId: actor.id,
      actorName: actor.stageName,
      characterName: newSchedule.characterName,
      project: newSchedule.project,
      shootDate: newSchedule.isoDate,
      isoDate: newSchedule.isoDate,
      category: newSchedule.category,
      dayNumber: Number(newSchedule.dayNumber),
      totalDays: Number(newSchedule.totalDays),
      pickupTime: newSchedule.pickupTime,
      hmuTime: newSchedule.hmuTime,
      onSetTime: newSchedule.onSetTime,
      estimatedWrapTime: newSchedule.estimatedWrapTime,
      locationName: newSchedule.locationName,
      locationAddress: newSchedule.locationAddress,
      assignedDriver: newSchedule.assignedDriver,
      driverPhone: newSchedule.driverPhone,
      specialWardrobeNotes: newSchedule.specialWardrobeNotes,
      status: "published",
    });

    setSelectedIsoDate(newSchedule.isoDate);
    setShowAddModal(false);
  };

  const handleOpenAdjust = (sch: ShootScheduleCall) => {
    setActiveEditingSchedule(sch);
    setAdjustForm({
      pickupTime: sch.pickupTime,
      hmuTime: sch.hmuTime,
      onSetTime: sch.onSetTime,
      estimatedWrapTime: sch.estimatedWrapTime,
      specialWardrobeNotes: sch.specialWardrobeNotes,
    });
    setShowAdjustModal(true);
  };

  const handleSaveAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEditingSchedule) return;
    updateShootSchedule(activeEditingSchedule.id, adjustForm);
    setShowAdjustModal(false);
  };

  const handleExportPdf = (sch: ShootScheduleCall) => {
    generateCallSheetPDF({
      ...activeCallSheet,
      projectTitle: sch.project,
      dayNumber: sch.dayNumber || 29,
      totalDays: sch.totalDays || 52,
      date: sch.shootDate,
      generalCallTime: sch.pickupTime,
      estimatedWrapTime: sch.estimatedWrapTime,
      location: {
        ...activeCallSheet.location,
        name: sch.locationName,
        address: sch.locationAddress,
        parking: `Assigned Driver: ${sch.assignedDriver} (${sch.driverPhone})`,
      },
      castCalls: [
        {
          id: sch.id,
          castNumber: 1,
          characterName: sch.characterName,
          actorName: sch.actorName,
          pickupTime: sch.pickupTime,
          hmuTime: sch.hmuTime,
          onSetTime: sch.onSetTime,
          notes: sch.specialWardrobeNotes,
          status: "acknowledged",
        },
      ],
    });
    toast.success(`Exported official Call Sheet PDF for ${sch.actorName}.`);
  };

  return (
    <div className="space-y-6">
      {/* 1. BRAND PALETTE SIGNATURE BANNER */}
      <div className="relative overflow-hidden rounded-2xl border border-border shadow-md">
        {/* The 4-Stripe Brand Identity Palette Bar */}
        <div className="grid grid-cols-4 h-3 w-full">
          <div style={{ backgroundColor: PALETTE.navy }} title="Deep Navy (#071B2B)" />
          <div style={{ backgroundColor: PALETTE.teal }} title="Teal (#167D8D)" />
          <div style={{ backgroundColor: PALETTE.cyan }} title="Light Cyan (#B9E4E8)" />
          <div style={{ backgroundColor: PALETTE.softGrey }} title="Soft Grey (#EEEEEE)" />
        </div>

        <div className="bg-card p-5 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#071B2B] text-white">
                  <CalendarDays className="h-3.5 w-3.5 text-[#B9E4E8]" />
                </span>
                <h2 className="text-xl font-extrabold tracking-tight text-foreground">
                  Talent Schedule Palette & Calendar
                </h2>
                <Badge className="bg-[#167D8D] text-white hover:bg-[#126572] text-[10px] uppercase font-bold tracking-wider">
                  Live Dispatch
                </Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Centralized talent schedule operating system &bull; Color-coded work schedules, call times, director meetings, and live chauffeur dispatches across your entire roster.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedIsoDate("2026-11-14")}
                className="text-xs h-8 border-border"
              >
                Today (Nov 14)
              </Button>
              <Button
                size="sm"
                onClick={() => setShowAddModal(true)}
                className="bg-[#167D8D] text-white hover:bg-[#126572] text-xs h-8 shadow-sm"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add Work Schedule
              </Button>
            </div>
          </div>

          {/* PALETTE INTERACTIVE FILTER SWATCHES */}
          <div className="mt-5 pt-4 border-t border-border/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Filter className="h-3 w-3 text-[#167D8D]" />
                Schedule Categories (Brand Palette Mappings):
              </span>
              {categoryFilter !== "all" && (
                <button
                  onClick={() => setCategoryFilter("all")}
                  className="text-[11px] text-[#167D8D] font-bold hover:underline"
                >
                  Clear Category Filter
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {(Object.keys(CATEGORY_CONFIGS) as ScheduleCategory[]).map((catKey) => {
                const config = CATEGORY_CONFIGS[catKey];
                const Icon = config.icon;
                const isSelected = categoryFilter === catKey;

                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() =>
                      setCategoryFilter(categoryFilter === catKey ? "all" : catKey)
                    }
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "ring-2 ring-[#167D8D] shadow-md border-transparent"
                        : "hover:border-foreground/20 border-border bg-background"
                    }`}
                  >
                    <span
                      className="mt-0.5 flex h-4 w-4 shrink-0 rounded-full border shadow-xs"
                      style={{
                        backgroundColor: config.bgHex,
                        borderColor: config.borderHex,
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold leading-tight truncate text-foreground">
                        {config.label}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                        {config.sublabel}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 2. ACTOR ROSTER FILTER PILLS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground shrink-0 px-1">
          Roster Filter:
        </span>
        <button
          onClick={() => setSelectedActorFilter("all")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shrink-0 ${
            selectedActorFilter === "all"
              ? "bg-[#071B2B] text-white border-[#167D8D] shadow-sm ring-1 ring-[#167D8D]"
              : "bg-background text-foreground hover:bg-muted border-border"
          }`}
        >
          All Roster ({shootSchedules.length} calls)
        </button>
        {actors.map((actor) => {
          const isSelected = selectedActorFilter === actor.id;
          const count = shootSchedules.filter((s) => s.actorId === actor.id).length;
          return (
            <button
              key={actor.id}
              onClick={() => setSelectedActorFilter(actor.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all shrink-0 ${
                isSelected
                  ? "bg-[#167D8D] text-white border-primary shadow-sm"
                  : "bg-background text-foreground hover:bg-muted border-border"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={actor.avatarUrl}
                alt={actor.stageName}
                className="h-5 w-5 rounded-full object-cover"
              />
              <span className="font-bold">{actor.stageName}</span>
              <span className="text-[10px] opacity-75 font-mono">({count})</span>
            </button>
          );
        })}
      </div>

      {/* 3. CONFLICT DETECTOR ALERT BANNER (If Conflicts Exist) */}
      {selectedDayConflicts.length > 0 && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-xs">
          <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-300">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
            <span>Schedule Conflict Warning on {selectedIsoDate}:</span>
          </div>
          <div className="mt-2 space-y-1 pl-6 text-amber-800 dark:text-amber-200">
            {selectedDayConflicts.map((c) => (
              <p key={c.actorName}>
                &bull; <strong>{c.actorName}</strong> has {c.count} scheduled calls on this date (
                {c.items.map((i) => `${i.project} [${i.onSetTime}]`).join(", ")}).
              </p>
            ))}
          </div>
        </div>
      )}

      {/* 4. MAIN WORKSPACE GRID: CALENDAR + DAY INSPECTOR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Interactive Month Calendar */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="shadow-sm">
            <CardHeader className="pb-3 border-b border-border/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-foreground">
                    November 2026 Production Slate
                  </h3>
                  <Badge variant="outline" className="text-2xs font-mono">
                    {filteredSchedules.length} calls filtered
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center rounded-lg border border-border bg-muted/40 p-0.5 text-xs">
                    <button
                      onClick={() => setViewMode("month")}
                      className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                        viewMode === "month"
                          ? "bg-background text-foreground shadow-xs font-bold"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Month Grid
                    </button>
                    <button
                      onClick={() => setViewMode("timeline")}
                      className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                        viewMode === "timeline"
                          ? "bg-background text-foreground shadow-xs font-bold"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Daily Timeline
                    </button>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-3 sm:p-4">
              {viewMode === "month" ? (
                <div>
                  {/* Calendar Day-of-Week Headers */}
                  <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground py-2 border-b border-border/60">
                    <div>Mon</div>
                    <div>Tue</div>
                    <div>Wed</div>
                    <div>Thu</div>
                    <div>Fri</div>
                    <div>Sat</div>
                    <div>Sun</div>
                  </div>

                  {/* Calendar Days Grid */}
                  <div className="grid grid-cols-7 gap-1 pt-1.5">
                    {novemberDays.map((day, idx) => {
                      const isSelected = selectedIsoDate === day.isoDate;
                      const isToday = day.isoDate === "2026-11-14";
                      const daySchedules = filteredSchedules.filter(
                        (s) => s.isoDate === day.isoDate
                      );

                      return (
                        <div
                          key={`${day.isoDate}-${idx}`}
                          onClick={() => setSelectedIsoDate(day.isoDate)}
                          className={`min-h-[96px] rounded-xl p-1.5 flex flex-col justify-between border cursor-pointer transition-all ${
                            isSelected
                              ? "border-[#167D8D] bg-[#167D8D]/10 ring-2 ring-[#167D8D]/40 shadow-xs"
                              : isToday
                              ? "border-teal-500/40 bg-teal-50/40 dark:bg-teal-950/20"
                              : day.isCurrentMonth
                              ? "border-border/60 bg-card hover:border-foreground/30 hover:bg-muted/30"
                              : "border-border/30 bg-muted/10 opacity-40 hover:opacity-75"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-xs font-bold leading-none ${
                                isSelected
                                  ? "text-[#167D8D]"
                                  : isToday
                                  ? "text-teal-700 dark:text-teal-400 font-extrabold"
                                  : day.isCurrentMonth
                                  ? "text-foreground"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {day.dayNumber}
                            </span>
                            {isToday && (
                              <span className="text-[9px] font-extrabold text-[#167D8D] uppercase tracking-tighter bg-[#B9E4E8]/60 dark:bg-teal-900/60 px-1 rounded">
                                TODAY
                              </span>
                            )}
                          </div>

                          {/* Event Chips inside the day cell */}
                          <div className="space-y-1 mt-1 flex-1 overflow-hidden">
                            {daySchedules.slice(0, 2).map((sch) => {
                              const config = CATEGORY_CONFIGS[sch.category || "shoot"];
                              return (
                                <div
                                  key={sch.id}
                                  className="truncate text-[10px] px-1.5 py-0.5 rounded-md font-medium shadow-2xs border flex items-center gap-1"
                                  style={{
                                    backgroundColor: config.bgHex,
                                    color: config.textHex,
                                    borderColor: config.borderHex,
                                  }}
                                  title={`${sch.actorName} - ${sch.project} (${sch.onSetTime})`}
                                >
                                  <span className="font-mono font-bold text-[9px] opacity-80 shrink-0">
                                    {sch.onSetTime.split(" ")[0]}
                                  </span>
                                  <span className="truncate">{sch.actorName.split(" ")[0]}</span>
                                </div>
                              );
                            })}
                            {daySchedules.length > 2 && (
                              <span className="text-[9px] font-bold text-muted-foreground block text-center">
                                +{daySchedules.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Daily Timeline View */
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between px-2 pb-2 border-b border-border">
                    <span className="text-xs font-bold text-foreground">
                      Timeline for {selectedIsoDate}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {selectedDaySchedules.length} scheduled performer calls
                    </span>
                  </div>

                  {selectedDaySchedules.length > 0 ? (
                    <div className="space-y-3">
                      {selectedDaySchedules.map((sch) => {
                        const config = CATEGORY_CONFIGS[sch.category || "shoot"];
                        return (
                          <div
                            key={sch.id}
                            className="p-3.5 rounded-xl border border-border bg-card flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs shadow-xs"
                          >
                            <div className="flex items-start gap-3">
                              <span
                                className="mt-1 h-3.5 w-3.5 rounded-full shrink-0 border"
                                style={{
                                  backgroundColor: config.bgHex,
                                  borderColor: config.borderHex,
                                }}
                              />
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-sm text-foreground">
                                    {sch.actorName}
                                  </span>
                                  <Badge className={config.badgeStyle}>{config.label}</Badge>
                                </div>
                                <p className="text-muted-foreground mt-0.5">
                                  {sch.project} &bull; Role: {sch.characterName} (Day {sch.dayNumber} of {sch.totalDays})
                                </p>
                                <p className="text-2xs text-[#167D8D] font-medium mt-1">
                                  Location: {sch.locationName}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 bg-muted/30 p-2.5 rounded-lg border border-border/80">
                              <div className="text-center">
                                <span className="block text-[10px] text-muted-foreground uppercase font-bold">
                                  Pickup
                                </span>
                                <span className="font-mono font-bold text-foreground">
                                  {sch.pickupTime}
                                </span>
                              </div>
                              <div className="text-center">
                                <span className="block text-[10px] text-muted-foreground uppercase font-bold">
                                  HMU
                                </span>
                                <span className="font-mono font-bold text-foreground">
                                  {sch.hmuTime}
                                </span>
                              </div>
                              <div className="text-center">
                                <span className="block text-[10px] text-[#167D8D] uppercase font-bold">
                                  On-Set
                                </span>
                                <span className="font-mono font-bold text-[#167D8D]">
                                  {sch.onSetTime}
                                </span>
                              </div>
                              <div className="text-center">
                                <span className="block text-[10px] text-muted-foreground uppercase font-bold">
                                  Wrap
                                </span>
                                <span className="font-mono font-bold text-foreground">
                                  {sch.estimatedWrapTime}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-xs text-muted-foreground border border-dashed rounded-xl">
                      No schedule entries recorded for {selectedIsoDate}.
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (4 cols): Day Inspector & Direct Dispatches */}
        <div className="lg:col-span-4 space-y-5">
          <Card className="shadow-sm">
            <CardHeader className="pb-3 border-b border-border/80 bg-gradient-to-r from-[#071B2B] to-[#0F2E47] text-white rounded-t-xl">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#B9E4E8]">
                    Selected Shoot Date
                  </span>
                  <CardTitle className="text-base font-bold text-white mt-0.5">
                    {selectedIsoDate}
                  </CardTitle>
                </div>
                <Badge className="bg-[#167D8D] text-white border-0 text-[10px]">
                  {selectedDaySchedules.length} Calls
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
              {selectedDaySchedules.length > 0 ? (
                <div className="space-y-4">
                  {selectedDaySchedules.map((sch) => {
                    const config = CATEGORY_CONFIGS[sch.category || "shoot"];
                    return (
                      <div
                        key={sch.id}
                        className="rounded-xl border border-border p-3.5 space-y-3 bg-card shadow-xs"
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="font-extrabold text-sm text-foreground block">
                              {sch.actorName}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {sch.project} &bull; {sch.characterName}
                            </span>
                          </div>
                          <Badge className={config.badgeStyle}>
                            {config.label.split(" ")[0]}
                          </Badge>
                        </div>

                        {/* Call Times Grid */}
                        <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
                          <div className="p-1.5 rounded-lg bg-background border border-border">
                            <span className="text-[9px] text-muted-foreground block font-bold">
                              PICKUP
                            </span>
                            <span className="font-mono text-[11px] font-bold text-foreground">
                              {sch.pickupTime}
                            </span>
                          </div>
                          <div className="p-1.5 rounded-lg bg-background border border-border">
                            <span className="text-[9px] text-muted-foreground block font-bold">
                              HMU
                            </span>
                            <span className="font-mono text-[11px] font-bold text-foreground">
                              {sch.hmuTime}
                            </span>
                          </div>
                          <div className="p-1.5 rounded-lg bg-[#167D8D]/10 border border-[#167D8D]/30">
                            <span className="text-[9px] text-[#167D8D] block font-bold">
                              ON-SET
                            </span>
                            <span className="font-mono text-[11px] font-bold text-[#167D8D]">
                              {sch.onSetTime}
                            </span>
                          </div>
                          <div className="p-1.5 rounded-lg bg-background border border-border">
                            <span className="text-[9px] text-muted-foreground block font-bold">
                              WRAP
                            </span>
                            <span className="font-mono text-[11px] font-bold text-foreground">
                              {sch.estimatedWrapTime}
                            </span>
                          </div>
                        </div>

                        {/* Location & Driver */}
                        <div className="text-[11px] space-y-1 pt-2 border-t border-border/80">
                          <p className="text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-[#167D8D] shrink-0" />
                            <strong className="text-foreground">Location:</strong>{" "}
                            <span className="truncate">{sch.locationName}</span>
                          </p>
                          <p className="text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3 text-[#167D8D] shrink-0" />
                            <strong className="text-foreground">Chauffeur:</strong>{" "}
                            <span>
                              {sch.assignedDriver} ({sch.driverPhone})
                            </span>
                          </p>
                          {sch.specialWardrobeNotes && (
                            <p className="text-[10px] text-foreground italic bg-muted/40 p-2 rounded-lg mt-1 border border-border/60">
                              <strong>Notes:</strong> {sch.specialWardrobeNotes}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-2 border-t border-border/60">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenAdjust(sch)}
                            className="flex-1 h-7 text-2xs"
                          >
                            Adjust Times
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleExportPdf(sch)}
                            className="h-7 text-2xs text-[#167D8D]"
                            title="Export PDF Call Sheet"
                          >
                            <FileDown className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() =>
                              dispatchLocationToActor(
                                locations[0]?.id || "loc-1",
                                sch.actorId,
                                `Reporting call: ${sch.onSetTime}`
                              )
                            }
                            className="bg-[#167D8D] text-white hover:bg-[#126572] h-7 text-2xs"
                            title="Broadcast push notification to actor"
                          >
                            <Send className="h-3 w-3 mr-1" />
                            Dispatch
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-muted-foreground space-y-3">
                  <CalendarDays className="h-8 w-8 text-muted-foreground/40 mx-auto" />
                  <p>No performer schedules assigned for {selectedIsoDate}.</p>
                  <Button
                    size="sm"
                    onClick={() => {
                      setNewSchedule((prev) => ({ ...prev, isoDate: selectedIsoDate }));
                      setShowAddModal(true);
                    }}
                    className="bg-[#167D8D] text-white hover:bg-[#126572] text-xs"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Assign Performer to this Date
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 5. ADD WORK SCHEDULE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Schedule Performer Call / Work Milestone
                </h3>
                <p className="text-xs text-muted-foreground">
                  Assign shoot day, pitch meeting, fitting, or travel day for represented talent.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-1 text-muted-foreground hover:text-foreground"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateSchedule} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-foreground block mb-1">Performer</label>
                  <select
                    value={newSchedule.actorId}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, actorId: e.target.value })
                    }
                    className="w-full h-9 rounded-lg border border-border bg-background px-3 text-xs text-foreground"
                  >
                    {actors.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.stageName} ({a.agencyName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-foreground block mb-1">
                    Schedule Category (Palette Mapping)
                  </label>
                  <select
                    value={newSchedule.category}
                    onChange={(e) =>
                      setNewSchedule({
                        ...newSchedule,
                        category: e.target.value as ScheduleCategory,
                      })
                    }
                    className="w-full h-9 rounded-lg border border-border bg-background px-3 text-xs text-foreground"
                  >
                    <option value="shoot">Principal Photography (Deep Navy)</option>
                    <option value="pitch">Director Pitch / Callback (Teal)</option>
                    <option value="fitting">Wardrobe & HMU Tests (Light Cyan)</option>
                    <option value="travel">Production Travel & Transit (Soft Grey)</option>
                    <option value="blackout">Actor Blackout / Leave Day</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-foreground block mb-1">
                    Project / Studio
                  </label>
                  <Input
                    value={newSchedule.project}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, project: e.target.value })
                    }
                    placeholder="e.g. Chrono Raiders"
                    className="h-9 text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-foreground block mb-1">Role / Character</label>
                  <Input
                    value={newSchedule.characterName}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, characterName: e.target.value })
                    }
                    placeholder="e.g. Commander Thorne"
                    className="h-9 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-foreground block mb-1">Schedule Date</label>
                  <Input
                    type="date"
                    value={newSchedule.isoDate}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, isoDate: e.target.value })
                    }
                    className="h-9 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-foreground block mb-1">Day Number</label>
                  <Input
                    type="number"
                    value={newSchedule.dayNumber}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, dayNumber: Number(e.target.value) })
                    }
                    className="h-9 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-foreground block mb-1">Total Days</label>
                  <Input
                    type="number"
                    value={newSchedule.totalDays}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, totalDays: Number(e.target.value) })
                    }
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              {/* Call Times */}
              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-border">
                <div>
                  <label className="font-semibold text-foreground block mb-1 text-[11px]">
                    Pickup Time
                  </label>
                  <Input
                    value={newSchedule.pickupTime}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, pickupTime: e.target.value })
                    }
                    className="h-8 text-xs font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-foreground block mb-1 text-[11px]">
                    HMU Call
                  </label>
                  <Input
                    value={newSchedule.hmuTime}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, hmuTime: e.target.value })
                    }
                    className="h-8 text-xs font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#167D8D] block mb-1 text-[11px]">
                    On-Set Call
                  </label>
                  <Input
                    value={newSchedule.onSetTime}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, onSetTime: e.target.value })
                    }
                    className="h-8 text-xs font-mono border-[#167D8D]"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-foreground block mb-1 text-[11px]">
                    Wrap Time
                  </label>
                  <Input
                    value={newSchedule.estimatedWrapTime}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, estimatedWrapTime: e.target.value })
                    }
                    className="h-8 text-xs font-mono"
                    required
                  />
                </div>
              </div>

              {/* Location & Chauffeur */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
                <div>
                  <label className="font-semibold text-foreground block mb-1">Location Name</label>
                  <Input
                    value={newSchedule.locationName}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, locationName: e.target.value })
                    }
                    className="h-9 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-foreground block mb-1">
                    Assigned Chauffeur & Phone
                  </label>
                  <Input
                    value={newSchedule.assignedDriver}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, assignedDriver: e.target.value })
                    }
                    placeholder="Driver Name (e.g. Frank Perez)"
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">
                  Wardrobe & Special Prop Notes
                </label>
                <Input
                  value={newSchedule.specialWardrobeNotes}
                  onChange={(e) =>
                    setNewSchedule({ ...newSchedule, specialWardrobeNotes: e.target.value })
                  }
                  placeholder="e.g. Stunt harness fitting, prosthetic temporal scar"
                  className="h-9 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#167D8D] text-white hover:bg-[#126572] text-xs"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                  Save & Dispatch Call Sheet
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. ADJUST CALL SHEET TIMES MODAL */}
      {showAdjustModal && activeEditingSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Adjust Call Times for {activeEditingSchedule.actorName}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {activeEditingSchedule.project} &bull; {activeEditingSchedule.isoDate}
                </p>
              </div>
              <button
                onClick={() => setShowAdjustModal(false)}
                className="rounded-lg p-1 text-muted-foreground hover:text-foreground"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveAdjust} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-foreground block mb-1">Pickup Time</label>
                  <Input
                    value={adjustForm.pickupTime}
                    onChange={(e) =>
                      setAdjustForm({ ...adjustForm, pickupTime: e.target.value })
                    }
                    className="h-9 text-xs font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-foreground block mb-1">HMU Time</label>
                  <Input
                    value={adjustForm.hmuTime}
                    onChange={(e) =>
                      setAdjustForm({ ...adjustForm, hmuTime: e.target.value })
                    }
                    className="h-9 text-xs font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#167D8D] block mb-1">
                    On-Set Call Time
                  </label>
                  <Input
                    value={adjustForm.onSetTime}
                    onChange={(e) =>
                      setAdjustForm({ ...adjustForm, onSetTime: e.target.value })
                    }
                    className="h-9 text-xs font-mono border-[#167D8D]"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-foreground block mb-1">
                    Estimated Wrap
                  </label>
                  <Input
                    value={adjustForm.estimatedWrapTime}
                    onChange={(e) =>
                      setAdjustForm({ ...adjustForm, estimatedWrapTime: e.target.value })
                    }
                    className="h-9 text-xs font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">Wardrobe Notes</label>
                <Input
                  value={adjustForm.specialWardrobeNotes}
                  onChange={(e) =>
                    setAdjustForm({ ...adjustForm, specialWardrobeNotes: e.target.value })
                  }
                  className="h-9 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAdjustModal(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-[#167D8D] text-white hover:bg-[#126572] text-xs"
                >
                  Broadcast Time Shift
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

