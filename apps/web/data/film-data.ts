export interface ActorProfile {
  id: string;
  stageName: string;
  legalName: string;
  avatarUrl: string;
  email: string;
  phone: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  dateOfBirth: string;
  isDobPrivate: boolean;
  gender: string;
  nationality: string;
  languages: string[];
  skills: string[];
  height: string;
  weight: string;
  hairColor: string;
  eyeColor: string;
  managerName: string;
  agencyName: string;
  standardDayRate: number; // in USD
  status: "available" | "on_set" | "rehearsal" | "auditioning" | "on_leave";
  bio: string;
  showreels: {
    title: string;
    duration: string;
    category: string;
    url: string;
    thumbnail: string;
  }[];
  filmography: {
    title: string;
    year: number;
    role: string;
    type: "Feature Film" | "Web Series" | "Short Film" | "TV Series";
    director: string;
    studio: string;
  }[];
  activeProjects: string[];
  upcomingAuditions: {
    project: string;
    role: string;
    date: string;
    time: string;
    location: string;
  }[];
  payments: {
    id: string;
    project: string;
    amount: number;
    status: "paid" | "pending" | "processing";
    date: string;
  }[];
}

export interface CallSheetItem {
  id: string;
  projectTitle: string;
  projectCode: string;
  dayNumber: number;
  totalDays: number;
  date: string;
  generalCallTime: string;
  estimatedWrapTime: string;
  unit: "Main Unit" | "Second Unit" | "Splinter Unit";
  location: {
    name: string;
    address: string;
    parking: string;
    nearestHospital: {
      name: string;
      address: string;
      emergencyPhone: string;
    };
  };
  weather: {
    temperature: string;
    condition: string;
    sunrise: string;
    sunset: string;
  };
  keyCrew: {
    director: string;
    firstAD: string;
    secondAD: string;
    dop: string;
    productionManager: string;
  };
  scenes: {
    sceneNumber: string;
    intExt: "INT" | "EXT" | "INT/EXT";
    dayNight: "DAY" | "NIGHT" | "DUSK" | "DAWN";
    description: string;
    scriptPages: string;
    castNumbers: string;
    location: string;
    timeSlot: string;
  }[];
  castCalls: {
    id: string;
    castNumber: number;
    characterName: string;
    actorName: string;
    pickupTime: string;
    hmuTime: string;
    onSetTime: string;
    notes: string;
    status: "acknowledged" | "pending" | "arrived" | "on_set";
    acknowledgedAt?: string;
  }[];
  departmentNotes: {
    department: string;
    note: string;
  }[];
  cateringSchedule: {
    breakfast: string;
    lunch: string;
    secondMeal: string;
  };
  status: "draft" | "published" | "revised";
  version: number;
}

export interface FilmProject {
  id: string;
  title: string;
  code: string;
  type: "Feature Film" | "Web Series" | "Commercial" | "Short Film";
  phase: "Development" | "Pre-Production" | "Production" | "Post-Production" | "Completed";
  director: string;
  producer: string;
  lineProducer: string;
  totalBudget: number; // in USD
  expendedBudget: number;
  startDate: string;
  wrapDate: string;
  totalShootingDays: number;
  completedShootingDays: number;
  posterUrl: string;
  synopsis: string;
}

// Initial Actor Roster
export const actorsData: ActorProfile[] = [
  {
    id: "act-1",
    stageName: "Marcus Sterling",
    legalName: "Marcus Sterling Hayes",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80",
    email: "marcus.sterling@talent-hub.com",
    phone: "+1 (310) 555-0142",
    emergencyContact: {
      name: "Victoria Hayes",
      relationship: "Spouse",
      phone: "+1 (310) 555-0199",
    },
    dateOfBirth: "1988-06-14",
    isDobPrivate: true,
    gender: "Male",
    nationality: "American / SAG-AFTRA",
    languages: ["English (Native)", "French (Conversational)"],
    skills: ["Stage Combat", "Equestrian", "Precision Driving", "Firearms Safety"],
    height: "6' 1\" (185 cm)",
    weight: "185 lbs (84 kg)",
    hairColor: "Dark Brown",
    eyeColor: "Hazel",
    managerName: "Evelyn Reed",
    agencyName: "Apex Talent Agency",
    standardDayRate: 12500,
    status: "on_set",
    bio: "Marcus Sterling is a classically trained dramatic actor with over 15 feature film credits across psychological thrillers, period epics, and sci-fi franchises.",
    showreels: [
      {
        title: "Dramatic Lead - Emotional Monologue",
        duration: "2m 14s",
        category: "Drama",
        url: "#",
        thumbnail: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=300&h=200&q=80",
      },
      {
        title: "Action & Tactical Combat Reel",
        duration: "1m 45s",
        category: "Action",
        url: "#",
        thumbnail: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=300&h=200&q=80",
      },
    ],
    filmography: [
      {
        title: "Chronicles of Olympus",
        year: 2024,
        role: "Commander Thorne (Lead)",
        type: "Feature Film",
        director: "Denis Villeneuve",
        studio: "Warner Bros",
      },
      {
        title: "The Midnight Watch",
        year: 2023,
        role: "Detective Miller",
        type: "Web Series",
        director: "David Fincher",
        studio: "Netflix",
      },
      {
        title: "Shadows in Berlin",
        year: 2021,
        role: "Agent Klaus",
        type: "Feature Film",
        director: "Christopher Nolan",
        studio: "Universal",
      },
    ],
    activeProjects: ["Chrono Raiders", "Neon Horizon"],
    upcomingAuditions: [
      {
        project: "Vanguard 2099",
        role: "Col. Jason Vance",
        date: "2026-11-20",
        time: "14:30 PST",
        location: "Paramount Studios, Stage 4",
      },
    ],
    payments: [
      { id: "PAY-101", project: "Chrono Raiders", amount: 62500, status: "paid", date: "2026-11-01" },
      { id: "PAY-102", project: "Chrono Raiders", amount: 62500, status: "pending", date: "2026-11-15" },
    ],
  },
  {
    id: "act-2",
    stageName: "Elena Rostova",
    legalName: "Elena Sophia Rostova",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&h=256&q=80",
    email: "elena.rostova@cinema-talents.com",
    phone: "+1 (310) 555-0188",
    emergencyContact: {
      name: "Svetlana Rostova",
      relationship: "Mother",
      phone: "+1 (310) 555-0177",
    },
    dateOfBirth: "1994-11-03",
    isDobPrivate: true,
    gender: "Female",
    nationality: "British-American / SAG-AFTRA",
    languages: ["English (Native RP)", "Russian (Fluent)", "Spanish (Conversational)"],
    skills: ["Classical Ballet", "Archery", "Scuba Certified", "British RP / Slavic Dialects"],
    height: "5' 8\" (173 cm)",
    weight: "130 lbs (59 kg)",
    hairColor: "Auburn",
    eyeColor: "Green",
    managerName: "Evelyn Reed",
    agencyName: "Apex Talent Agency",
    standardDayRate: 9800,
    status: "available",
    bio: "Elena Rostova is an acclaimed stage and screen performer recognized for subtle dramatic vulnerability and intense physical character transformations.",
    showreels: [
      {
        title: "British Period Drama Showreel",
        duration: "3m 10s",
        category: "Period Drama",
        url: "#",
        thumbnail: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=300&h=200&q=80",
      },
    ],
    filmography: [
      {
        title: "The King's Whisper",
        year: 2025,
        role: "Duchess Margaret",
        type: "Feature Film",
        director: "Sam Mendes",
        studio: "Focus Features",
      },
      {
        title: "Geneva Dossier",
        year: 2023,
        role: "Dr. Alisa Croft",
        type: "TV Series",
        director: "Susanne Bier",
        studio: "BBC / HBO",
      },
    ],
    activeProjects: ["Chrono Raiders"],
    upcomingAuditions: [],
    payments: [
      { id: "PAY-201", project: "Chrono Raiders", amount: 49000, status: "paid", date: "2026-11-02" },
    ],
  },
  {
    id: "act-3",
    stageName: "Devon Chen",
    legalName: "Devon Ming Chen",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80",
    email: "devon.chen@hollywoodtalent.com",
    phone: "+1 (310) 555-0245",
    emergencyContact: {
      name: "Linda Chen",
      relationship: "Sister",
      phone: "+1 (310) 555-0289",
    },
    dateOfBirth: "1991-04-22",
    isDobPrivate: true,
    gender: "Male",
    nationality: "Canadian-American / SAG-AFTRA",
    languages: ["English (Native)", "Mandarin (Fluent)", "Cantonese (Conversational)"],
    skills: ["Wushu Martial Arts", "Wire Work", "Motorcycle Stunts", "Mandarin Dialects"],
    height: "5' 11\" (180 cm)",
    weight: "172 lbs (78 kg)",
    hairColor: "Black",
    eyeColor: "Dark Brown",
    managerName: "Julian Price",
    agencyName: "Vanguard Artists",
    standardDayRate: 8500,
    status: "rehearsal",
    bio: "Devon Chen is an action specialist and leading dramatic actor known for doing 90% of his own stunt work and high-intensity character roles.",
    showreels: [
      {
        title: "Martial Arts & Action Choreography",
        duration: "2m 30s",
        category: "Action",
        url: "#",
        thumbnail: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=300&h=200&q=80",
      },
    ],
    filmography: [
      {
        title: "Cyber Strike: Tokyo",
        year: 2024,
        role: "Kenji Sato",
        type: "Feature Film",
        director: "Justin Lin",
        studio: "Universal",
      },
    ],
    activeProjects: ["Chrono Raiders", "Project Redline"],
    upcomingAuditions: [],
    payments: [
      { id: "PAY-301", project: "Chrono Raiders", amount: 34000, status: "paid", date: "2026-11-05" },
    ],
  },
];

// Active Film Projects
export const filmProjects: FilmProject[] = [
  {
    id: "proj-1",
    title: "Chrono Raiders",
    code: "CR-2026",
    type: "Feature Film",
    phase: "Production",
    director: "Christopher Nolan",
    producer: "Emma Thomas",
    lineProducer: "David Ellison",
    totalBudget: 125000000,
    expendedBudget: 68420000,
    startDate: "2026-09-15",
    wrapDate: "2026-12-20",
    totalShootingDays: 52,
    completedShootingDays: 28,
    posterUrl: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=600&h=800&q=80",
    synopsis: "An elite temporal salvage team infiltrates collapsing historical eras to prevent a catastrophic timeline unraveling.",
  },
  {
    id: "proj-2",
    title: "Silicon Sunset",
    code: "SS-2026",
    type: "Web Series",
    phase: "Pre-Production",
    director: "Alex Garland",
    producer: "Scott Rudin",
    lineProducer: "Jessica Alba",
    totalBudget: 42000000,
    expendedBudget: 7800000,
    startDate: "2026-12-01",
    wrapDate: "2027-04-15",
    totalShootingDays: 60,
    completedShootingDays: 0,
    posterUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&h=800&q=80",
    synopsis: "A ruthless deep-tech drama unfolding inside an autonomous intelligence research compound in Northern California.",
  },
  {
    id: "proj-3",
    title: "The Last Lighthouse",
    code: "LL-2026",
    type: "Feature Film",
    phase: "Post-Production",
    director: "Robert Eggers",
    producer: "A24",
    lineProducer: "Martin Green",
    totalBudget: 18500000,
    expendedBudget: 17200000,
    startDate: "2026-05-10",
    wrapDate: "2026-08-30",
    totalShootingDays: 40,
    completedShootingDays: 40,
    posterUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&h=800&q=80",
    synopsis: "Psychological thriller chronicling the solitary madness of two keepers stationed on an isolated North Sea reef.",
  },
];

// Production Call Sheet (Day 29 of 52)
export const activeCallSheet: CallSheetItem = {
  id: "cs-1029",
  projectTitle: "Chrono Raiders",
  projectCode: "CR-2026",
  dayNumber: 29,
  totalDays: 52,
  date: "Friday, November 14, 2026",
  generalCallTime: "06:30 AM",
  estimatedWrapTime: "07:30 PM",
  unit: "Main Unit",
  version: 2,
  status: "published",
  location: {
    name: "Vasquez Rocks Natural Area Park",
    address: "10700 Escondido Canyon Rd, Agua Dulce, CA 91390",
    parking: "Basecamp Lot B (Crew shuttles depart every 10 mins)",
    nearestHospital: {
      name: "Henry Mayo Newhall Hospital Emergency Center",
      address: "23845 McBean Pkwy, Valencia, CA 91355",
      emergencyPhone: "(661) 253-8000 / On-Set Medic: Ch. 1 & (310) 555-0911",
    },
  },
  weather: {
    temperature: "72°F / 22°C (Dry, Mild Wind)",
    condition: "Clear Skies / High UV Index",
    sunrise: "06:22 AM",
    sunset: "04:54 PM",
  },
  keyCrew: {
    director: "Christopher Nolan",
    firstAD: "Nilo Otero",
    secondAD: "Brandon Lambdin",
    dop: "Hoyte van Hoytema, ASC, FSF, NSC",
    productionManager: "David Ellison",
  },
  scenes: [
    {
      sceneNumber: "Sc. 42A",
      intExt: "EXT",
      dayNight: "DAY",
      description: "Thorne & Elena activate temporal beacon on ridge summit amid lightning anomalies.",
      scriptPages: "2 4/8 pgs",
      castNumbers: "1, 2",
      location: "Ridge Point West",
      timeSlot: "07:30 AM - 11:30 AM",
    },
    {
      sceneNumber: "Sc. 43",
      intExt: "EXT",
      dayNight: "DAY",
      description: "Tactical strike team ambushes the extraction vehicle. Stunt car rollover.",
      scriptPages: "3 1/8 pgs",
      castNumbers: "1, 3, Stunts 1-6",
      location: "Canyon Gorge Road",
      timeSlot: "12:30 PM - 04:30 PM",
    },
    {
      sceneNumber: "Sc. 44",
      intExt: "EXT",
      dayNight: "DUSK",
      description: "Elena evacuates wounded Thorne into temporal carrier before reality rift closes.",
      scriptPages: "1 2/8 pgs",
      castNumbers: "1, 2",
      location: "Carrier Landing Zone",
      timeSlot: "04:45 PM - 06:15 PM",
    },
  ],
  castCalls: [
    {
      id: "cc-1",
      castNumber: 1,
      characterName: "Commander Thorne",
      actorName: "Marcus Sterling",
      pickupTime: "05:15 AM",
      hmuTime: "06:00 AM",
      onSetTime: "07:15 AM",
      notes: "Prosthetic scar application (Left temple). Tactical harness under duster coat.",
      status: "acknowledged",
      acknowledgedAt: "2026-11-13 18:32 PST",
    },
    {
      id: "cc-2",
      castNumber: 2,
      characterName: "Dr. Elena Croft",
      actorName: "Elena Rostova",
      pickupTime: "05:30 AM",
      hmuTime: "06:15 AM",
      onSetTime: "07:15 AM",
      notes: "Combat weathering (Dust & blood hit #3). Prop temporal scanner.",
      status: "acknowledged",
      acknowledgedAt: "2026-11-13 19:10 PST",
    },
    {
      id: "cc-3",
      castNumber: 3,
      characterName: "Jax (Stunt Double)",
      actorName: "Devon Chen",
      pickupTime: "09:30 AM",
      hmuTime: "10:30 AM",
      onSetTime: "12:00 PM",
      notes: "High-fall stunt rigging check at 11:00 AM with Stunt Coordinator.",
      status: "pending",
    },
  ],
  departmentNotes: [
    { department: "Camera", note: "A & B Cameras IMAX 70mm 15-perf. Drone unit active Sc. 43." },
    { department: "Grip / Electric", note: "Condor 80ft crane positioned at Ridge Point by 06:00 AM." },
    { department: "Sound", note: "High wind warning after 2:00 PM; heavy deadcats on all boom mics." },
    { department: "Stunts & SFX", note: "Pyrotechnic charges at 02:00 PM. Hearing protection mandatory within 100ft." },
  ],
  cateringSchedule: {
    breakfast: "06:00 AM - 08:30 AM (Catering Truck A, Basecamp)",
    lunch: "11:30 AM - 12:30 PM (Courtesy Craft Service All Day)",
    secondMeal: "06:30 PM (Wrap Snacks & Hot Soup)",
  },
};

// Studio Financials & Budget Tracking
export const studioFinancials = {
  activeProjectsCount: 5,
  totalCommittedBudget: 185500000,
  expendedToDate: 93420000,
  committedPayables: 14200000,
  remainingCashReserve: 77880000,
  departmentBreakdown: [
    { department: "Above The Line (Cast & Directors)", allocated: 48000000, spent: 34500000 },
    { department: "Production & Camera", allocated: 42000000, spent: 26800000 },
    { department: "Art & Construction", allocated: 24000000, spent: 16200000 },
    { department: "VFX & Post-Production", allocated: 38000000, spent: 8900000 },
    { department: "Locations & Logistics", allocated: 18500000, spent: 7020000 },
    { department: "Legal, Insurance & Contingency", allocated: 15000000, spent: 0 },
  ],
  recentExpenses: [
    {
      id: "EXP-8891",
      project: "Chrono Raiders",
      vendor: "Panavision Hollywood",
      category: "Camera Equipment Rental",
      amount: 48500,
      status: "approved",
      date: "2026-11-12",
      submittedBy: "Hoyte van Hoytema (DP)",
    },
    {
      id: "EXP-8892",
      project: "Chrono Raiders",
      vendor: "Agua Dulce Location Services",
      category: "Park Permits & Security",
      amount: 14200,
      status: "approved",
      date: "2026-11-12",
      submittedBy: "David Ellison (UPM)",
    },
    {
      id: "EXP-8893",
      project: "Silicon Sunset",
      vendor: "Industrial Light & Magic",
      category: "Pre-viz Simulation Assets",
      amount: 85000,
      status: "pending",
      date: "2026-11-13",
      submittedBy: "Alex Garland (Director)",
    },
  ],
};

