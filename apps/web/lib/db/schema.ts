import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  bigint,
  timestamp,
  date,
  time,
  numeric,
  jsonb,
  pgEnum,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// --- ENUMS ---
export const orgTypeEnum = pgEnum("org_type", [
  "production_house",
  "talent_agency",
  "independent_manager",
  "studio",
  "super_admin",
]);

export const subTierEnum = pgEnum("subscription_tier", [
  "free_trial",
  "starter",
  "professional",
  "business",
  "enterprise",
]);

export const projectPhaseEnum = pgEnum("project_phase", [
  "concept",
  "development",
  "pre_production",
  "casting",
  "production",
  "post_production",
  "marketing",
  "completed",
  "archived",
]);

export const roleCategoryEnum = pgEnum("role_category", [
  "owner",
  "producer",
  "director",
  "first_ad",
  "second_ad",
  "production_manager",
  "line_producer",
  "finance_manager",
  "accountant",
  "casting_director",
  "dept_head",
  "crew_member",
  "actor",
  "talent_manager",
  "auditor",
]);

export const callSheetStatusEnum = pgEnum("call_sheet_status", [
  "draft",
  "published",
  "revised",
  "archived",
]);

export const dayNightEnum = pgEnum("day_night", ["DAY", "NIGHT", "DUSK", "DAWN"]);
export const intExtEnum = pgEnum("int_ext", ["INT", "EXT", "INT/EXT"]);

export const expenseStatusEnum = pgEnum("expense_status", [
  "pending",
  "approved",
  "rejected",
  "reimbursed",
]);

export const signatureStatusEnum = pgEnum("signature_status", [
  "draft",
  "sent_for_signature",
  "partially_signed",
  "fully_executed",
  "declined",
]);

// --- 1. ORGANIZATIONS (TENANTS) ---
export const organizations = pgTable(
  "organizations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 100 }).unique().notNull(),
    type: orgTypeEnum("type").default("production_house").notNull(),
    clerkOrgId: varchar("clerk_org_id", { length: 100 }).unique(),
    logoUrl: text("logo_url"),
    registrationNumber: varchar("registration_number", { length: 100 }),
    taxId: varchar("tax_id", { length: 100 }),
    defaultCurrency: varchar("default_currency", { length: 3 }).default("USD").notNull(),
    timezone: varchar("timezone", { length: 50 }).default("America/Los_Angeles").notNull(),
    subscriptionTier: subTierEnum("subscription_tier").default("professional").notNull(),
    isSuspended: boolean("is_suspended").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("org_slug_idx").on(table.slug),
    index("org_type_idx").on(table.type),
  ]
);

// --- 2. USERS ---
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkUserId: varchar("clerk_user_id", { length: 100 }).unique().notNull(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    firstName: varchar("first_name", { length: 100 }).notNull(),
    lastName: varchar("last_name", { length: 100 }).notNull(),
    avatarUrl: text("avatar_url"),
    phoneNumber: varchar("phone_number", { length: 50 }),
    isSuperAdmin: boolean("is_super_admin").default(false).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("user_clerk_idx").on(table.clerkUserId),
    uniqueIndex("user_email_idx").on(table.email),
  ]
);

// --- 3. ORGANIZATION MEMBERSHIPS & RBAC ---
export const organizationMemberships = pgTable(
  "organization_memberships",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id")
      .references(() => organizations.id, { onDelete: "cascade" })
      .notNull(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    role: roleCategoryEnum("role").default("crew_member").notNull(),
    department: varchar("department", { length: 100 }), // Camera, Sound, Direction, Production, etc.
    jobTitle: varchar("job_title", { length: 150 }), // e.g. "Director of Photography"
    permissions: jsonb("permissions").default([]).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("membership_org_user_idx").on(table.organizationId, table.userId),
  ]
);

// --- 4. ACTOR PROFILES ---
export const actorProfiles = pgTable(
  "actor_profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    primaryOrganizationId: uuid("primary_organization_id").references(() => organizations.id),
    stageName: varchar("stage_name", { length: 255 }).notNull(),
    legalName: varchar("legal_name", { length: 255 }),
    dateOfBirth: date("date_of_birth"),
    isDobPrivate: boolean("is_dob_private").default(true).notNull(),
    gender: varchar("gender", { length: 50 }),
    languages: text("languages").array(),
    skills: text("skills").array(), // stunts, equestrian, dialect, etc.
    heightCm: numeric("height_cm", { precision: 5, scale: 2 }),
    weightKg: numeric("weight_kg", { precision: 5, scale: 2 }),
    eyeColor: varchar("eye_color", { length: 50 }),
    hairColor: varchar("hair_color", { length: 50 }),
    emergencyContactName: varchar("emergency_contact_name", { length: 255 }),
    emergencyContactPhone: varchar("emergency_contact_phone", { length: 50 }),
    bio: text("bio"),
    headshotUrl: text("headshot_url"),
    resumeUrl: text("resume_url"),
    standardDayRateCents: bigint("standard_day_rate_cents", { mode: "number" }).default(0),
    isVerified: boolean("is_verified").default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("actor_stage_name_idx").on(table.stageName),
  ]
);

// --- 5. MANAGER ACTOR RELATIONSHIPS ---
export const managerActorRelationships = pgTable("manager_actor_relationships", {
  id: uuid("id").primaryKey().defaultRandom(),
  managerUserId: uuid("manager_user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  agencyOrganizationId: uuid("agency_organization_id").references(() => organizations.id),
  actorProfileId: uuid("actor_profile_id")
    .references(() => actorProfiles.id, { onDelete: "cascade" })
    .notNull(),
  commissionRatePercent: numeric("commission_rate_percent", { precision: 5, scale: 2 }).default("10.00"),
  canManageCalendar: boolean("can_manage_calendar").default(true).notNull(),
  canNegotiateContracts: boolean("can_negotiate_contracts").default(true).notNull(),
  canAcceptRoles: boolean("can_accept_roles").default(false).notNull(),
  canViewFinances: boolean("can_view_finances").default(true).notNull(),
  status: varchar("status", { length: 50 }).default("active").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// --- 6. PROJECTS (MOVIES, SERIES, CAMPAIGNS) ---
export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id")
      .references(() => organizations.id, { onDelete: "cascade" })
      .notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    code: varchar("code", { length: 50 }).notNull(), // e.g. "PRJ-CHRONO"
    projectType: varchar("project_type", { length: 50 }).default("feature_film").notNull(),
    phase: projectPhaseEnum("phase").default("pre_production").notNull(),
    synopsis: text("synopsis"),
    directorName: varchar("director_name", { length: 255 }),
    producerName: varchar("producer_name", { length: 255 }),
    executiveProducerName: varchar("executive_producer_name", { length: 255 }),
    productionManagerName: varchar("production_manager_name", { length: 255 }),
    startDate: date("start_date"),
    targetWrapDate: date("target_wrap_date"),
    totalBudgetCents: bigint("total_budget_cents", { mode: "number" }).default(0).notNull(),
    spentBudgetCents: bigint("spent_budget_cents", { mode: "number" }).default(0).notNull(),
    currency: varchar("currency", { length: 3 }).default("USD").notNull(),
    coverImageUrl: text("cover_image_url"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("projects_org_idx").on(table.organizationId),
  ]
);

// --- 7. CHARACTERS & ROLE ASSIGNMENTS ---
export const characters = pgTable("characters", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .references(() => projects.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  roleType: varchar("role_type", { length: 50 }).default("lead").notNull(), // lead, supporting, cameo, stunt
  description: text("description"),
  actorProfileId: uuid("actor_profile_id").references(() => actorProfiles.id),
  agreedFeeCents: bigint("agreed_fee_cents", { mode: "number" }).default(0),
  isContractSigned: boolean("is_contract_signed").default(false),
  status: varchar("status", { length: 50 }).default("confirmed"),
});

// --- 8. SHOOTING DAYS ---
export const shootingDays = pgTable(
  "shooting_days",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .references(() => projects.id, { onDelete: "cascade" })
      .notNull(),
    dayNumber: integer("day_number").notNull(),
    shootDate: date("shoot_date").notNull(),
    unitName: varchar("unit_name", { length: 100 }).default("Main Unit").notNull(),
    generalCallTime: time("general_call_time").notNull(),
    estimatedWrapTime: time("estimated_wrap_time").notNull(),
    locationName: varchar("location_name", { length: 255 }),
    locationAddress: text("location_address"),
    isCompleted: boolean("is_completed").default(false),
  },
  (table) => [
    index("shooting_days_project_idx").on(table.projectId),
  ]
);

// --- 9. CALL SHEETS (HEART OF CINEMA OS) ---
export const callSheets = pgTable(
  "call_sheets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .references(() => projects.id, { onDelete: "cascade" })
      .notNull(),
    shootingDayId: uuid("shooting_day_id")
      .references(() => shootingDays.id, { onDelete: "cascade" })
      .notNull(),
    version: integer("version").default(1).notNull(),
    status: callSheetStatusEnum("status").default("draft").notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    weatherSummary: varchar("weather_summary", { length: 255 }),
    sunriseTime: time("sunrise_time"),
    sunsetTime: time("sunset_time"),
    nearestHospitalName: varchar("nearest_hospital_name", { length: 255 }),
    nearestHospitalAddress: text("nearest_hospital_address"),
    nearestHospitalPhone: varchar("nearest_hospital_phone", { length: 50 }),
    parkingInstructions: text("parking_instructions"),
    cateringNotes: text("catering_notes"),
    specialInstructions: text("special_instructions"),
    pdfUrl: text("pdf_url"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("call_sheets_project_idx").on(table.projectId),
  ]
);

// --- 10. CALL SHEET SCENES ---
export const callSheetScenes = pgTable("call_sheet_scenes", {
  id: uuid("id").primaryKey().defaultRandom(),
  callSheetId: uuid("call_sheet_id")
    .references(() => callSheets.id, { onDelete: "cascade" })
    .notNull(),
  sceneNumber: varchar("scene_number", { length: 50 }).notNull(),
  intExt: intExtEnum("int_ext").default("INT").notNull(),
  dayNight: dayNightEnum("day_night").default("DAY").notNull(),
  description: text("description").notNull(),
  pages: varchar("pages", { length: 20 }), // e.g. "3 4/8 pgs"
  charactersRequired: text("characters_required"), // e.g. "CHRONO, ELENA, GUARD #1"
  estimatedStartTime: time("estimated_start_time"),
  estimatedEndTime: time("estimated_end_time"),
  completedAt: timestamp("completed_at", { withTimezone: true }),
});

// --- 11. CALL SHEET CAST CALLS ---
export const callSheetCastCalls = pgTable("call_sheet_cast_calls", {
  id: uuid("id").primaryKey().defaultRandom(),
  callSheetId: uuid("call_sheet_id")
    .references(() => callSheets.id, { onDelete: "cascade" })
    .notNull(),
  actorProfileId: uuid("actor_profile_id")
    .references(() => actorProfiles.id, { onDelete: "cascade" })
    .notNull(),
  characterName: varchar("character_name", { length: 255 }).notNull(),
  pickupTime: time("pickup_time"),
  hmuTime: time("hmu_time"), // Hair & Makeup Call
  onSetCallTime: time("on_set_call_time").notNull(),
  notes: text("notes"),
  acknowledgedAt: timestamp("acknowledged_at", { withTimezone: true }),
  actualArrivalTime: time("actual_arrival_time"),
});

// --- 12. BUDGET LINE ITEMS ---
export const budgetLineItems = pgTable(
  "budget_line_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .references(() => projects.id, { onDelete: "cascade" })
      .notNull(),
    category: varchar("category", { length: 100 }).notNull(), // Above the Line, Production, Post, VFX
    accountCode: varchar("account_code", { length: 50 }).notNull(),
    description: varchar("description", { length: 255 }).notNull(),
    estimatedCents: bigint("estimated_cents", { mode: "number" }).default(0).notNull(),
    approvedCents: bigint("approved_cents", { mode: "number" }).default(0).notNull(),
    actualCents: bigint("actual_cents", { mode: "number" }).default(0).notNull(),
    varianceCents: bigint("variance_cents", { mode: "number" }).default(0).notNull(),
  },
  (table) => [
    index("budget_project_idx").on(table.projectId),
  ]
);

// --- 13. EXPENSES ---
export const expenses = pgTable(
  "expenses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .references(() => projects.id, { onDelete: "cascade" })
      .notNull(),
    budgetLineItemId: uuid("budget_line_item_id").references(() => budgetLineItems.id),
    submittedByUserId: uuid("submitted_by_user_id").references(() => users.id),
    vendorName: varchar("vendor_name", { length: 255 }).notNull(),
    category: varchar("category", { length: 100 }).notNull(),
    amountCents: bigint("amount_cents", { mode: "number" }).notNull(),
    currency: varchar("currency", { length: 3 }).default("USD").notNull(),
    expenseDate: date("expense_date").notNull(),
    receiptUrl: text("receipt_url"),
    status: expenseStatusEnum("status").default("pending").notNull(),
    approvedByUserId: uuid("approved_by_user_id").references(() => users.id),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("expenses_project_idx").on(table.projectId),
  ]
);

// --- 14. LEGAL AGREEMENTS & CONTRACTS ---
export const agreements = pgTable("agreements", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .references(() => organizations.id, { onDelete: "cascade" })
    .notNull(),
  projectId: uuid("project_id").references(() => projects.id),
  title: varchar("title", { length: 255 }).notNull(),
  documentType: varchar("document_type", { length: 100 }).notNull(), // Actor Agreement, NDA, Location Release
  fileUrl: text("file_url").notNull(),
  signatureStatus: signatureStatusEnum("signature_status").default("draft").notNull(),
  signatoryPartyName: varchar("signatory_party_name", { length: 255 }).notNull(),
  signatoryPartyEmail: varchar("signatory_party_email", { length: 255 }),
  signedAt: timestamp("signed_at", { withTimezone: true }),
  expiresAt: date("expires_at"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// --- 15. AUDIT LOGS ---
export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id").references(() => organizations.id),
    userId: uuid("user_id").references(() => users.id),
    action: varchar("action", { length: 100 }).notNull(), // CALL_SHEET_PUBLISHED, EXPENSE_APPROVED, CONTRACT_SIGNED
    entityType: varchar("entity_type", { length: 100 }).notNull(),
    entityId: varchar("entity_id", { length: 100 }).notNull(),
    details: jsonb("details"),
    ipAddress: varchar("ip_address", { length: 50 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("audit_org_idx").on(table.organizationId),
  ]
);

