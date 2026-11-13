"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { ManagerCalendarPalette } from "../components/manager-calendar-palette";
import Link from "next/link";
import { ArrowLeft, UserCheck, Video } from "lucide-react";

export default function ManagerCalendarView() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Talent Work Schedules & Calendar Palette"
        description="Comprehensive calendar operating system for talent managers. Monitor actor call times, director pitch milestones, costume tests, and transit days with official brand palette color-coding."
        actions={
          <div className="flex items-center gap-2">
            <Link href="/manager">
              <Button size="sm" variant="outline" className="text-xs">
                <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                Manager Console
              </Button>
            </Link>
            <Link href="/manager/meetings">
              <Button size="sm" variant="outline" className="text-xs">
                <Video className="h-3.5 w-3.5 mr-1 text-[#167D8D]" />
                Director Pitches
              </Button>
            </Link>
          </div>
        }
      />

      <ManagerCalendarPalette />
    </div>
  );
}

