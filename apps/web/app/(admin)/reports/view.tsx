"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { filmProjects, studioFinancials } from "@/data/film-data";
import {
  BarChart3,
  Calendar,
  CheckCircle2,
  Download,
  Film,
  TrendingUp,
  Users,
} from "lucide-react";
import { toast } from "sonner";

export default function ReportsView() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Production Analytics & Daily Executive Reports"
        description="Comprehensive Daily Production Reports (DPR), budget variance curves, shooting velocity, and studio profitability."
        actions={
          <Button
            size="sm"
            onClick={() => toast.success("Executive PDF Studio Report generated.")}
            className="bg-[#167D8D] text-white hover:bg-[#126572] text-xs"
          >
            <Download className="h-3.5 w-3.5 mr-1" />
            Export Executive Report
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="p-4 space-y-3">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
            <Film className="h-4 w-4" />
            <span>Shooting Schedule Velocity</span>
          </div>
          <span className="text-2xl font-bold text-foreground">5.2 Pages / Day</span>
          <p className="text-2xs text-muted-foreground">
            Averaging 108% of planned daily script page coverage across principal photography.
          </p>
        </Card>

        <Card className="p-4 space-y-3">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
            <TrendingUp className="h-4 w-4" />
            <span>Projected Studio Gross Margin</span>
          </div>
          <span className="text-2xl font-bold text-emerald-600">34.8%</span>
          <p className="text-2xs text-muted-foreground">
            Estimated net margin based on theatrical minimum guarantees and international pre-sales.
          </p>
        </Card>

        <Card className="p-4 space-y-3">
          <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-wider">
            <Users className="h-4 w-4" />
            <span>Crew Overtime Efficiency</span>
          </div>
          <span className="text-2xl font-bold text-foreground">96.2%</span>
          <p className="text-2xs text-muted-foreground">
            Total days wrapped before 12-hour turnaround limit with zero meal penalty violations.
          </p>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-foreground">Daily Production Report (DPR) Archive</CardTitle>
          <CardDescription className="text-xs">
            Official signed daily logs containing scene footage, camera roll counts, sound card counts, and weather logs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border text-xs">
            {[
              { day: "Day 28 of 52", date: "Nov 13, 2026", scenes: "Sc. 40, 41, 41A", footage: "4,200 ft IMAX 70mm", wrap: "Wrapped 18:45 on time" },
              { day: "Day 27 of 52", date: "Nov 12, 2026", scenes: "Sc. 38, 39", footage: "3,800 ft IMAX 70mm", wrap: "Wrapped 19:10 (+15m wind delay)" },
              { day: "Day 26 of 52", date: "Nov 11, 2026", scenes: "Sc. 36B, 37", footage: "4,600 ft IMAX 70mm", wrap: "Wrapped 18:30 on time" },
            ].map((dpr, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-foreground block">{dpr.day} - {dpr.date}</span>
                  <span className="text-2xs text-muted-foreground">
                    Scenes: {dpr.scenes} • Footage: {dpr.footage}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="success">{dpr.wrap}</Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toast.info(`Downloading DPR archive for ${dpr.day}...`)}
                    className="h-7 text-2xs text-primary"
                  >
                    View DPR &rarr;
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

