import type { NavGroup } from "@/types";
import type { ConsoleRole } from "@/lib/cinema-context";
import {
  CalendarDays,
  Clapperboard,
  Clock,
  DollarSign,
  FileSpreadsheet,
  FileText,
  Film,
  FolderLock,
  MapPin,
  MessageSquare,
  Plane,
  Receipt,
  Sparkles,
  User,
  UserCheck,
  Users,
  Video,
  Building2,
} from "lucide-react";

export const defaultNavigation: NavGroup[] = [
  {
    label: "Talent Management",
    items: [
      {
        title: "Manager Console",
        href: "/manager",
        icon: UserCheck,
        badge: "Core",
      },
      {
        title: "Actor Workspaces",
        href: "/actors",
        icon: User,
      },
      {
        title: "Meetings & Pitches",
        href: "/manager/meetings",
        icon: Video,
        badge: "Live",
      },
      {
        title: "Schedules & Call Sheets",
        href: "/call-sheets",
        icon: Clapperboard,
      },
      {
        title: "Location Updates & Fleet",
        href: "/locations",
        icon: MapPin,
      },
    ],
  },
  {
    label: "Production Operations",
    items: [
      {
        title: "Production House",
        href: "/production",
        icon: Building2,
      },
      {
        title: "Projects & Movies",
        href: "/projects",
        icon: Film,
      },
      {
        title: "Casting & Roles",
        href: "/casting",
        icon: Sparkles,
      },
      {
        title: "Master Calendar",
        href: "/calendar",
        icon: CalendarDays,
      },
      {
        title: "Daily Attendance",
        href: "/attendance",
        icon: Clock,
      },
      {
        title: "Crew & Departments",
        href: "/crew",
        icon: Users,
      },
    ],
  },
  {
    label: "Business & Legal",
    items: [
      {
        title: "Contracts & Agreements",
        href: "/documents",
        icon: FolderLock,
      },
      {
        title: "Talent Remuneration & Fees",
        href: "/finance/budgets",
        icon: DollarSign,
      },
      {
        title: "Expenses & Receptions",
        href: "/finance/expenses",
        icon: Receipt,
      },
      {
        title: "Production Comms",
        href: "/communications",
        icon: MessageSquare,
      },
    ],
  },
];

export function getNavigationForRole(role: ConsoleRole): NavGroup[] {
  if (role === "manager") {
    return [
      {
        label: "Talent Manager Console",
        items: [
          {
            title: "Manager Console",
            href: "/manager",
            icon: UserCheck,
            badge: "Active",
          },
          {
            title: "Work Schedules & Calendar",
            href: "/manager/calendar",
            icon: CalendarDays,
            badge: "Palette",
          },
          {
            title: "Actor Roster & Workspaces",
            href: "/actors",
            icon: User,
          },
          {
            title: "Arranged Meetings & Pitches",
            href: "/manager/meetings",
            icon: Video,
            badge: "Live",
          },
          {
            title: "Call Sheet Schedules",
            href: "/call-sheets",
            icon: Clapperboard,
          },
          {
            title: "Live GPS & Fleet Dispatches",
            href: "/locations",
            icon: MapPin,
          },
        ],
      },
      {
        label: "Agreements & Remuneration",
        items: [
          {
            title: "Talent Remuneration & Fees",
            href: "/finance/budgets",
            icon: DollarSign,
          },
          {
            title: "Contracts & Deal Memos",
            href: "/documents",
            icon: FolderLock,
          },
          {
            title: "Client Expenses & Per Diem",
            href: "/finance/expenses",
            icon: Receipt,
          },
          {
            title: "Agency Messaging",
            href: "/communications",
            icon: MessageSquare,
          },
        ],
      },
      {
        label: "Studio Slate (Reference)",
        items: [
          {
            title: "Production House",
            href: "/production",
            icon: Building2,
          },
          {
            title: "Movies & Web Series",
            href: "/projects",
            icon: Film,
          },
          {
            title: "Master Calendar",
            href: "/calendar",
            icon: CalendarDays,
          },
        ],
      },
    ];
  }

  if (role === "producer") {
    return [
      {
        label: "Producer Console",
        items: [
          {
            title: "Production House Slate",
            href: "/production",
            icon: Building2,
            badge: "Active",
          },
          {
            title: "Projects & Movies",
            href: "/projects",
            icon: Film,
          },
          {
            title: "Daily Call Sheet Generator",
            href: "/call-sheets",
            icon: Clapperboard,
          },
          {
            title: "Casting & Role Decisions",
            href: "/casting",
            icon: Sparkles,
          },
          {
            title: "Master Production Calendar",
            href: "/calendar",
            icon: CalendarDays,
          },
          {
            title: "Crew & Key Grips",
            href: "/crew",
            icon: Users,
          },
          {
            title: "Daily Call Attendance",
            href: "/attendance",
            icon: Clock,
          },
        ],
      },
      {
        label: "Studio Finance & Legal",
        items: [
          {
            title: "Production Budgets & P&L",
            href: "/finance/budgets",
            icon: DollarSign,
          },
          {
            title: "Production Expenses",
            href: "/finance/expenses",
            icon: Receipt,
          },
          {
            title: "Production Legal & NDAs",
            href: "/documents",
            icon: FolderLock,
          },
          {
            title: "Shooting Locations & Permits",
            href: "/locations",
            icon: MapPin,
          },
        ],
      },
      {
        label: "Talent Agencies & Pitches",
        items: [
          {
            title: "Manager Console",
            href: "/manager",
            icon: UserCheck,
          },
          {
            title: "Actor Roster",
            href: "/actors",
            icon: User,
          },
          {
            title: "Pitch Meetings",
            href: "/manager/meetings",
            icon: Video,
          },
        ],
      },
    ];
  }

  // Actor Portal
  return [
    {
      label: "Actor Portal",
      items: [
        {
          title: "My Actor Hub",
          href: "/actors",
          icon: User,
          badge: "Active",
        },
        {
          title: "Today's Call Sheet",
          href: "/call-sheets",
          icon: Clapperboard,
          badge: "Daily",
        },
        {
          title: "My Arranged Meetings",
          href: "/manager/meetings",
          icon: Video,
        },
        {
          title: "Location GPS & Driver",
          href: "/locations",
          icon: MapPin,
        },
        {
          title: "Production Chat",
          href: "/communications",
          icon: MessageSquare,
        },
        {
          title: "My Signed Agreements",
          href: "/documents",
          icon: FolderLock,
        },
      ],
    },
    {
      label: "Representation & Production",
      items: [
        {
          title: "Agency Manager Console",
          href: "/manager",
          icon: UserCheck,
        },
        {
          title: "Production Slate",
          href: "/production",
          icon: Building2,
        },
        {
          title: "Production Schedule",
          href: "/calendar",
          icon: CalendarDays,
        },
      ],
    },
  ];
}

export const navigation = defaultNavigation;
