export const siteConfig = {
  name: "CINEMA OS",
  tagline: "Enterprise Film Industry Management & Production Operating System",
  description:
    "Integrated digital operating system for the film industry connecting actors, personal managers, production houses, directors, casting teams, crew members, and finance departments.",
  version: "1.0.0",
  url: "https://cinema-os.railway.app",
  author: {
    name: "CINEMA OS Architecture Team",
    url: "https://cinema-os.railway.app",
    email: "support@cinema-os.com",
  },
  developer: {
    name: "DataDropX",
    url: "https://datadropx.net",
  },
  distributor: {
    name: "ThemeWagon",
    url: "https://themewagon.com",
  },
} as const;

// Default session personas for fast role switching and demonstration
export const demoUser = {
  name: "Marcus Vance",
  email: "marcus.vance@cinema-os.com",
  role: "Executive Producer",
  organization: "Vance Global Pictures",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80",
} as const;
