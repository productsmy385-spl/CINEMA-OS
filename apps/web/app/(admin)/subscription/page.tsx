import type { Metadata } from "next";
import SubscriptionView from "./view";

export const metadata: Metadata = {
  title: "Plans & Subscription Billing | CINEMA OS",
  description: "Commercial multi-tier SaaS subscription plans, storage quotas, and enterprise feature flags.",
};

export default function SubscriptionPage() {
  return <SubscriptionView />;
}

