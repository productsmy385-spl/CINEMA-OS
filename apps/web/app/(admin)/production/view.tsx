"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { filmProjects, studioFinancials, type FilmProject } from "@/data/film-data";
import {
  Building2,
  Calendar,
  CheckCircle2,
  Clapperboard,
  Clock,
  DollarSign,
  Film,
  Plus,
  TrendingUp,
  Users,
  Video,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function ProductionHouseView() {
  const [projectsList, setProjectsList] = useState<FilmProject[]>(filmProjects);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    code: "",
    type: "Feature Film" as const,
    director: "",
    producer: "",
    totalBudget: 15000000,
    totalShootingDays: 45,
    synopsis: "",
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    const created: FilmProject = {
      id: `proj-${Date.now()}`,
      title: newProject.title,
      code: newProject.code || `PRJ-${Date.now().toString().slice(-4)}`,
      type: newProject.type,
      phase: "Pre-Production",
      director: newProject.director,
      producer: newProject.producer,
      lineProducer: "Marcus Vance",
      totalBudget: Number(newProject.totalBudget),
      expendedBudget: 0,
      startDate: new Date().toISOString().split("T")[0],
      wrapDate: "2027-02-01",
      totalShootingDays: Number(newProject.totalShootingDays),
      completedShootingDays: 0,
      posterUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&h=800&q=80",
      synopsis: newProject.synopsis,
    };
    setProjectsList([...projectsList, created]);
    setShowNewProjectModal(false);
    toast.success(`Production workspace created for "${created.title}".`);
  };

  const totalCommitted = projectsList.reduce((sum, p) => sum + p.totalBudget, 0);
  const totalExpended = projectsList.reduce((sum, p) => sum + p.expendedBudget, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Production House Workspace"
        description="Studio operations, feature films, episodic series, departmental coordination, and global budget utilization."
        actions={
          <div className="flex items-center gap-2">
            <Link href="/call-sheets">
              <Button size="sm" variant="outline" className="text-xs">
                <Clapperboard className="h-3.5 w-3.5 mr-1 text-[#167D8D]" />
                Open Live Call Sheet
              </Button>
            </Link>
            <Button
              size="sm"
              onClick={() => setShowNewProjectModal(true)}
              className="bg-[#167D8D] text-white hover:bg-[#126572] text-xs"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              New Production
            </Button>
          </div>
        }
      />

      {/* Studio Header Card */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-card flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-[#071B2B] text-[#B9E4E8] flex items-center justify-center border border-[#167D8D]/50 shadow-md">
            <Building2 className="h-8 w-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-foreground">Vance Global Pictures</h2>
              <Badge variant="default">Verified Studio</Badge>
              <span className="text-2xs text-muted-foreground font-mono">ID: STU-88204-CA</span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Los Angeles, CA • 14 Active Sound Stages • SAG-AFTRA & DGA Signatory
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <span className="text-2xs uppercase tracking-wider text-muted-foreground block">
              Active Productions
            </span>
            <span className="text-lg font-bold text-foreground">{projectsList.length} Slated</span>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-right">
            <span className="text-2xs uppercase tracking-wider text-muted-foreground block">
              Total Studio Slate
            </span>
            <span className="text-lg font-bold text-[#167D8D] font-mono">
              ${(totalCommitted / 1_000_000).toFixed(1)}M USD
            </span>
          </div>
        </div>
      </div>

      {/* Studio Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-[#167D8D]">
          <span className="text-2xs font-bold uppercase tracking-wider text-muted-foreground block">
            Committed Production Capital
          </span>
          <span className="text-xl font-bold text-foreground font-mono mt-1 block">
            ${totalCommitted.toLocaleString()}
          </span>
          <div className="w-full bg-muted rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-[#167D8D] h-1.5"
              style={{ width: `${(totalExpended / totalCommitted) * 100}%` }}
            />
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-emerald-600">
          <span className="text-2xs font-bold uppercase tracking-wider text-muted-foreground block">
            Expended to Date
          </span>
          <span className="text-xl font-bold text-emerald-600 font-mono mt-1 block">
            ${totalExpended.toLocaleString()}
          </span>
          <span className="text-2xs text-muted-foreground mt-1 block">
            {((totalExpended / totalCommitted) * 100).toFixed(1)}% of total slate utilized
          </span>
        </Card>

        <Card className="p-4 border-l-4 border-l-primary">
          <span className="text-2xs font-bold uppercase tracking-wider text-muted-foreground block">
            Remaining Cash Reserves
          </span>
          <span className="text-xl font-bold text-foreground font-mono mt-1 block">
            ${(totalCommitted - totalExpended).toLocaleString()}
          </span>
          <span className="text-2xs text-success font-medium mt-1 block">Escrow accounts fully funded</span>
        </Card>

        <Card className="p-4 border-l-4 border-l-amber-500">
          <span className="text-2xs font-bold uppercase tracking-wider text-muted-foreground block">
            Active Crew on Payroll
          </span>
          <span className="text-xl font-bold text-foreground mt-1 block">248 Crew Members</span>
          <span className="text-2xs text-muted-foreground mt-1 block">Across 16 production departments</span>
        </Card>
      </div>

      {/* Active Productions Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
            Active Movie & Series Slate
          </h3>
          <span className="text-xs text-muted-foreground">Click a film to review shooting breakdown</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {projectsList.map((project) => {
            const progress = (project.completedShootingDays / project.totalShootingDays) * 100;
            return (
              <Card key={project.id} className="overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="relative h-44 w-full bg-slate-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.posterUrl}
                      alt={project.title}
                      className="h-full w-full object-cover opacity-80"
                    />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className="rounded bg-black/75 px-2 py-0.5 text-2xs font-bold text-white">
                        {project.code}
                      </span>
                      <Badge variant={project.phase === "Production" ? "default" : "secondary"}>
                        {project.phase}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="pt-4 pb-2 space-y-3">
                    <div>
                      <h4 className="text-base font-bold text-foreground">{project.title}</h4>
                      <p className="text-2xs text-muted-foreground line-clamp-2 mt-1">{project.synopsis}</p>
                    </div>

                    <div className="space-y-1.5 text-2xs border-t border-border pt-2.5">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Director:</span>
                        <span className="font-semibold text-foreground">{project.director}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Budget:</span>
                        <span className="font-bold text-[#167D8D] font-mono">
                          ${(project.totalBudget / 1_000_000).toFixed(1)}M USD
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shoot Progress:</span>
                        <span className="font-semibold text-foreground">
                          {project.completedShootingDays} / {project.totalShootingDays} Days ({progress.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5 mt-1 overflow-hidden">
                        <div className="bg-[#167D8D] h-1.5" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  </CardContent>
                </div>

                <div className="px-4 py-3 border-t border-border bg-muted/20 flex items-center justify-between">
                  <span className="text-2xs text-muted-foreground">Wrap: {project.wrapDate}</span>
                  <Link href="/call-sheets">
                    <Button size="sm" variant="ghost" className="h-7 text-2xs text-primary hover:bg-primary/10">
                      View Call Sheet &rarr;
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-modal space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground">Create Production Project</h3>
              <button
                onClick={() => setShowNewProjectModal(false)}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateProject} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Project Title"
                  placeholder="e.g. Chrono Raiders"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  required
                />
                <Input
                  label="Project Code"
                  placeholder="e.g. CR-2026"
                  value={newProject.code}
                  onChange={(e) => setNewProject({ ...newProject, code: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Director"
                  placeholder="e.g. Christopher Nolan"
                  value={newProject.director}
                  onChange={(e) => setNewProject({ ...newProject, director: e.target.value })}
                  required
                />
                <Input
                  label="Producer"
                  placeholder="e.g. Emma Thomas"
                  value={newProject.producer}
                  onChange={(e) => setNewProject({ ...newProject, producer: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="number"
                  label="Total Approved Budget ($ USD)"
                  value={newProject.totalBudget}
                  onChange={(e) => setNewProject({ ...newProject, totalBudget: Number(e.target.value) })}
                  required
                />
                <Input
                  type="number"
                  label="Planned Shooting Days"
                  value={newProject.totalShootingDays}
                  onChange={(e) => setNewProject({ ...newProject, totalShootingDays: Number(e.target.value) })}
                  required
                />
              </div>
              <Input
                label="Logline / Synopsis"
                placeholder="High-concept summary of the project..."
                value={newProject.synopsis}
                onChange={(e) => setNewProject({ ...newProject, synopsis: e.target.value })}
              />
              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setShowNewProjectModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="default" className="bg-[#167D8D] text-white">
                  Initialize Slate
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

