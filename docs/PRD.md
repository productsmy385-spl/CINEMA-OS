# Product Requirements Document (PRD)
## CINEMA OS — Film Production & Talent Management Enterprise SaaS

### 1. Executive Summary
**Product Name:** CINEMA OS (Film Management Operating System)
**Product Category:** Enterprise Multi-Tenant Film Production & Talent Management SaaS Platform
**Vision:** An integrated digital operating system replacing physical paperwork, Excel spreadsheets, WhatsApp chat coordination, printed call sheets, disconnected contract PDFs, and manual expense spreadsheets with one real-time multi-tenant platform.

The platform provides dedicated, role-tailored workspaces for:
1. **Super Admin:** Global SaaS platform administration, tenant provisioning, subscription billing, audit logs, feature flags, storage and quota monitoring.
2. **Production Houses & Studios:** Studio operations, project lifecycle management (Pre-production through Post-production & Distribution), department coordination, shooting schedules, call sheets, line production, equipment, locations, travel, daily attendance, budgets, expenses, and box office/OTT revenue accounting.
3. **Actor Workspace:** Verified actor profiles, portfolio/showreel showcase, privacy-controlled physical attributes, verified filmography, daily call sheets, reporting time reminders, schedule acknowledgments, digital agreements, and payment tracking.
4. **Talent Manager & Agency Console:** Multi-actor representation, fast actor-switching without re-logging, availability matrix, casting call submissions, audition tracking, contract negotiations, remuneration tracking, and travel logistics.
5. **Casting Directors & Coordinators:** Casting notices, audition scheduling, character breakdowns, actor shortlisting, role confirmations, and automated role-assignment workflows.
6. **Crew & Department Heads:** Direction, Camera, Sound, Art, Costume, Makeup, Lighting, Transport, Catering, and Post-production schedules, daily task boards, overtime, and work logs.
7. **Production Finance & Accounts:** Multi-currency budget tracking, double-entry general ledger, chart of accounts, purchase orders, expense submissions with receipt verification, vendor invoices, payment approvals, and profit & loss analytics.

---

### 2. Supported Platforms & Modalities
1. **Web Application:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Recharts, Redux Toolkit & TanStack Query.
2. **Mobile Application (iOS & Android):** React Native, Expo SDK, Expo Router, offline call sheet caching, push notifications, and fast check-in.
3. **Desktop Application (Windows & Linux):** Tauri-powered lightweight native wrapper delivering offline resilience, native notifications, and large-screen multi-window workflows.
4. **Real-time Synchronization:** Real-time event bus (SSE / WebSocket) delivering immediate updates for call sheet revisions, emergency schedule changes, chat messages, and approval notifications.

---

### 3. Core Modules & Operational Capabilities

| Module | Core Purpose & Key Capabilities | Primary Users |
|---|---|---|
| **Super Admin Console** | Tenant lifecycle (Production Houses, Agencies, Independent Managers), subscription tier management, feature flags, global audit logs, system health, platform analytics. | SaaS Platform Super Admins |
| **Production House Console** | Production house workspace, company profile, multi-project portfolio, department heads, crew rosters, production calendars, and operations. | Studio Execs, Producers, Line Producers |
| **Project & Movie Management** | Full lifecycle tracking (Development, Pre-prod, Casting, Prep, Production, Post, Distribution, Archive), milestones, tasks, dependencies, scripts, and asset folders. | Producers, Directors, ADs, PMs |
| **Actor Management** | Rich actor profiles, headshots, showreels, verified filmography, privacy-controlled bio-data, shooting dates, call sheet inbox, payment ledger, and leave management. | Actors, Personal Assistants |
| **Manager Console** | Multi-actor roster, one-click actor switcher, combined multi-actor calendar, audition pipeline, agreement uploads, commission & fee tracking, and agency reporting. | Talent Managers, Agency Admins |
| **Casting & Audition Suite** | Character breakdowns, casting calls, audition appointments, video submission review, internal casting notes, shortlists, role assignments, and contract triggers. | Casting Directors, Directors, Producers |
| **Call Sheet Engine** | Dynamic call sheet builder, scene-by-scene actor/crew call times, weather widget, hospital/emergency contacts, PDF export, digital acknowledgments, revision diff tracking. | 1st ADs, 2nd ADs, Production Managers, Actors, Crew |
| **Master Production Calendar** | Multi-view (Month, Week, Day, Timeline, Unit Gantt), conflict detection, recurring events, unit split schedules, actor availability heatmaps. | All Stakeholders |
| **Crew & Department Hub** | Department hierarchy (16 standard film departments), crew assignments, daily attendance check-in/out, overtime calculations, call times. | Department Heads, Crew Members |
| **Location & Logistics** | Shooting locations, GPS coordinates, permit attachments, parking maps, unit base, hotel reservations, flight itineraries, vehicle allocations. | Location Managers, Travel Coordinators |
| **Communication & Meetings** | Real-time channels (Production-wide, Department, Cast, Direct), announcements, meeting agendas, Google Meet/Zoom integration links. | All Cast & Crew |
| **Document & Legal Vault** | NDA agreements, artist contracts, location releases, insurance policies, digital signature workflows, version history, expiration alerts. | Legal, Producers, Managers, Actors |
| **Financial Suite & Accounting** | Line-item production budgets (A-line, B-line, C-line), expense submissions with receipt OCR/upload, approval hierarchy, vendor invoices, P&L, multi-currency. | Finance Heads, Line Producers, Accountants |
| **Audit & Compliance** | Append-only event stream recording every schedule revision, contract view, payment approval, and tenant configuration change. | Auditors, Admins, Legal |
| **Subscription & Billing** | Multi-tier plans (Free Trial, Indie, Professional, Studio, Enterprise), seat limits, storage quotas, invoices, and payment gateways. | Platform Billing, Tenant Owners |

---

### 4. Brand Identity & Visual Language
- **Brand Name:** CINEMA OS
- **Palette:**
  - Deep Navy (`#071B2B`): Primary brand identity, dark headers, dark mode surfaces, high-contrast headings.
  - Teal (`#167D8D`): Primary action buttons, active navigation indicators, key status tags, accents.
  - Light Cyan (`#B9E4E8`): Highlight badges, subtle card glows, hover states, timeline callouts.
  - Soft Grey (`#EEEEEE`): Light mode backgrounds, secondary borders, structured card dividers.
  - White (`#FFFFFF`): Light mode cards, dropdown menus, modals, high-clarity typography.
- **Typography:** Montana font family with robust typography fallback stack (`Montana, "SF Pro Display", Inter, system-ui, sans-serif`).
- **Design Tokens:** Tailwind CSS v4 variables mapped to semantic tokens (`--color-primary`, `--color-brand`, `--color-sidebar`, `--color-card`, etc.).
- **License Attribution:** Explicit preservation of DataDropX attribution in footer and layout headers as required by template license.

---

### 5. Non-Functional Requirements & Security
- **Multi-Tenant Isolation:** Complete logical tenant separation backed by `organization_id` foreign keys, tenant middleware validation, and optional PostgreSQL Row-Level Security.
- **Role-Based Access Control (RBAC):** Default-deny permission matrix covering 20+ specialized film production roles.
- **Zero-Trust Document Security:** Encrypted document storage with time-limited pre-signed download URLs. No public direct S3 URLs for legal contracts or financial records.
- **Decimal-Safe Financials:** All monetary calculations use integer cents/micro-units or decimal-safe types, preventing floating point rounding drift.
- **Offline Call Sheet Access:** Service Worker / Local SQLite storage ensuring actors and crew can access downloaded call sheets even on remote locations without cellular reception.

