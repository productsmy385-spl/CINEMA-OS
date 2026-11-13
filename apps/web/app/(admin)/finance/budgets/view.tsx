"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { studioFinancials, filmProjects } from "@/data/film-data";
import {
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  Download,
  FileSpreadsheet,
  PieChart,
  Plus,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

export default function ProductionBudgetsView() {
  const [departmentData, setDepartmentData] = useState(studioFinancials.departmentBreakdown);
  const totalAllocated = departmentData.reduce((s, d) => s + d.allocated, 0);
  const totalSpent = departmentData.reduce((s, d) => s + d.spent, 0);
  const totalVariance = totalAllocated - totalSpent;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Production Budgets & Cost Reporting"
        description="Line-item production accounting, Above-The-Line and Below-The-Line variance, and escrow cash flow."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.success("Exporting GAAP-compliant General Ledger CSV...")}
              className="text-xs"
            >
              <Download className="h-3.5 w-3.5 mr-1" />
              Export CSV Ledger
            </Button>
            <Button
              size="sm"
              onClick={() => toast.info("New Budget Line Allocation modal opened.")}
              className="bg-[#167D8D] text-white hover:bg-[#126572] text-xs"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Budget Line
            </Button>
          </div>
        }
      />

      {/* Financial Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-[#167D8D]">
          <span className="text-2xs font-bold uppercase tracking-wider text-muted-foreground block">
            Approved Slate Budget
          </span>
          <span className="text-2xl font-bold text-foreground font-mono mt-1 block">
            ${totalAllocated.toLocaleString()}
          </span>
          <span className="text-2xs text-muted-foreground mt-1 block">Committed across 5 productions</span>
        </Card>

        <Card className="p-4 border-l-4 border-l-emerald-600">
          <span className="text-2xs font-bold uppercase tracking-wider text-muted-foreground block">
            Actual Expended to Date
          </span>
          <span className="text-2xl font-bold text-emerald-600 font-mono mt-1 block">
            ${totalSpent.toLocaleString()}
          </span>
          <span className="text-2xs text-muted-foreground mt-1 block">
            {((totalSpent / totalAllocated) * 100).toFixed(1)}% burn rate
          </span>
        </Card>

        <Card className="p-4 border-l-4 border-l-primary">
          <span className="text-2xs font-bold uppercase tracking-wider text-muted-foreground block">
            Remaining Cash Buffer
          </span>
          <span className="text-2xl font-bold text-[#167D8D] font-mono mt-1 block">
            ${totalVariance.toLocaleString()}
          </span>
          <span className="text-2xs text-success font-medium mt-1 block">Positive variance on schedule</span>
        </Card>

        <Card className="p-4 border-l-4 border-l-amber-500">
          <span className="text-2xs font-bold uppercase tracking-wider text-muted-foreground block">
            Contingency Reserve
          </span>
          <span className="text-2xl font-bold text-foreground font-mono mt-1 block">
            $15,000,000
          </span>
          <span className="text-2xs text-muted-foreground mt-1 block">10% unencumbered cushion</span>
        </Card>
      </div>

      {/* Department Line-Item Budget Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-foreground">
            Departmental Budget Allocation & Variance
          </CardTitle>
          <CardDescription className="text-xs">
            Standard film industry chart of accounts covering cast, camera, grip, locations, art, and VFX.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-muted-foreground">
                  <th className="py-2.5 px-3 font-semibold">Department / Account Code</th>
                  <th className="py-2.5 px-3 font-semibold">Approved Allocation</th>
                  <th className="py-2.5 px-3 font-semibold">Expended to Date</th>
                  <th className="py-2.5 px-3 font-semibold">Variance ($)</th>
                  <th className="py-2.5 px-3 font-semibold">Utilization</th>
                  <th className="py-2.5 px-3 font-semibold">Health Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {departmentData.map((dept, i) => {
                  const variance = dept.allocated - dept.spent;
                  const percentUsed = (dept.spent / dept.allocated) * 100;
                  return (
                    <tr key={i} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-3 font-bold text-foreground">{dept.department}</td>
                      <td className="py-3 px-3 font-mono font-semibold text-foreground">
                        ${dept.allocated.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 font-mono font-semibold text-emerald-600">
                        ${dept.spent.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-[#167D8D]">
                        ${variance.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 w-40">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-2 rounded-full ${
                                percentUsed > 90
                                  ? "bg-rose-500"
                                  : percentUsed > 70
                                  ? "bg-amber-500"
                                  : "bg-[#167D8D]"
                              }`}
                              style={{ width: `${percentUsed}%` }}
                            />
                          </div>
                          <span className="text-2xs font-mono font-semibold text-muted-foreground w-10">
                            {percentUsed.toFixed(0)}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant={percentUsed > 90 ? "warning" : "success"}>
                          {percentUsed > 90 ? "MONITOR" : "ON TRACK"}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

