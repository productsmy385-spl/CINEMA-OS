"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { studioFinancials } from "@/data/film-data";
import {
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Plus,
  Receipt,
  Search,
  Upload,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

interface ExpenseRecord {
  id: string;
  project: string;
  vendor: string;
  category: string;
  amount: number;
  status: "approved" | "pending" | "rejected" | "reimbursed";
  date: string;
  submittedBy: string;
}

export default function ExpensesView() {
  const [expensesList, setExpensesList] = useState<ExpenseRecord[]>(
    studioFinancials.recentExpenses as ExpenseRecord[]
  );
  const [search, setSearch] = useState("");
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [newExp, setNewExp] = useState({
    project: "Chrono Raiders",
    vendor: "",
    category: "Camera Equipment",
    amount: 1200,
    submittedBy: "Marcus Vance",
  });

  const handleApprove = (id: string, vendor: string) => {
    setExpensesList(
      expensesList.map((e) => (e.id === id ? { ...e, status: "approved" } : e))
    );
    toast.success(`Expense ${id} for "${vendor}" approved. Queued for AP disbursement.`);
  };

  const handleReject = (id: string, vendor: string) => {
    setExpensesList(
      expensesList.map((e) => (e.id === id ? { ...e, status: "rejected" } : e))
    );
    toast.error(`Expense ${id} for "${vendor}" rejected. Notification sent to submitter.`);
  };

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const created: ExpenseRecord = {
      id: `EXP-${(expensesList.length + 8894).toString()}`,
      project: newExp.project,
      vendor: newExp.vendor,
      category: newExp.category,
      amount: Number(newExp.amount),
      status: "pending",
      date: new Date().toISOString().split("T")[0],
      submittedBy: newExp.submittedBy,
    };
    setExpensesList([created, ...expensesList]);
    setShowSubmitModal(false);
    toast.success(`Expense receipt submitted for $${created.amount}. Awaiting UPM approval.`);
  };

  const filtered = expensesList.filter(
    (e) =>
      e.vendor.toLowerCase().includes(search.toLowerCase()) ||
      e.category.toLowerCase().includes(search.toLowerCase()) ||
      e.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Production Expenses & Reimbursements"
        description="Daily petty cash, equipment rentals, location permit fees, vendor invoices, and approval workflows."
        actions={
          <Button
            size="sm"
            onClick={() => setShowSubmitModal(true)}
            className="bg-[#167D8D] text-white hover:bg-[#126572] text-xs"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Submit Expense Receipt
          </Button>
        }
      />

      {/* Expenses Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base font-bold text-foreground">Recent Expense Submissions</CardTitle>
            <CardDescription className="text-xs">
              Review receipt attachments, verify tax accounts, and approve disbursements.
            </CardDescription>
          </div>
          <div className="relative w-64">
            <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8 pl-8 pr-3 text-xs rounded-lg border border-border bg-background"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-muted-foreground">
                  <th className="py-2.5 px-3 font-semibold">Expense ID</th>
                  <th className="py-2.5 px-3 font-semibold">Project</th>
                  <th className="py-2.5 px-3 font-semibold">Vendor / Payee</th>
                  <th className="py-2.5 px-3 font-semibold">Category</th>
                  <th className="py-2.5 px-3 font-semibold">Amount</th>
                  <th className="py-2.5 px-3 font-semibold">Submitted By</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((exp) => (
                  <tr key={exp.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-muted-foreground">{exp.id}</td>
                    <td className="py-3 px-3 font-semibold text-foreground">{exp.project}</td>
                    <td className="py-3 px-3 font-bold text-foreground">{exp.vendor}</td>
                    <td className="py-3 px-3 text-muted-foreground">{exp.category}</td>
                    <td className="py-3 px-3 font-mono font-bold text-foreground">
                      ${exp.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-muted-foreground">{exp.submittedBy}</td>
                    <td className="py-3 px-3">
                      <Badge
                        variant={
                          exp.status === "approved"
                            ? "success"
                            : exp.status === "pending"
                            ? "warning"
                            : "destructive"
                        }
                      >
                        {exp.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {exp.status === "pending" ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleApprove(exp.id, exp.vendor)}
                            className="h-7 text-2xs bg-success text-white hover:bg-success/90"
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(exp.id, exp.vendor)}
                            className="h-7 text-2xs border-destructive/40 text-destructive hover:bg-destructive/10"
                          >
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-2xs text-muted-foreground font-semibold">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Submit Expense Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-modal space-y-4">
            <h3 className="text-base font-bold text-foreground">Submit Production Expense</h3>
            <form onSubmit={handleCreateExpense} className="space-y-3">
              <Input
                label="Vendor / Payee Name"
                placeholder="e.g. Panavision Hollywood"
                value={newExp.vendor}
                onChange={(e) => setNewExp({ ...newExp, vendor: e.target.value })}
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="number"
                  label="Amount ($ USD)"
                  value={newExp.amount}
                  onChange={(e) => setNewExp({ ...newExp, amount: Number(e.target.value) })}
                  required
                />
                <Input
                  label="Project"
                  value={newExp.project}
                  onChange={(e) => setNewExp({ ...newExp, project: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Expense Category</label>
                <select
                  className="w-full h-9 rounded-lg border border-border bg-background px-3 text-xs"
                  value={newExp.category}
                  onChange={(e) => setNewExp({ ...newExp, category: e.target.value })}
                >
                  <option value="Camera Equipment">Camera Equipment</option>
                  <option value="Lighting & Grip">Lighting & Grip</option>
                  <option value="Location Permits">Location Permits</option>
                  <option value="Catering & Craft">Catering & Craft</option>
                  <option value="Transportation & Fuel">Transportation & Fuel</option>
                  <option value="Art Department">Art Department</option>
                </select>
              </div>
              <div className="p-4 rounded-lg border border-dashed border-border text-center text-xs text-muted-foreground hover:bg-muted/40 cursor-pointer">
                <Upload className="h-6 w-6 mx-auto mb-1 text-primary" />
                <span className="font-semibold block text-foreground">Upload Receipt / Invoice (PDF or JPG)</span>
                <span className="text-2xs">Max file size 10MB • Auto-OCR Enabled</span>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setShowSubmitModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="default" className="bg-[#167D8D] text-white">
                  Submit for Approval
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

