"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { filmProjects, type FilmProject } from "@/data/film-data";
import {
  Calendar,
  CheckCircle2,
  Clapperboard,
  Clock,
  DollarSign,
  FileText,
  Film,
  Plus,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function ProjectsView() {
  const [selectedProject, setSelectedProject] = useState<FilmProject>(filmProjects[0]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Project & Movie Management"
        description="Comprehensive lifecycle management across feature films, episodic series, commercials, and short films."
        actions={
          <div className="flex items-center gap-2">
            <Link href="/call-sheets">
              <Button size="sm" variant="default" className="bg-[#167D8D] text-white hover:bg-[#126572] text-xs">
                <Clapperboard className="h-3.5 w-3.5 mr-1" />
                Open Active Call Sheet
              </Button>
            </Link>
          </div>
        }
      />

      {/* Project Selector Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filmProjects.map((p) => {
          const isSelected = selectedProject.id === p.id;
          const progress = (p.completedShootingDays / p.totalShootingDays) * 100;
          return (
            <div
              key={p.id}
              onClick={() => setSelectedProject(p)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? "border-[#167D8D] bg-[#167D8D]/5 shadow-sm ring-1 ring-[#167D8D]"
                  : "border-border bg-card hover:bg-muted/40"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Badge variant={p.phase === "Production" ? "default" : "secondary"}>
                  {p.phase}
                </Badge>
                <span className="text-2xs font-bold text-muted-foreground font-mono">{p.code}</span>
              </div>
              <h3 className="text-sm font-bold text-foreground">{p.title}</h3>
              <p className="text-2xs text-muted-foreground mt-0.5 line-clamp-1">{p.synopsis}</p>

              <div className="mt-3 pt-3 border-t border-border/80 flex items-center justify-between text-2xs">
                <span className="font-mono font-bold text-[#167D8D]">
                  ${(p.totalBudget / 1_000_000).toFixed(1)}M USD
                </span>
                <span className="text-muted-foreground">
                  {p.completedShootingDays} / {p.totalShootingDays} Days
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Project Full Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-4">
          <Card>
            <CardHeader className="pb-3 border-b border-border">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg font-bold text-foreground">{selectedProject.title}</CardTitle>
                    <span className="rounded bg-muted px-2 py-0.5 text-2xs font-mono font-semibold">
                      {selectedProject.code}
                    </span>
                  </div>
                  <CardDescription className="text-xs mt-1">
                    Directed by {selectedProject.director} • Produced by {selectedProject.producer}
                  </CardDescription>
                </div>
                <Badge variant="default" className="text-xs">
                  Phase: {selectedProject.phase}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                  Story Synopsis
                </h4>
                <p className="text-xs text-foreground leading-relaxed">{selectedProject.synopsis}</p>
              </div>

              {/* Lifecycle Progress Bar */}
              <div className="pt-2 border-t border-border">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Production Milestone Tracker
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-2xs">
                  {["Concept", "Pre-Production", "Production", "Post-Production", "Wrap"].map((stage, idx) => {
                    const isDone =
                      (selectedProject.phase === "Production" && idx <= 2) ||
                      (selectedProject.phase === "Post-Production" && idx <= 3) ||
                      (selectedProject.phase === "Pre-Production" && idx <= 1);
                    return (
                      <div
                        key={idx}
                        className={`p-2 rounded-lg border font-semibold ${
                          isDone
                            ? "bg-[#167D8D]/10 border-[#167D8D] text-[#167D8D]"
                            : "bg-muted/40 border-border text-muted-foreground"
                        }`}
                      >
                        {stage}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Financial Snapshot */}
              <div className="pt-2 border-t border-border">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Production Budget Execution
                </h4>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-muted/40">
                    <span className="text-muted-foreground block text-2xs">Approved Budget</span>
                    <span className="font-bold text-foreground font-mono">
                      ${selectedProject.totalBudget.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/40">
                    <span className="text-muted-foreground block text-2xs">Actual Expended</span>
                    <span className="font-bold text-emerald-600 font-mono">
                      ${selectedProject.expendedBudget.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/40">
                    <span className="text-muted-foreground block text-2xs">Available Contingency</span>
                    <span className="font-bold text-primary font-mono">
                      ${(selectedProject.totalBudget - selectedProject.expendedBudget).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Key Details & Quick Action */}
        <div className="lg:col-span-4 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-foreground">Production Operations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-border">
                <span className="text-muted-foreground">Line Producer:</span>
                <span className="font-semibold text-foreground">{selectedProject.lineProducer}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border">
                <span className="text-muted-foreground">Start of Shoot:</span>
                <span className="font-semibold text-foreground">{selectedProject.startDate}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border">
                <span className="text-muted-foreground">Target Wrap:</span>
                <span className="font-semibold text-foreground">{selectedProject.wrapDate}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Total Shoot Days:</span>
                <span className="font-semibold text-foreground">{selectedProject.totalShootingDays} Days</span>
              </div>

              <div className="pt-2">
                <Link href="/call-sheets">
                  <Button className="w-full bg-[#167D8D] text-white hover:bg-[#126572] text-xs">
                    <Clapperboard className="h-3.5 w-3.5 mr-1.5" />
                    Open Day 29 Call Sheet
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

