# CINEMA OS &mdash; Enterprise Film Industry Operating System

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.3+-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4+-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-19.0+-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![License](https://img.shields.io/badge/License-Proprietary-071B2B)](LICENSE)

**CINEMA OS** is an integrated digital operating system designed for the film and television industry. It unifies talent managers, represented actors, executive producers, directors, casting teams, line producers, and technical crew into a real-time, synchronized SaaS ecosystem.

CINEMA OS eliminates paper call sheets, scattered WhatsApp groups, disconnected Excel expense trackers, and unverified schedule updates with institutional-grade cloud infrastructure.

---

## 🎨 Brand Identity & Design System

The application strictly implements the official CINEMA OS brand token palette:

| Token | Hex | Role & Purpose |
|:---|:---|:---|
| **Deep Navy** | `#071B2B` | Primary brand background & authoritative chrome |
| **Teal** | `#167D8D` | Primary action buttons, active navigation & status accents |
| **Light Cyan** | `#B9E4E8` | Dynamic highlights, badges & interactive focus rings |
| **Soft Grey** | `#EEEEEE` | High-contrast neutral content surfaces |
| **Pure White** | `#FFFFFF` | Cards, elevated dialogs & data grids |

*Typography:* Configured with Montana primary display font with fallbacks to system geometric sans-serif.

---

## 🏛️ Architecture & Authorized Role Workspaces

CINEMA OS provides dedicated, role-authorized console environments with instantaneous role switching:

### 1. 🌟 Talent Manager Console (Primary Workspace)
*Authorized Persona: Evelyn Reed &bull; Apex Talent Agency*
- **Actor Roster & Profile Engine:** Real-time day rate tracking, bio, physical metrics, showreels, and booking status.
- **Meeting & Pitch Arranger:** Director script readings, producer pitches, chemistry reads, and audition callbacks with automated prep note dispatch via mobile push and SMS.
- **Call Sheet Schedule Oversight:** Live visibility into on-set reporting times, pickup schedules, HMU call times, and digital actor acknowledgment tracking.
- **Location & Fleet Dispatch:** Instant distribution of shoot location coordinates, basecamp pins, gate security access passes, chauffeur assignments, and hospital advisories.
- **Agency Remuneration & Commission:** Talent billing, gross contract value, agent commission tracking, and deal memo storage.

### 2. 🎬 Executive Producer Console
*Authorized Persona: Marcus Vance &bull; Vance Global Pictures*
- **Production House Slate:** Multi-project management across feature films, limited series, and commercial shoots.
- **Daily Call Sheet Generator:** Automated scene breakdowns, weather integration, key contacts, cast calls, and one-click PDF generation.
- **Casting & Audition Approvals:** Direct pipeline with talent agencies for shortlist reviews, callback schedules, and screen tests.
- **Master Production Calendar:** Departmental milestone tracking, tech scouts, principal photography, and wrap dates.
- **Financial Engine & Cost Accounting:** Master production budgets, line-item variance tracking, daily burn rates, and vendor invoices.
- **Key Crew & Attendance:** Department heads, key grips, technicians, and daily RFID/geofence call attendance.

### 3. ⭐ Actor Portal
*Authorized Persona: Marcus Sterling &bull; SAG-AFTRA Principal Performer*
- **Today's Call Sheet:** Immediate access to current day call, scene numbers, costume notes, HMU times, and one-tap acknowledgment.
- **Arranged Meetings & Screen Tests:** Director pitch dates, Zoom/Google Meet links, sides downloads, and calendar synchronization.
- **Live Location Pins & Chauffeur:** Turn-by-turn navigation coordinates, dedicated chauffeur phone line, and basecamp trailer location.
- **Deal Memos & NDAs:** Direct access to countersigned agreements, tax forms, and digital signature requests.

---

## 📁 Repository Structure

```tree
CINEMA-OS/
├── apps/
│   ├── web/                    # Next.js 15 enterprise web application
│   │   ├── app/                # App Router (Manager, Producer, Actor, Finance, Call Sheets)
│   │   ├── components/         # Reusable UI primitives & layouts (ConsoleSwitcher, Header, Sidebar)
│   │   ├── config/             # Navigation, theme, and site configurations
│   │   ├── lib/                # CinemaContext, Drizzle DB schema, PDF engine, utilities
│   │   └── store/              # Redux Toolkit state slices
│   ├── mobile/                 # React Native / Expo companion app
│   │   ├── App.tsx             # Daily Call Sheet, Meeting Radar, GPS Dispatch
│   │   └── package.json
│   └── desktop/                # Tauri v2 cross-platform desktop wrapper
│       └── src-tauri/          # Windows & Linux native desktop configuration
├── docs/                       # Technical Specifications & Documentation
│   ├── ARCHITECTURE.md         # Monorepo, networking & deployment architecture
│   ├── PRD.md                  # Comprehensive product requirements document
│   ├── DATABASE_SCHEMA.md      # Normalized PostgreSQL ERD and table schemas
│   ├── RBAC.md                 # Role-based access control matrix
│   ├── FINANCIAL_ENGINE.md     # Production accounting and talent remuneration
│   ├── NOTIFICATION_ENGINE.md  # Push, SMS, and WhatsApp Cloud alert architecture
│   └── TENANT_ISOLATION.md     # Multi-tenant data segregation architecture
├── package.json                # Monorepo root scripts & workspaces
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20.x or higher
- npm 10.x or higher

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/productsmy385-spl/CINEMA-OS.git
   cd CINEMA-OS
   ```

2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Launch the development server:
   ```bash
   npm run dev --prefix apps/web
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License & Attribution

CINEMA OS incorporates the DropX Admin design system foundation. In accordance with Section 2 of its license terms, visible attribution to DataDropX is preserved within the application footer and configuration metadata. All product features, film production workflows, talent management engines, call sheet generators, and context architecture are proprietary.

