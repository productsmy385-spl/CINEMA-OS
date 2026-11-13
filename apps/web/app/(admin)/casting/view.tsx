"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  CheckCircle2,
  FileCheck,
  Filter,
  Plus,
  Search,
  Sparkles,
  User,
  Users,
  Video,
} from "lucide-react";
import { toast } from "sonner";

interface CastingCall {
  id: string;
  project: string;
  characterName: string;
  roleType: "Lead" | "Supporting" | "Cameo" | "Stunt Double";
  ageRange: string;
  gender: string;
  compensation: string;
  description: string;
  auditionDate: string;
  status: "open" | "shortlisting" | "locked";
  submissionsCount: number;
}

const initialCastingCalls: CastingCall[] = [
  {
    id: "CAST-101",
    project: "Silicon Sunset",
    characterName: "Dr. Maya Lin",
    roleType: "Lead",
    ageRange: "30-40",
    gender: "Female",
    compensation: "$12,000 / Day (SAG Tier 1)",
    description: "Brilliant, emotionally detached AI alignment researcher who discovers a catastrophic covert training cluster.",
    auditionDate: "2026-11-25",
    status: "shortlisting",
    submissionsCount: 48,
  },
  {
    id: "CAST-102",
    project: "Silicon Sunset",
    characterName: "Cassian Reed",
    roleType: "Supporting",
    ageRange: "35-50",
    gender: "Male",
    compensation: "$7,500 / Day",
    description: "Venture capitalist with shadowy defense department connections. High charisma, intimidating presence.",
    auditionDate: "2026-11-28",
    status: "open",
    submissionsCount: 72,
  },
  {
    id: "CAST-103",
    project: "Chrono Raiders",
    characterName: "Temporal Gatekeeper",
    roleType: "Cameo",
    ageRange: "50+",
    gender: "Any",
    compensation: "$15,000 Total Fee",
    description: "Enigmatic oracle stationed at the event horizon of the ancient Roman temporal rift.",
    auditionDate: "2026-11-18",
    status: "locked",
    submissionsCount: 14,
  },
];

export default function CastingView() {
  const [castingList, setCastingList] = useState<CastingCall[]>(initialCastingCalls);
  const [selectedCall, setSelectedCall] = useState<CastingCall>(initialCastingCalls[0]);
  const [showNewCallModal, setShowNewCallModal] = useState(false);
  const [newCall, setNewCall] = useState({
    project: "Silicon Sunset",
    characterName: "",
    roleType: "Lead" as const,
    ageRange: "25-35",
    gender: "Any",
    compensation: "$8,500 / Day",
    description: "",
    auditionDate: "2026-12-05",
  });

  const handleCreateCall = (e: React.FormEvent) => {
    e.preventDefault();
    const created: CastingCall = {
      id: `CAST-${(castingList.length + 101).toString()}`,
      project: newCall.project,
      characterName: newCall.characterName,
      roleType: newCall.roleType,
      ageRange: newCall.ageRange,
      gender: newCall.gender,
      compensation: newCall.compensation,
      description: newCall.description,
      auditionDate: newCall.auditionDate,
      status: "open",
      submissionsCount: 0,
    };
    setCastingList([...castingList, created]);
    setShowNewCallModal(false);
    toast.success(`Casting call published for "${created.characterName}". Distributed to talent agents.`);
  };

  const handleShortlistCandidate = (actorName: string) => {
    toast.success(`${actorName} shortlisted. Role assignment agreement workflow triggered.`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Casting & Role Management"
        description="Character breakdowns, casting notices, audition appointments, portfolio review, and automated role assignments."
        actions={
          <Button
            size="sm"
            onClick={() => setShowNewCallModal(true)}
            className="bg-[#167D8D] text-white hover:bg-[#126572] text-xs"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Publish Casting Call
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Casting Calls List */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-foreground">Active Character Breakdowns</CardTitle>
              <CardDescription className="text-xs">
                Select a character to review actor submissions and audition recordings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {castingList.map((call) => {
                const isSelected = selectedCall.id === call.id;
                return (
                  <div
                    key={call.id}
                    onClick={() => setSelectedCall(call)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "border-[#167D8D] bg-[#167D8D]/5 shadow-sm ring-1 ring-[#167D8D]"
                        : "border-border bg-card hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-2xs font-bold text-primary">{call.project}</span>
                      <Badge
                        variant={
                          call.status === "locked"
                            ? "success"
                            : call.status === "shortlisting"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {call.status.toUpperCase()}
                      </Badge>
                    </div>
                    <h4 className="text-sm font-bold text-foreground">{call.characterName}</h4>
                    <p className="text-2xs text-muted-foreground mt-0.5 line-clamp-1">{call.description}</p>
                    <div className="mt-2.5 pt-2 border-t border-border flex items-center justify-between text-2xs">
                      <span className="font-semibold text-foreground">{call.roleType} • {call.ageRange} yrs</span>
                      <span className="text-primary font-bold">{call.submissionsCount} Submissions</span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Character Details & Submissions Review */}
        <div className="lg:col-span-7 space-y-4">
          <Card>
            <CardHeader className="pb-3 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-foreground">{selectedCall.characterName}</h3>
                  <p className="text-xs text-muted-foreground">
                    {selectedCall.project} • Role: {selectedCall.roleType}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#167D8D] font-mono block">
                    {selectedCall.compensation}
                  </span>
                  <span className="text-2xs text-muted-foreground">Audition Date: {selectedCall.auditionDate}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                  Character Requirements & Bio
                </span>
                <p className="text-xs text-foreground leading-relaxed bg-muted/30 p-3 rounded-lg border border-border">
                  {selectedCall.description}
                </p>
              </div>

              {/* Submissions & Audition Tapes */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Candidate Submissions & Tapes ({selectedCall.submissionsCount})
                  </span>
                  <span className="text-2xs text-primary font-semibold">Casting Notes Enabled</span>
                </div>

                <div className="space-y-2 text-xs">
                  {[
                    { name: "Elena Rostova", agency: "Apex Talent", match: "98% Match", status: "Director Shortlist" },
                    { name: "Sophia Chen", agency: "Creative Artists", match: "92% Match", status: "Self-Tape Received" },
                    { name: "Amara Vance", agency: "Vanguard", match: "86% Match", status: "Under Review" },
                  ].map((cand, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border border-border bg-card flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-xs text-primary">
                          {cand.name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{cand.name}</p>
                          <p className="text-2xs text-muted-foreground">{cand.agency} • {cand.match}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-2xs">
                          {cand.status}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleShortlistCandidate(cand.name)}
                          className="h-7 text-2xs text-primary border-primary/40 hover:bg-primary/10"
                        >
                          Lock Role
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* New Casting Call Modal */}
      {showNewCallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-modal space-y-4">
            <h3 className="text-base font-bold text-foreground">Publish Casting Call</h3>
            <form onSubmit={handleCreateCall} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Character Name"
                  placeholder="e.g. Detective Vance"
                  value={newCall.characterName}
                  onChange={(e) => setNewCall({ ...newCall, characterName: e.target.value })}
                  required
                />
                <Input
                  label="Project"
                  value={newCall.project}
                  onChange={(e) => setNewCall({ ...newCall, project: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Age Range"
                  value={newCall.ageRange}
                  onChange={(e) => setNewCall({ ...newCall, ageRange: e.target.value })}
                  required
                />
                <Input
                  label="Compensation / Rate"
                  value={newCall.compensation}
                  onChange={(e) => setNewCall({ ...newCall, compensation: e.target.value })}
                  required
                />
              </div>
              <Input
                label="Character Breakdown & Audition Sides"
                placeholder="Psychological background, accent requirements, physical stunt needs..."
                value={newCall.description}
                onChange={(e) => setNewCall({ ...newCall, description: e.target.value })}
                required
              />
              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setShowNewCallModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="default" className="bg-[#167D8D] text-white">
                  Publish Call
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

