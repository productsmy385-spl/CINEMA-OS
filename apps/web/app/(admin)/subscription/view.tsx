"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, Download, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { toast } from "sonner";

interface PlanTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  isCurrent?: boolean;
}

const plans: PlanTier[] = [
  {
    name: "Starter",
    price: "$950",
    period: "/ month",
    description: "Ideal for boutique production houses and indie filmmakers.",
    features: [
      "Up to 3 Active Film / TV Projects",
      "50 Cast & Crew Members",
      "Interactive Call Sheet Builder & PDF",
      "Basic Production Calendar",
      "Standard Email Support",
    ],
  },
  {
    name: "Studio",
    price: "$4,800",
    period: "/ month",
    description: "Designed for commercial film studios and talent agencies.",
    features: [
      "Up to 20 Active Productions",
      "250 Cast & Crew Members",
      "Real-Time WhatsApp & Push Dispatches",
      "Full GAAP Double-Entry Budget Ledger",
      "Digital Signature & Legal Vault",
      "Priority 24/7 Production Support",
    ],
    isPopular: true,
    isCurrent: true,
  },
  {
    name: "Enterprise",
    price: "$12,500",
    period: "/ month",
    description: "For major studios and multinational media networks.",
    features: [
      "Unlimited Concurrent Movie & Series Slate",
      "Unlimited Cast, Managers & Crew Seats",
      "Custom Studio Cloud & Dedicated Railway DB",
      "Custom SAG-AFTRA & Union Rule Adapters",
      "Dedicated Technical Account Executive",
      "99.99% SLA Guarantee & Cold Standby",
    ],
  },
];

export default function SubscriptionView() {
  const [activePlan, setActivePlan] = useState("Studio");

  const handleSelectPlan = (name: string) => {
    setActivePlan(name);
    toast.success(`Plan upgraded to "${name}". Invoiced via Stripe / Railway.`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="SaaS Plans & Commercial Subscriptions"
        description="Tenant subscription plans, seat allocations, storage tiers, and commercial billing history."
      />

      {/* Plan Tiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => {
          const isSelected = activePlan === p.name;
          return (
            <Card
              key={p.name}
              className={`p-6 flex flex-col justify-between relative transition-all ${
                isSelected
                  ? "border-[#167D8D] ring-2 ring-[#167D8D] shadow-lg"
                  : "border-border"
              }`}
            >
              {p.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#167D8D] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm">
                  Most Popular For Studios
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-foreground">{p.name}</h3>
                  {isSelected && (
                    <Badge variant="success" className="text-2xs">
                      CURRENT PLAN
                    </Badge>
                  )}
                </div>

                <div>
                  <span className="text-3xl font-extrabold text-foreground font-mono">{p.price}</span>
                  <span className="text-xs text-muted-foreground ml-1">{p.period}</span>
                </div>

                <p className="text-xs text-muted-foreground">{p.description}</p>

                <div className="pt-4 border-t border-border space-y-2.5 text-xs">
                  {p.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-[#167D8D] shrink-0 mt-0.5" />
                      <span className="text-foreground">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-border">
                <Button
                  onClick={() => handleSelectPlan(p.name)}
                  variant={isSelected ? "outline" : "default"}
                  className={`w-full text-xs font-semibold ${
                    isSelected
                      ? "border-[#167D8D] text-[#167D8D]"
                      : "bg-[#167D8D] text-white hover:bg-[#126572]"
                  }`}
                >
                  {isSelected ? "Active Plan" : `Upgrade to ${p.name}`}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

