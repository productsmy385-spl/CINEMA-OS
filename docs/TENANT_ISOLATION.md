# Multi-Tenant Isolation & Data Boundaries
## CINEMA OS — Secure Multi-Tenant Architecture

### 1. Tenancy Model Overview
CINEMA OS serves three distinct multi-tenant organizational categories with strict isolation:
1. **Production Houses / Film Studios:** Completely private projects, scripts, call sheets, internal budgets, vendor deals, and crew rosters.
2. **Talent Management Agencies:** Private client rosters, commission structures, audition logs, and negotiation history.
3. **Independent Actors & Managers:** Dual-scoped profiles where public portfolio data is discoverable, but sensitive contracts, daily call times, and financial statements are strictly access-controlled.

---

### 2. Multi-Tenant Request Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Actor / Manager
    participant NextClient as Next.js Web / Mobile Client
    participant AuthMW as Authentication & Tenant Middleware
    participant APIRoute as API Route Handler
    participant DB as PostgreSQL (with Tenant Key Guard)

    User->>NextClient: Request Project or Call Sheet
    NextClient->>AuthMW: Send HTTP Request with Clerk JWT
    AuthMW->>AuthMW: Validate JWT & Extract User ID + Active Org ID
    AuthMW->>APIRoute: Attach Verified { userId, tenantId, permissions }
    APIRoute->>APIRoute: Validate Permission against Resource
    APIRoute->>DB: SELECT * FROM call_sheets WHERE organization_id = :tenantId AND id = :id
    DB-->>APIRoute: Return Tenant-Isolated Records
    APIRoute-->>NextClient: 200 OK with Data
```

---

### 3. Cross-Tenant Collaboration Boundaries
An actor may be managed by Agency X while performing in Movie Y produced by Studio Z.
- **Rules of Cross-Tenant Access:**
  - Studio Z can view Actor's character call time, on-set attendance, and costume measurements for Movie Y only.
  - Studio Z cannot view Actor's contracts or payments from Studio W.
  - Agency X can view Actor's schedule across Movie Y and Audition Q to prevent scheduling conflicts.
  - Agency X cannot view confidential scripts or budget lines of Movie Y unless expressly shared.

