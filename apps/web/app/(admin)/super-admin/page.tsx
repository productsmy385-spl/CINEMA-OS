import type { Metadata } from "next";
import SuperAdminView from "./view";

export const metadata: Metadata = {
  title: "Super Admin SaaS Console | CINEMA OS",
  description: "Global multi-tenant administration, plan entitlements, platform MRR, and compliance control plane.",
};

export default function SuperAdminPage() {
  return <SuperAdminView />;
}

