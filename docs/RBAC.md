# Role-Based Access Control (RBAC) Specification
## CINEMA OS — Granular Multi-Tenant Permission Matrix

CINEMA OS implements a strict **Default-Deny** authorization architecture. Permissions are evaluated across three hierarchical dimensions:
1. **Platform Scope:** Super Admin, Platform Support, Platform Auditor.
2. **Organization Scope:** Production House Owner, Talent Agency Admin, Independent Manager.
3. **Project & Department Scope:** Line Producer, 1st AD, 2nd AD, Department Head, Cast Member, Crew.

---

### 1. Role Definitions

| Role Code | Role Title | Typical Persona | Scope |
|---|---|---|---|
| `SUPER_ADMIN` | Platform Super Administrator | SaaS System Operator | Global |
| `STUDIO_OWNER` | Studio / Production House Owner | Studio Head / Exec Producer | Tenant |
| `LINE_PRODUCER` | Line Producer / Production Exec | Line Producer / UPM | Project & Financials |
| `DIRECTOR` | Film Director | Director | Creative & Cast |
| `FIRST_AD` | First Assistant Director | 1st AD | Call Sheets & Schedule |
| `SECOND_AD` | Second Assistant Director | 2nd AD | Cast Call Times & Logistics |
| `FINANCE_MGR` | Production Finance Manager | Head of Accounts / Controller | Accounting & Budgets |
| `CASTING_DIR` | Casting Director | Casting Director | Auditions & Roles |
| `TALENT_MGR` | Talent Manager / Agent | Actor's Personal Manager | Managed Actors & Deals |
| `ACTOR` | Actor / Talent | Lead / Supporting Actor | Personal Call Sheets & Contracts |
| `DEPT_HEAD` | Department Head (HOD) | DP, Gaffer, Art Director | Department Crew & Tasks |
| `CREW_MEMBER` | Crew Member | Camera Operator, Boom Op | Schedule & Time Logs |

---

### 2. Permissions Matrix

| Permission Key | Description | Roles Permitted |
|---|---|---|
| `tenant:manage` | Manage company details, billing & members | `SUPER_ADMIN`, `STUDIO_OWNER` |
| `project:create` | Create new movies and production projects | `SUPER_ADMIN`, `STUDIO_OWNER`, `LINE_PRODUCER` |
| `project:view` | View project metadata and general overview | All project members |
| `callsheet:create` | Draft and edit daily call sheets | `FIRST_AD`, `SECOND_AD`, `LINE_PRODUCER` |
| `callsheet:publish` | Publish call sheet and notify cast & crew | `FIRST_AD`, `LINE_PRODUCER` |
| `callsheet:view_all` | View full call sheet details | Director, Producers, 1st AD, HODs |
| `callsheet:view_assigned` | View assigned call time & scenes only | `ACTOR`, `CREW_MEMBER` |
| `callsheet:acknowledge` | Acknowledge receipt of daily call time | `ACTOR`, `CREW_MEMBER`, `TALENT_MGR` |
| `actor:manage_roster` | Add and update managed actor portfolios | `TALENT_MGR`, `STUDIO_OWNER` |
| `actor:view_confidential` | View actor DOB, home address & emergency | `LINE_PRODUCER`, `TALENT_MGR`, Actor Self |
| `casting:manage_calls` | Create casting calls and schedule auditions | `CASTING_DIR`, `DIRECTOR`, `PRODUCER` |
| `budget:view` | View full production budget line items | `STUDIO_OWNER`, `LINE_PRODUCER`, `FINANCE_MGR` |
| `budget:edit` | Modify approved budget allotments | `STUDIO_OWNER`, `FINANCE_MGR` |
| `expense:submit` | Submit expense receipts for reimbursement | All crew and authorized cast |
| `expense:approve` | Approve or reject submitted expenses | `LINE_PRODUCER`, `FINANCE_MGR` |
| `contracts:view` | View legally binding artist agreements | `STUDIO_OWNER`, `TALENT_MGR`, Actor Self |
| `contracts:sign` | Electronically execute contracts | Signatory user specified in document |
| `audit:view` | Inspect immutable audit logs | `SUPER_ADMIN`, `STUDIO_OWNER`, Auditor |

---

### 3. Server-Side Enforcement Pattern
Never rely on client-side role rendering alone. Every API endpoint checks:
```typescript
import { verifyAuthAndPermission } from "@/lib/auth/rbac";

export async function POST(req: Request) {
  const session = await verifyAuthAndPermission(req, "callsheet:publish");
  if (!session.isAuthorized) {
    return Response.json({ error: "Forbidden: insufficient permissions" }, { status: 403 });
  }
  // Safe to proceed with publishing
}
```

