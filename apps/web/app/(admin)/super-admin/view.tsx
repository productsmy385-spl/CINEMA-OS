"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  CreditCard,
  Database,
  Lock,
  Plus,
  Search,
  Server,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import { toast } from "sonner";

interface TenantRecord {
  id: string;
  name: string;
  type: "Production House" | "Talent Agency" | "Independent Manager";
  plan: "Enterprise" | "Studio" | "Professional" | "Starter";
  usersCount: number;
  projectsCount: number;
  monthlyRevenue: number;
  status: "active" | "suspended" | "trialing";
  createdDate: string;
}

const initialTenants: TenantRecord[] = [
  {
    id: "TEN-001",
    name: "Vance Global Pictures",
    type: "Production House",
    plan: "Enterprise",
    usersCount: 248,
    projectsCount: 5,
    monthlyRevenue: 12500,
    status: "active",
    createdDate: "2025-01-15",
  },
  {
    id: "TEN-002",
    name: "Apex Talent Agency",
    type: "Talent Agency",
    plan: "Studio",
    usersCount: 84,
    projectsCount: 14,
    monthlyRevenue: 4800,
    status: "active",
    createdDate: "2025-03-22",
  },
  {
    id: "TEN-003",
    name: "Silver Screen Pictures",
    type: "Production House",
    plan: "Studio",
    usersCount: 120,
    projectsCount: 3,
    monthlyRevenue: 5200,
    status: "active",
    createdDate: "2025-06-10",
  },
  {
    id: "TEN-004",
    name: "Vanguard Artists Management",
    type: "Independent Manager",
    plan: "Professional",
    usersCount: 22,
    projectsCount: 8,
    monthlyRevenue: 1800,
    status: "active",
    createdDate: "2025-09-01",
  },
  {
    id: "TEN-005",
    name: "Pacific Shoreline Productions",
    type: "Production House",
    plan: "Starter",
    usersCount: 15,
    projectsCount: 1,
    monthlyRevenue: 950,
    status: "trialing",
    createdDate: "2026-11-01",
  },
];

export default function SuperAdminView() {
  const [tenants, setTenants] = useState<TenantRecord[]>(initialTenants);
  const [search, setSearch] = useState("");
  const [showAddTenantModal, setShowAddTenantModal] = useState(false);
  const [newTenant, setNewTenant] = useState<{
    name: string;
    type: "Production House" | "Talent Agency" | "Independent Manager";
    plan: "Enterprise" | "Studio" | "Professional" | "Starter";
    adminEmail: string;
  }>({
    name: "",
    type: "Production House",
    plan: "Studio",
    adminEmail: "",
  });

  const handleToggleSuspend = (id: string, name: string, currentStatus: string) => {
    const nextStatus = currentStatus === "active" ? "suspended" : "active";
    setTenants(
      tenants.map((t) => (t.id === id ? { ...t, status: nextStatus as any } : t))
    );
    toast.warning(`Tenant "${name}" is now ${nextStatus.toUpperCase()}. Access privileges updated.`);
  };

  const handleAddTenant = (e: React.FormEvent) => {
    e.preventDefault();
    const created: TenantRecord = {
      id: `TEN-${(tenants.length + 1).toString().padStart(3, "0")}`,
      name: newTenant.name,
      type: newTenant.type,
      plan: newTenant.plan,
      usersCount: 1,
      projectsCount: 0,
      monthlyRevenue: newTenant.plan === "Enterprise" ? 12500 : 4800,
      status: "active",
      createdDate: new Date().toISOString().split("T")[0],
    };
    setTenants([...tenants, created]);
    setShowAddTenantModal(false);
    toast.success(`Tenant organization "${created.name}" provisioned. Welcome email sent to ${newTenant.adminEmail}.`);
  };

  const filteredTenants = tenants.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.type.toLowerCase().includes(search.toLowerCase())
  );

  const totalMRR = tenants.reduce((s, t) => (t.status === "active" ? s + t.monthlyRevenue : s), 0);
  const totalUsers = tenants.reduce((s, t) => s + t.usersCount, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Super Admin SaaS Control Plane"
        description="Global platform administration, tenant provisioning, subscription billing, resource quotas, and platform compliance."
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => setShowAddTenantModal(true)}
              className="bg-[#167D8D] text-white hover:bg-[#126572] text-xs"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Provision Tenant
            </Button>
          </div>
        }
      />

      {/* Security Privacy Alert Box */}
      <div className="p-3.5 rounded-xl border border-primary/30 bg-primary/5 flex items-start gap-3 text-xs">
        <ShieldCheck className="h-5 w-5 text-[#167D8D] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold text-foreground">Zero-Trust Tenant Isolation Architecture Active</p>
          <p className="text-muted-foreground leading-relaxed">
            Super Administrator accounts are strictly compartmentalized. Private actor contracts, proprietary screenplays, and detailed bank disbursements are protected by row-level cryptographic isolation and are never visible without an authorized compliance audit ticket.
          </p>
        </div>
      </div>

      {/* Global SaaS KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-[#167D8D]">
          <span className="text-2xs font-bold uppercase tracking-wider text-muted-foreground block">
            Platform MRR
          </span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-bold text-foreground font-mono">
              ${totalMRR.toLocaleString()}
            </span>
            <TrendingUp className="h-5 w-5 text-emerald-600" />
          </div>
          <span className="text-2xs text-success font-medium mt-1 block">+18.4% month-over-month growth</span>
        </Card>

        <Card className="p-4 border-l-4 border-l-[#071B2B]">
          <span className="text-2xs font-bold uppercase tracking-wider text-muted-foreground block">
            Total Provisioned Tenants
          </span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-bold text-foreground">{tenants.length} Tenants</span>
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <span className="text-2xs text-muted-foreground mt-1 block">Studios, agencies & managers</span>
        </Card>

        <Card className="p-4 border-l-4 border-l-emerald-600">
          <span className="text-2xs font-bold uppercase tracking-wider text-muted-foreground block">
            Active Registered Users
          </span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-bold text-foreground">{totalUsers} Users</span>
            <Users className="h-5 w-5 text-emerald-600" />
          </div>
          <span className="text-2xs text-muted-foreground mt-1 block">Cast, crew & executives</span>
        </Card>

        <Card className="p-4 border-l-4 border-l-amber-500">
          <span className="text-2xs font-bold uppercase tracking-wider text-muted-foreground block">
            Database & Storage Health
          </span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-bold text-foreground">99.99%</span>
            <Server className="h-5 w-5 text-amber-500" />
          </div>
          <span className="text-2xs text-success font-medium mt-1 block">Railway PostgreSQL Active</span>
        </Card>
      </div>

      {/* Tenants Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base font-bold text-foreground">Tenant Organizations Directory</CardTitle>
            <CardDescription className="text-xs">
              Manage subscription tiers, user seats, project allowances, and operational suspension states.
            </CardDescription>
          </div>
          <div className="relative w-64">
            <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tenants..."
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
                  <th className="py-2.5 px-3 font-semibold">Tenant ID</th>
                  <th className="py-2.5 px-3 font-semibold">Organization Name</th>
                  <th className="py-2.5 px-3 font-semibold">Category</th>
                  <th className="py-2.5 px-3 font-semibold">Plan Tier</th>
                  <th className="py-2.5 px-3 font-semibold">Active Seats</th>
                  <th className="py-2.5 px-3 font-semibold">MRR</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredTenants.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-muted-foreground">{tenant.id}</td>
                    <td className="py-3 px-3 font-bold text-foreground">{tenant.name}</td>
                    <td className="py-3 px-3 text-muted-foreground">{tenant.type}</td>
                    <td className="py-3 px-3">
                      <span className="rounded bg-primary/10 px-2 py-0.5 text-2xs font-bold text-primary">
                        {tenant.plan}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-foreground">{tenant.usersCount} users</td>
                    <td className="py-3 px-3 font-mono font-bold text-foreground">
                      ${tenant.monthlyRevenue.toLocaleString()}/mo
                    </td>
                    <td className="py-3 px-3">
                      <Badge
                        variant={
                          tenant.status === "active"
                            ? "success"
                            : tenant.status === "trialing"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {tenant.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Button
                        size="sm"
                        variant={tenant.status === "active" ? "outline" : "default"}
                        onClick={() => handleToggleSuspend(tenant.id, tenant.name, tenant.status)}
                        className={`h-7 text-2xs ${
                          tenant.status === "active"
                            ? "border-destructive/30 text-destructive hover:bg-destructive/10"
                            : "bg-success text-white"
                        }`}
                      >
                        {tenant.status === "active" ? "Suspend" : "Reactivate"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Provision Tenant Modal */}
      {showAddTenantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-modal space-y-4">
            <h3 className="text-base font-bold text-foreground">Provision Tenant Organization</h3>
            <form onSubmit={handleAddTenant} className="space-y-3">
              <Input
                label="Organization Legal Name"
                placeholder="e.g. Metro Goldwyn Studio"
                value={newTenant.name}
                onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
                required
              />
              <Input
                type="email"
                label="Primary Admin Email"
                placeholder="studio.admin@mgm.com"
                value={newTenant.adminEmail}
                onChange={(e) => setNewTenant({ ...newTenant, adminEmail: e.target.value })}
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Organization Type</label>
                  <select
                    className="w-full h-9 rounded-lg border border-border bg-background px-3 text-xs"
                    value={newTenant.type}
                    onChange={(e) => setNewTenant({ ...newTenant, type: e.target.value as any })}
                  >
                    <option value="Production House">Production House</option>
                    <option value="Talent Agency">Talent Agency</option>
                    <option value="Independent Manager">Independent Manager</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Subscription Plan</label>
                  <select
                    className="w-full h-9 rounded-lg border border-border bg-background px-3 text-xs"
                    value={newTenant.plan}
                    onChange={(e) => setNewTenant({ ...newTenant, plan: e.target.value as any })}
                  >
                    <option value="Enterprise">Enterprise ($12,500/mo)</option>
                    <option value="Studio">Studio ($4,800/mo)</option>
                    <option value="Professional">Professional ($1,800/mo)</option>
                    <option value="Starter">Starter ($950/mo)</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setShowAddTenantModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="default" className="bg-[#167D8D] text-white">
                  Provision Tenant
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
