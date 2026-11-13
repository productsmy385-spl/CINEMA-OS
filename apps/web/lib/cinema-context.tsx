"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

export interface ManagedActor {
  id: string;
  stageName: string;
  legalName: string;
  avatarUrl: string;
  phone: string;
  email: string;
  agencyName: string;
  standardDayRate: number;
  status: "available" | "on_set" | "rehearsal" | "auditioning" | "on_leave";
  activeProjects: string[];
  height: string;
  weight: string;
  hairColor: string;
  eyeColor: string;
  languages: string[];
  skills: string[];
  bio: string;
}

export interface ManagerMeeting {
  id: string;
  title: string;
  actorId: string;
  actorName: string;
  withWhom: string; // e.g. "Christopher Nolan (Director)"
  companyOrStudio: string; // e.g. "Warner Bros / Syncopy"
  meetingType:
    | "Director Script Reading"
    | "Producer Pitch Meeting"
    | "Casting Callback"
    | "Wardrobe & Costume Fitting"
    | "Chemistry Read"
    | "Brand Endorsement";
  dateTime: string;
  format: "Video Call (Zoom / Meet)" | "In-Person (Studio)" | "On-Location";
  locationOrLink: string;
  prepNotes: string;
  status: "Scheduled" | "Confirmed" | "Completed" | "Rescheduled";
  createdAt: string;
}

export type ScheduleCategory = "shoot" | "pitch" | "fitting" | "travel" | "blackout";

export interface ShootScheduleCall {
  id: string;
  actorId: string;
  actorName: string;
  characterName: string;
  project: string;
  shootDate: string;
  isoDate?: string;
  category?: ScheduleCategory;
  dayNumber: number;
  totalDays: number;
  pickupTime: string;
  hmuTime: string;
  onSetTime: string;
  estimatedWrapTime: string;
  locationName: string;
  locationAddress: string;
  assignedDriver: string;
  driverPhone: string;
  specialWardrobeNotes: string;
  status: "draft" | "published" | "acknowledged" | "on_set" | "wrapped";
  acknowledgedAt?: string;
}

export interface LocationUpdateItem {
  id: string;
  project: string;
  name: string;
  address: string;
  gpsCoordinates: string;
  basecampLot: string;
  securityPassInstructions: string;
  assignedChauffeur: string;
  chauffeurPhone: string;
  nearestHospital: string;
  weatherAdvisory: string;
  lastUpdated: string;
}

export interface DispatchedAlert {
  id: string;
  actorName: string;
  title: string;
  details: string;
  timestamp: string;
  channel: "Mobile Push" | "In-App SMS" | "WhatsApp Cloud API";
}

export type ConsoleRole = "manager" | "producer" | "actor";

export interface ConsolePersona {
  role: ConsoleRole;
  title: string;
  name: string;
  organization: string;
  avatarUrl: string;
  badgeLabel: string;
  homeUrl: string;
}

export const consolePersonas: Record<ConsoleRole, ConsolePersona> = {
  manager: {
    role: "manager",
    title: "Talent Manager & Agency Executive",
    name: "Evelyn Reed",
    organization: "Apex Talent Agency",
    avatarUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80",
    badgeLabel: "MANAGER CONSOLE",
    homeUrl: "/manager",
  },
  producer: {
    role: "producer",
    title: "Executive Producer & Studio Head",
    name: "Marcus Vance",
    organization: "Vance Global Pictures",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80",
    badgeLabel: "PRODUCER CONSOLE",
    homeUrl: "/production",
  },
  actor: {
    role: "actor",
    title: "SAG-AFTRA Principal Performer",
    name: "Marcus Sterling",
    organization: "Apex Talent Client",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80",
    badgeLabel: "ACTOR PORTAL",
    homeUrl: "/actors",
  },
};

interface CinemaContextType {
  activeConsole: ConsoleRole;
  setActiveConsole: (role: ConsoleRole) => void;
  currentPersona: ConsolePersona;

  actors: ManagedActor[];
  selectedActor: ManagedActor;
  setSelectedActor: (actor: ManagedActor) => void;
  addActor: (actor: Omit<ManagedActor, "id">) => void;
  updateActor: (id: string, updates: Partial<ManagedActor>) => void;

  meetings: ManagerMeeting[];
  scheduleMeeting: (meeting: Omit<ManagerMeeting, "id" | "createdAt">) => void;
  updateMeetingStatus: (id: string, status: ManagerMeeting["status"]) => void;

  shootSchedules: ShootScheduleCall[];
  addShootSchedule: (schedule: Omit<ShootScheduleCall, "id">) => void;
  updateShootSchedule: (id: string, updates: Partial<ShootScheduleCall>) => void;
  acknowledgeSchedule: (id: string) => void;

  locations: LocationUpdateItem[];
  updateLocation: (id: string, updates: Partial<LocationUpdateItem>) => void;
  dispatchLocationToActor: (locationId: string, actorId: string, note?: string) => void;

  dispatchedAlerts: DispatchedAlert[];
}

const CinemaContext = createContext<CinemaContextType | undefined>(undefined);

const defaultActors: ManagedActor[] = [
  {
    id: "act-1",
    stageName: "Marcus Sterling",
    legalName: "Marcus Sterling Hayes",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80",
    phone: "+1 (310) 555-0142",
    email: "marcus.sterling@apex-talent.com",
    agencyName: "Apex Talent Agency",
    standardDayRate: 14500,
    status: "on_set",
    activeProjects: ["Chrono Raiders", "Neon Horizon"],
    height: "6' 1\" (185 cm)",
    weight: "185 lbs",
    hairColor: "Dark Brown",
    eyeColor: "Hazel",
    languages: ["English (Native)", "French (Conversational)"],
    skills: ["Stage Combat", "Precision Stunt Driving", "Equestrian", "Firearms Safety"],
    bio: "Classically trained dramatic lead actor with extensive franchise film credits.",
  },
  {
    id: "act-2",
    stageName: "Elena Rostova",
    legalName: "Elena Sophia Rostova",
    avatarUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&h=256&q=80",
    phone: "+1 (310) 555-0188",
    email: "elena.rostova@apex-talent.com",
    agencyName: "Apex Talent Agency",
    standardDayRate: 11000,
    status: "available",
    activeProjects: ["Chrono Raiders"],
    height: "5' 8\" (173 cm)",
    weight: "130 lbs",
    hairColor: "Auburn",
    eyeColor: "Green",
    languages: ["English (Native RP)", "Russian (Fluent)", "Spanish"],
    skills: ["Classical Ballet", "Archery", "Scuba Certified", "British RP"],
    bio: "Acclaimed stage and screen performer recognized for subtle emotional nuance.",
  },
  {
    id: "act-3",
    stageName: "Devon Chen",
    legalName: "Devon Ming Chen",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80",
    phone: "+1 (310) 555-0245",
    email: "devon.chen@apex-talent.com",
    agencyName: "Apex Talent Agency",
    standardDayRate: 9500,
    status: "rehearsal",
    activeProjects: ["Chrono Raiders", "Project Redline"],
    height: "5' 11\" (180 cm)",
    weight: "172 lbs",
    hairColor: "Black",
    eyeColor: "Dark Brown",
    languages: ["English", "Mandarin (Fluent)", "Cantonese"],
    skills: ["Wushu Martial Arts", "Wire Work", "Motorcycle Stunts"],
    bio: "Action specialist and leading dramatic actor performing complex stunt choreography.",
  },
];

const defaultMeetings: ManagerMeeting[] = [
  {
    id: "mtg-1",
    title: "Vanguard 2099 - Directorial Script Read",
    actorId: "act-1",
    actorName: "Marcus Sterling",
    withWhom: "Christopher Nolan (Director) & Emma Thomas (Producer)",
    companyOrStudio: "Syncopy / Universal Studios",
    meetingType: "Director Script Reading",
    dateTime: "Tomorrow, 10:30 AM PST",
    format: "In-Person (Studio)",
    locationOrLink: "Paramount Lot, Stage 4 Executive Conference Suite",
    prepNotes: "Read Scenes 14 through 28 (Col. Vance interrogation scene). Emphasize psychological fatigue.",
    status: "Confirmed",
    createdAt: "2026-11-13",
  },
  {
    id: "mtg-2",
    title: "Geneva Dossier S2 - Chemistry Read with Co-Lead",
    actorId: "act-2",
    actorName: "Elena Rostova",
    withWhom: "Susanne Bier (Director) & Lead Actor",
    companyOrStudio: "BBC / HBO Productions",
    meetingType: "Chemistry Read",
    dateTime: "Friday, Nov 15, 02:00 PM PST",
    format: "Video Call (Zoom / Meet)",
    locationOrLink: "https://meet.google.com/cin-doss-room",
    prepNotes: "Review emotional climax dialogue from Episode 4 rewrite.",
    status: "Scheduled",
    createdAt: "2026-11-13",
  },
  {
    id: "mtg-3",
    title: "Luxury Timepiece Brand Endorsement Pitch",
    actorId: "act-1",
    actorName: "Marcus Sterling",
    withWhom: "Global Marketing Director & Agency Rep",
    companyOrStudio: "Omega / Swatch Group",
    meetingType: "Brand Endorsement",
    dateTime: "Monday, Nov 18, 11:00 AM PST",
    format: "In-Person (Studio)",
    locationOrLink: "SoHo House West Hollywood (Private Screening Salon)",
    prepNotes: "Discuss $1.2M multi-year global campaign across film premiere red carpets.",
    status: "Scheduled",
    createdAt: "2026-11-12",
  },
];

const defaultSchedules: ShootScheduleCall[] = [
  {
    id: "sch-1",
    actorId: "act-1",
    actorName: "Marcus Sterling",
    characterName: "Commander Thorne",
    project: "Chrono Raiders",
    shootDate: "Friday, Nov 14, 2026",
    isoDate: "2026-11-14",
    category: "shoot",
    dayNumber: 29,
    totalDays: 52,
    pickupTime: "05:15 AM",
    hmuTime: "06:00 AM",
    onSetTime: "07:15 AM",
    estimatedWrapTime: "07:30 PM",
    locationName: "Vasquez Rocks Natural Area Park",
    locationAddress: "10700 Escondido Canyon Rd, Agua Dulce, CA 91390",
    assignedDriver: "Frank Perez (Driver #4)",
    driverPhone: "+1 (310) 555-0822",
    specialWardrobeNotes: "Prosthetic temporal scar on left temple. Weathering dust coat #3.",
    status: "acknowledged",
    acknowledgedAt: "Today at 18:32 PST",
  },
  {
    id: "sch-2",
    actorId: "act-2",
    actorName: "Elena Rostova",
    characterName: "Dr. Elena Croft",
    project: "Chrono Raiders",
    shootDate: "Friday, Nov 14, 2026",
    isoDate: "2026-11-14",
    category: "shoot",
    dayNumber: 29,
    totalDays: 52,
    pickupTime: "05:30 AM",
    hmuTime: "06:15 AM",
    onSetTime: "07:15 AM",
    estimatedWrapTime: "07:30 PM",
    locationName: "Vasquez Rocks Natural Area Park",
    locationAddress: "10700 Escondido Canyon Rd, Agua Dulce, CA 91390",
    assignedDriver: "David Ruiz (Executive Sedan #2)",
    driverPhone: "+1 (310) 555-0844",
    specialWardrobeNotes: "Prop temporal scanner check with Props Master at 06:45 AM.",
    status: "acknowledged",
    acknowledgedAt: "Today at 19:10 PST",
  },
  {
    id: "sch-3",
    actorId: "act-3",
    actorName: "Devon Chen",
    characterName: "Jax (Stunt Lead)",
    project: "Chrono Raiders",
    shootDate: "Friday, Nov 14, 2026",
    isoDate: "2026-11-14",
    category: "shoot",
    dayNumber: 29,
    totalDays: 52,
    pickupTime: "09:30 AM",
    hmuTime: "10:30 AM",
    onSetTime: "12:00 PM",
    estimatedWrapTime: "06:30 PM",
    locationName: "Vasquez Rocks Ridge West",
    locationAddress: "10700 Escondido Canyon Rd, Agua Dulce, CA 91390",
    assignedDriver: "Production Van #3",
    driverPhone: "+1 (310) 555-0811",
    specialWardrobeNotes: "High-fall stunt harness inspection with Stunt Coordinator George Cottle.",
    status: "published",
  },
  {
    id: "sch-4",
    actorId: "act-1",
    actorName: "Marcus Sterling",
    characterName: "Commander Thorne",
    project: "Chrono Raiders",
    shootDate: "Saturday, Nov 15, 2026",
    isoDate: "2026-11-15",
    category: "shoot",
    dayNumber: 30,
    totalDays: 52,
    pickupTime: "03:30 PM",
    hmuTime: "04:30 PM",
    onSetTime: "06:00 PM",
    estimatedWrapTime: "04:00 AM",
    locationName: "Vasquez Rocks Soundstage & Night Canyon",
    locationAddress: "10700 Escondido Canyon Rd, Agua Dulce, CA 91390",
    assignedDriver: "Frank Perez (Driver #4)",
    driverPhone: "+1 (310) 555-0822",
    specialWardrobeNotes: "Night shoot wet-down sequence. Thermal undergarments required.",
    status: "published",
  },
  {
    id: "sch-5",
    actorId: "act-1",
    actorName: "Marcus Sterling",
    characterName: "Detective Ray Cole",
    project: "Neon Horizon",
    shootDate: "Wednesday, Nov 12, 2026",
    isoDate: "2026-11-12",
    category: "fitting",
    dayNumber: 0,
    totalDays: 45,
    pickupTime: "09:00 AM",
    hmuTime: "09:30 AM",
    onSetTime: "10:00 AM",
    estimatedWrapTime: "02:00 PM",
    locationName: "Sunset Gower Studios (Stage 8)",
    locationAddress: "1438 N Gower St, Hollywood, CA 90028",
    assignedDriver: "Executive Towncar #1",
    driverPhone: "+1 (310) 555-0144",
    specialWardrobeNotes: "Costume Designer Colleen Atwood bespoke leather trench fitting.",
    status: "wrapped",
  },
  {
    id: "sch-6",
    actorId: "act-1",
    actorName: "Marcus Sterling",
    characterName: "Himself / Talent Pitch",
    project: "Project Odyssey",
    shootDate: "Thursday, Nov 13, 2026",
    isoDate: "2026-11-13",
    category: "pitch",
    dayNumber: 0,
    totalDays: 1,
    pickupTime: "01:00 PM",
    hmuTime: "01:30 PM",
    onSetTime: "02:00 PM",
    estimatedWrapTime: "04:30 PM",
    locationName: "Warner Bros. Studios Burbank (Building 140)",
    locationAddress: "4000 Warner Blvd, Burbank, CA 91522",
    assignedDriver: "Frank Perez (Driver #4)",
    driverPhone: "+1 (310) 555-0822",
    specialWardrobeNotes: "Smart casual business attire for Director Christopher Nolan script reading.",
    status: "wrapped",
  },
  {
    id: "sch-7",
    actorId: "act-2",
    actorName: "Elena Rostova",
    characterName: "Herself / Brand Ambassador",
    project: "Vogue Cover Editorial",
    shootDate: "Monday, Nov 17, 2026",
    isoDate: "2026-11-17",
    category: "fitting",
    dayNumber: 1,
    totalDays: 1,
    pickupTime: "07:30 AM",
    hmuTime: "08:30 AM",
    onSetTime: "10:00 AM",
    estimatedWrapTime: "06:00 PM",
    locationName: "Milk Studios Hollywood (Stage 1)",
    locationAddress: "855 N Cahuenga Blvd, Los Angeles, CA 90038",
    assignedDriver: "David Ruiz (Executive Sedan #2)",
    driverPhone: "+1 (310) 555-0844",
    specialWardrobeNotes: "Couture gown trials with Vogue stylist Edward Enninful.",
    status: "published",
  },
  {
    id: "sch-8",
    actorId: "act-1",
    actorName: "Marcus Sterling",
    characterName: "Brand Ambassador",
    project: "Omega Global Campaign",
    shootDate: "Tuesday, Nov 18, 2026",
    isoDate: "2026-11-18",
    category: "pitch",
    dayNumber: 0,
    totalDays: 1,
    pickupTime: "10:00 AM",
    hmuTime: "10:30 AM",
    onSetTime: "11:00 AM",
    estimatedWrapTime: "01:30 PM",
    locationName: "SoHo House West Hollywood",
    locationAddress: "9200 Sunset Blvd, West Hollywood, CA 90069",
    assignedDriver: "Executive Towncar #1",
    driverPhone: "+1 (310) 555-0144",
    specialWardrobeNotes: "Contract signing and campaign vision presentation.",
    status: "published",
  },
  {
    id: "sch-9",
    actorId: "act-1",
    actorName: "Marcus Sterling",
    characterName: "Commander Thorne",
    project: "Chrono Raiders",
    shootDate: "Friday, Nov 20, 2026",
    isoDate: "2026-11-20",
    category: "shoot",
    dayNumber: 31,
    totalDays: 52,
    pickupTime: "05:00 AM",
    hmuTime: "05:45 AM",
    onSetTime: "07:00 AM",
    estimatedWrapTime: "07:00 PM",
    locationName: "Red Rock Canyon State Park",
    locationAddress: "37749 Abbott Dr, Cantil, CA 93519",
    assignedDriver: "Frank Perez (Driver #4)",
    driverPhone: "+1 (310) 555-0822",
    specialWardrobeNotes: "High-speed desert hovercraft chase sequences.",
    status: "published",
  },
  {
    id: "sch-10",
    actorId: "act-2",
    actorName: "Elena Rostova",
    characterName: "Dr. Elena Croft",
    project: "Chrono Raiders",
    shootDate: "Friday, Nov 20, 2026",
    isoDate: "2026-11-20",
    category: "shoot",
    dayNumber: 31,
    totalDays: 52,
    pickupTime: "05:00 AM",
    hmuTime: "05:45 AM",
    onSetTime: "07:00 AM",
    estimatedWrapTime: "07:00 PM",
    locationName: "Red Rock Canyon State Park",
    locationAddress: "37749 Abbott Dr, Cantil, CA 93519",
    assignedDriver: "David Ruiz (Executive Sedan #2)",
    driverPhone: "+1 (310) 555-0844",
    specialWardrobeNotes: "Combat tactical harness and dirt weathering.",
    status: "published",
  },
  {
    id: "sch-11",
    actorId: "act-2",
    actorName: "Elena Rostova",
    characterName: "Lady Sarah",
    project: "The Crown Legacy",
    shootDate: "Sunday, Nov 22, 2026",
    isoDate: "2026-11-22",
    category: "travel",
    dayNumber: 0,
    totalDays: 60,
    pickupTime: "03:00 PM",
    hmuTime: "N/A",
    onSetTime: "05:30 PM",
    estimatedWrapTime: "11:00 AM (+1 Day)",
    locationName: "LAX Bradley Terminal &rarr; London Heathrow (BA282)",
    locationAddress: "1 World Way, Los Angeles, CA 90045",
    assignedDriver: "VIP Airport Chauffeur Service",
    driverPhone: "+1 (310) 555-0999",
    specialWardrobeNotes: "Passport, UK visa waiver & SAG per diem packet verified.",
    status: "published",
  },
  {
    id: "sch-12",
    actorId: "act-1",
    actorName: "Marcus Sterling",
    characterName: "N/A",
    project: "SAG-AFTRA Mandatory Turnaround",
    shootDate: "Wednesday, Nov 25, 2026",
    isoDate: "2026-11-25",
    category: "blackout",
    dayNumber: 0,
    totalDays: 0,
    pickupTime: "N/A",
    hmuTime: "N/A",
    onSetTime: "Blackout",
    estimatedWrapTime: "Full Day",
    locationName: "Personal Residence / Blackout Day",
    locationAddress: "Beverly Hills, CA 90210",
    assignedDriver: "N/A",
    driverPhone: "N/A",
    specialWardrobeNotes: "Contractual rest day per SAG Article 14.",
    status: "published",
  },
];

const defaultLocations: LocationUpdateItem[] = [
  {
    id: "loc-1",
    project: "Chrono Raiders",
    name: "Vasquez Rocks Natural Area Park",
    address: "10700 Escondido Canyon Rd, Agua Dulce, CA 91390",
    gpsCoordinates: "34.4883° N, 118.3184° W",
    basecampLot: "Lot B - Shuttles depart every 10 mins to Ridge Summit",
    securityPassInstructions: "Show Digital Production Pass 'CR-DAY29-CREW' at Escondido Canyon gate.",
    assignedChauffeur: "Frank Perez • Sprinter Van #4 (Private actor transport)",
    chauffeurPhone: "+1 (310) 555-0822",
    nearestHospital: "Henry Mayo Newhall Hospital (14.2 miles • 661-253-8000)",
    weatherAdvisory: "High wind warning after 2:00 PM; bring windbreakers and eye protection.",
    lastUpdated: "Today at 17:15 PST",
  },
  {
    id: "loc-2",
    project: "Silicon Sunset",
    name: "Paramount Studios Sound Stage 4",
    address: "5555 Melrose Ave, Hollywood, CA 90038",
    gpsCoordinates: "34.0837° N, 118.3194° W",
    basecampLot: "Gower Structure Level 3 (Reserved Cast Bays)",
    securityPassInstructions: "Vehicle registration active via Paramount Drive-On Pass barcode.",
    assignedChauffeur: "Self-park or Studio VIP Chauffeur on request",
    chauffeurPhone: "+1 (323) 956-5000 (Desk)",
    nearestHospital: "Cedars-Sinai Medical Center (3.8 miles)",
    weatherAdvisory: "Indoor climate-controlled stage (68°F)",
    lastUpdated: "Nov 12, 2026",
  },
];

const defaultAlerts: DispatchedAlert[] = [
  {
    id: "alt-1",
    actorName: "Marcus Sterling",
    title: "Call Time Confirmed for Day 29",
    details: "Pickup at 05:15 AM from Beverly Hills residence. Assigned driver: Frank Perez.",
    timestamp: "18:32 Today",
    channel: "Mobile Push",
  },
  {
    id: "alt-2",
    actorName: "Elena Rostova",
    title: "Vasquez Rocks Location Pin & Hospital Update",
    details: "GPS coordinates (34.4883° N, 118.3184° W) dispatched with Lot B shuttle map.",
    timestamp: "17:40 Today",
    channel: "WhatsApp Cloud API",
  },
];

export function CinemaProvider({ children }: { children: React.ReactNode }) {
  const [activeConsole, setActiveConsoleState] = useState<ConsoleRole>("manager");
  const [actors, setActors] = useState<ManagedActor[]>(defaultActors);
  const [selectedActor, setSelectedActor] = useState<ManagedActor>(defaultActors[0]);
  const [meetings, setMeetings] = useState<ManagerMeeting[]>(defaultMeetings);
  const [shootSchedules, setShootSchedules] = useState<ShootScheduleCall[]>(defaultSchedules);
  const [locations, setLocations] = useState<LocationUpdateItem[]>(defaultLocations);
  const [dispatchedAlerts, setDispatchedAlerts] = useState<DispatchedAlert[]>(defaultAlerts);

  const currentPersona = consolePersonas[activeConsole];

  const setActiveConsole = (role: ConsoleRole) => {
    setActiveConsoleState(role);
    try {
      localStorage.setItem("cinema_active_console", role);
    } catch {}
    const p = consolePersonas[role];
    toast.info(`Switched to ${p.badgeLabel}: Authorized as ${p.name} (${p.organization})`);
  };

  // Load from localStorage if present
  useEffect(() => {
    try {
      const storedConsole = localStorage.getItem("cinema_active_console") as ConsoleRole;
      if (storedConsole && consolePersonas[storedConsole]) {
        setActiveConsoleState(storedConsole);
      }

      const storedActors = localStorage.getItem("cinema_actors");
      if (storedActors) setActors(JSON.parse(storedActors));

      const storedMeetings = localStorage.getItem("cinema_meetings");
      if (storedMeetings) setMeetings(JSON.parse(storedMeetings));

      const storedSchedules = localStorage.getItem("cinema_schedules");
      if (storedSchedules) setShootSchedules(JSON.parse(storedSchedules));

      const storedLocations = localStorage.getItem("cinema_locations");
      if (storedLocations) setLocations(JSON.parse(storedLocations));
    } catch {
      // ignore
    }
  }, []);

  // Save changes
  useEffect(() => {
    try {
      localStorage.setItem("cinema_actors", JSON.stringify(actors));
      localStorage.setItem("cinema_meetings", JSON.stringify(meetings));
      localStorage.setItem("cinema_schedules", JSON.stringify(shootSchedules));
      localStorage.setItem("cinema_locations", JSON.stringify(locations));
    } catch {
      // ignore
    }
  }, [actors, meetings, shootSchedules, locations]);

  const addActor = (newActor: Omit<ManagedActor, "id">) => {
    const created: ManagedActor = {
      ...newActor,
      id: `act-${Date.now()}`,
    };
    setActors((prev) => [created, ...prev]);
    setSelectedActor(created);
    toast.success(`Actor "${created.stageName}" onboarded to management roster.`);
  };

  const updateActor = (id: string, updates: Partial<ManagedActor>) => {
    setActors((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
    if (selectedActor.id === id) {
      setSelectedActor((prev) => ({ ...prev, ...updates }));
    }
    toast.success("Actor profile and portfolio updated.");
  };

  const scheduleMeeting = (meeting: Omit<ManagerMeeting, "id" | "createdAt">) => {
    const created: ManagerMeeting = {
      ...meeting,
      id: `mtg-${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setMeetings((prev) => [created, ...prev]);

    // Dispatch notification
    const alert: DispatchedAlert = {
      id: `alt-${Date.now()}`,
      actorName: meeting.actorName,
      title: `Meeting Scheduled: ${meeting.title}`,
      details: `${meeting.meetingType} with ${meeting.withWhom} on ${meeting.dateTime}. Location: ${meeting.locationOrLink}`,
      timestamp: "Just now",
      channel: "Mobile Push",
    };
    setDispatchedAlerts((prev) => [alert, ...prev]);

    toast.success(
      `Meeting arranged for ${meeting.actorName}! Invite & prep notes dispatched via mobile push.`
    );
  };

  const updateMeetingStatus = (id: string, status: ManagerMeeting["status"]) => {
    setMeetings((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status } : m))
    );
    toast.info(`Meeting status updated to ${status}.`);
  };

  const addShootSchedule = (newSchedule: Omit<ShootScheduleCall, "id">) => {
    const created: ShootScheduleCall = {
      ...newSchedule,
      id: `sch-${Date.now()}`,
    };
    setShootSchedules((prev) => [created, ...prev]);

    const alert: DispatchedAlert = {
      id: `alt-${Date.now()}`,
      actorName: created.actorName,
      title: `Schedule Added: ${created.project} (${created.isoDate || created.shootDate})`,
      details: `Call: ${created.onSetTime} • Pickup: ${created.pickupTime} • Location: ${created.locationName}`,
      timestamp: "Just now",
      channel: "Mobile Push",
    };
    setDispatchedAlerts((prev) => [alert, ...prev]);

    toast.success(`Schedule added for ${created.actorName}! Real-time alert dispatched.`);
  };

  const updateShootSchedule = (id: string, updates: Partial<ShootScheduleCall>) => {
    setShootSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );

    const target = shootSchedules.find((s) => s.id === id);
    if (target) {
      const alert: DispatchedAlert = {
        id: `alt-${Date.now()}`,
        actorName: target.actorName,
        title: `Schedule Updated: Day ${target.dayNumber} Call Shift`,
        details: `Reporting call: ${updates.onSetTime || target.onSetTime} • Pickup: ${updates.pickupTime || target.pickupTime}`,
        timestamp: "Just now",
        channel: "WhatsApp Cloud API",
      };
      setDispatchedAlerts((prev) => [alert, ...prev]);
    }

    toast.warning("Shooting schedule updated! Real-time notification dispatched to talent.");
  };

  const acknowledgeSchedule = (id: string) => {
    const timeString = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setShootSchedules((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: "acknowledged",
              acknowledgedAt: `Acknowledged today at ${timeString}`,
            }
          : s
      )
    );
    toast.success("Actor call sheet receipt acknowledged. Production ledger updated.");
  };

  const updateLocation = (id: string, updates: Partial<LocationUpdateItem>) => {
    setLocations((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updates, lastUpdated: "Just now" } : l))
    );
    toast.success("Location details updated.");
  };

  const dispatchLocationToActor = (locationId: string, actorId: string, note?: string) => {
    const loc = locations.find((l) => l.id === locationId);
    const actor = actors.find((a) => a.id === actorId);
    if (!loc || !actor) return;

    const alert: DispatchedAlert = {
      id: `alt-${Date.now()}`,
      actorName: actor.stageName,
      title: `Location & GPS Update: ${loc.name}`,
      details: `GPS: ${loc.gpsCoordinates} • ${loc.basecampLot} • Driver: ${loc.assignedChauffeur}. ${note ? `Note: ${note}` : ""}`,
      timestamp: "Just now",
      channel: "Mobile Push",
    };
    setDispatchedAlerts((prev) => [alert, ...prev]);

    toast.success(
      `Instant Location Pin & Security Instructions dispatched to ${actor.stageName} via Push & SMS!`
    );
  };

  return (
    <CinemaContext.Provider
      value={{
        activeConsole,
        setActiveConsole,
        currentPersona,
        actors,
        selectedActor,
        setSelectedActor,
        addActor,
        updateActor,
        meetings,
        scheduleMeeting,
        updateMeetingStatus,
        shootSchedules,
        addShootSchedule,
        updateShootSchedule,
        acknowledgeSchedule,
        locations,
        updateLocation,
        dispatchLocationToActor,
        dispatchedAlerts,
      }}
    >
      {children}
    </CinemaContext.Provider>
  );
}

export function useCinema() {
  const context = useContext(CinemaContext);
  if (!context) {
    throw new Error("useCinema must be used within a CinemaProvider");
  }
  return context;
}

