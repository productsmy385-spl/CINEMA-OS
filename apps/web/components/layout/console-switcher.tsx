"use client";

import React, { useState, useRef, useEffect } from "react";
import { useCinema, ConsoleRole, consolePersonas } from "@/lib/cinema-context";
import { cn } from "@/lib/utils";
import { Building2, Check, ChevronDown, Sparkles, UserCheck, Shield } from "lucide-react";
import { useRouter } from "next/navigation";

const roleIcons: Record<ConsoleRole, React.ComponentType<{ className?: string }>> = {
  manager: UserCheck,
  producer: Building2,
  actor: Sparkles,
};

const consoleDescriptions: Record<ConsoleRole, string> = {
  manager: "Manage talent roster, arrange director pitches, approve schedules & dispatch live GPS.",
  producer: "Executive studio slate, master call sheets, budgets, casting approvals & crew.",
  actor: "Personal daily call sheets, reporting times, meeting agendas & chauffeur contacts.",
};

export function ConsoleSwitcher() {
  const { activeConsole, setActiveConsole, currentPersona } = useCinema();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectRole = (role: ConsoleRole) => {
    setActiveConsole(role);
    setIsOpen(false);
    const targetUrl = consolePersonas[role].homeUrl;
    router.push(targetUrl);
  };

  const ActiveIcon = roleIcons[activeConsole];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className={cn(
          "flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold shadow-sm transition-all",
          activeConsole === "manager"
            ? "border-teal-500/30 bg-teal-500/10 text-teal-800 hover:bg-teal-500/20 dark:text-teal-300"
            : activeConsole === "producer"
            ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-800 hover:bg-indigo-500/20 dark:text-indigo-300"
            : "border-cyan-500/30 bg-cyan-500/10 text-cyan-800 hover:bg-cyan-500/20 dark:text-cyan-300"
        )}
        aria-label="Switch authorized role console"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-current/15">
          <ActiveIcon className="h-3.5 w-3.5" />
        </span>
        <div className="flex flex-col text-left">
          <span className="text-[10px] uppercase tracking-wider font-extrabold opacity-75">
            Authorized Console
          </span>
          <span className="font-bold leading-tight flex items-center gap-1">
            {currentPersona.badgeLabel}
          </span>
        </div>
        <ChevronDown
          className={cn(
            "ml-1 h-3.5 w-3.5 opacity-60 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-2 w-80 rounded-2xl border border-border bg-card p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 border-b border-border/60 mb-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
              <Shield className="h-3.5 w-3.5 text-teal-600" />
              CINEMA OS Role Authorization
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Switch role console to experience workflows from each verified stakeholder perspective.
            </p>
          </div>

          <div className="space-y-1">
            {(Object.keys(consolePersonas) as ConsoleRole[]).map((roleKey) => {
              const persona = consolePersonas[roleKey];
              const Icon = roleIcons[roleKey];
              const isSelected = activeConsole === roleKey;

              return (
                <button
                  key={roleKey}
                  type="button"
                  onClick={() => handleSelectRole(roleKey)}
                  className={cn(
                    "w-full flex items-start gap-3 rounded-xl p-2.5 text-left transition-all",
                    isSelected
                      ? "bg-primary/10 border border-primary/20 text-foreground"
                      : "hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div
                    className={cn(
                      "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg shadow-sm font-bold",
                      roleKey === "manager"
                        ? "bg-teal-600 text-white"
                        : roleKey === "producer"
                        ? "bg-[#071B2B] text-white"
                        : "bg-cyan-700 text-white"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">
                        {persona.badgeLabel}
                      </span>
                      {isSelected && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-teal-600 bg-teal-50 dark:bg-teal-950/60 px-1.5 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
                          <Check className="h-2.5 w-2.5" /> Active
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-medium text-foreground/80 mt-0.5">
                      {persona.name} &bull; {persona.organization}
                    </p>
                    <p className="text-[10px] text-muted-foreground line-clamp-2 mt-0.5">
                      {consoleDescriptions[roleKey]}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-2 border-t border-border/60 pt-2 px-2 text-[10px] text-muted-foreground text-center">
            Signed into CINEMA OS Multi-Tenant Production Cloud
          </div>
        </div>
      )}
    </div>
  );
}

