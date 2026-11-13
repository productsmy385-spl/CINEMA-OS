# Database Schema & Data Dictionary
## CINEMA OS — PostgreSQL 16 & Drizzle ORM Schema

This document outlines the complete relational data model powering CINEMA OS. The schema is organized into logical domain blocks with explicit multi-tenant ownership, indexing strategies, foreign key constraints, and audit hooks.

---

### 1. Identity, Tenancy & Access Control

#### `organizations` (Tenants)
Represents a Production House, Talent Agency, or Independent Management entity.
- `id` (UUID, Primary Key, default gen_random_uuid())
- `name` (VARCHAR(255), NOT NULL)
- `slug` (VARCHAR(100), UNIQUE, NOT NULL)
- `type` (ENUM: 'production_house', 'talent_agency', 'independent_manager', 'studio', 'super_admin')
- `clerk_org_id` (VARCHAR(100), UNIQUE)
- `logo_url` (TEXT)
- `registration_number` (VARCHAR(100))
- `tax_id` (VARCHAR(100))
- `default_currency` (VARCHAR(3), DEFAULT 'USD')
- `timezone` (VARCHAR(50), DEFAULT 'UTC')
- `subscription_tier` (ENUM: 'free_trial', 'starter', 'professional', 'business', 'enterprise')
- `subscription_status` (ENUM: 'active', 'past_due', 'canceled', 'trialing')
- `created_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())
- `updated_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())

#### `users`
Global platform user registry synced with Clerk.
- `id` (UUID, Primary Key)
- `clerk_user_id` (VARCHAR(100), UNIQUE, NOT NULL)
- `email` (VARCHAR(255), UNIQUE, NOT NULL)
- `first_name` (VARCHAR(100))
- `last_name` (VARCHAR(100))
- `avatar_url` (TEXT)
- `phone_number` (VARCHAR(50))
- `is_super_admin` (BOOLEAN, DEFAULT FALSE)
- `status` (ENUM: 'active', 'suspended', 'pending_verification')
- `created_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())
- `updated_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())

#### `organization_memberships`
Binds users to organizations with specific film roles.
- `id` (UUID, Primary Key)
- `organization_id` (UUID, REFERENCES organizations(id) ON DELETE CASCADE)
- `user_id` (UUID, REFERENCES users(id) ON DELETE CASCADE)
- `role` (ENUM: 'owner', 'producer', 'director', 'first_ad', 'production_manager', 'finance_manager', 'casting_director', 'dept_head', 'crew_member', 'actor', 'talent_manager', 'auditor')
- `permissions` (JSONB, NOT NULL DEFAULT '[]')
- `is_active` (BOOLEAN, DEFAULT TRUE)
- `created_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())
- UNIQUE(`organization_id`, `user_id`)

---

### 2. Talent & Actor Ecosystem

#### `actor_profiles`
Comprehensive actor professional bio and physical specifications.
- `id` (UUID, Primary Key)
- `user_id` (UUID, REFERENCES users(id), NULLABLE for non-registered talents)
- `primary_organization_id` (UUID, REFERENCES organizations(id))
- `stage_name` (VARCHAR(255), NOT NULL)
- `legal_name` (VARCHAR(255))
- `date_of_birth` (DATE)
- `is_dob_private` (BOOLEAN, DEFAULT TRUE)
- `gender` (VARCHAR(50))
- `nationality` (VARCHAR(100))
- `languages` (TEXT[]) # Array of spoken languages & dialects
- `skills` (TEXT[]) # Stunts, horseback riding, singing, martial arts, etc.
- `height_cm` (NUMERIC(5,2))
- `weight_kg` (NUMERIC(5,2))
- `eye_color` (VARCHAR(50))
- `hair_color` (VARCHAR(50))
- `emergency_contact_name` (VARCHAR(255))
- `emergency_contact_phone` (VARCHAR(50))
- `bio` (TEXT)
- `headshot_url` (TEXT)
- `resume_url` (TEXT)
- `created_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())

#### `actor_showreels`
Showreel media assets and video portfolio.
- `id` (UUID, Primary Key)
- `actor_profile_id` (UUID, REFERENCES actor_profiles(id) ON DELETE CASCADE)
- `title` (VARCHAR(255) NOT NULL)
- `video_url` (TEXT NOT NULL)
- `thumbnail_url` (TEXT)
- `duration_seconds` (INTEGER)
- `category` (ENUM: 'dramatic', 'action', 'comedy', 'commercial', 'general_reel')
- `display_order` (INTEGER DEFAULT 0)

#### `manager_actor_relationships`
Allows managers and talent agencies to manage multiple actors with granular delegations.
- `id` (UUID, Primary Key)
- `manager_user_id` (UUID, REFERENCES users(id))
- `agency_organization_id` (UUID, REFERENCES organizations(id))
- `actor_profile_id` (UUID, REFERENCES actor_profiles(id) ON DELETE CASCADE)
- `can_manage_calendar` (BOOLEAN DEFAULT TRUE)
- `can_negotiate_contracts` (BOOLEAN DEFAULT TRUE)
- `can_accept_roles` (BOOLEAN DEFAULT FALSE)
- `can_view_finances` (BOOLEAN DEFAULT TRUE)
- `status` (ENUM: 'active', 'pending_approval', 'terminated')
- `commission_percentage` (NUMERIC(5,2) DEFAULT 10.00)

---

### 3. Production, Movies & Projects

#### `projects`
Movies, Web Series, Documentaries, Advertisements.
- `id` (UUID, Primary Key)
- `organization_id` (UUID, REFERENCES organizations(id) ON DELETE CASCADE)
- `title` (VARCHAR(255), NOT NULL)
- `code` (VARCHAR(50), NOT NULL) # e.g., "PRJ-2026-CHRONO"
- `project_type` (ENUM: 'feature_film', 'web_series', 'tv_series', 'commercial', 'short_film', 'documentary', 'music_video')
- `phase` (ENUM: 'concept', 'development', 'pre_production', 'casting', 'production', 'post_production', 'marketing', 'completed', 'archived')
- `synopsis` (TEXT)
- `director_name` (VARCHAR(255))
- `producer_name` (VARCHAR(255))
- `executive_producer_name` (VARCHAR(255))
- `production_manager_name` (VARCHAR(255))
- `start_date` (DATE)
- `target_wrap_date` (DATE)
- `actual_wrap_date` (DATE)
- `total_budget` (BIGINT NOT NULL DEFAULT 0) # Store in cents
- `currency` (VARCHAR(3) DEFAULT 'USD')
- `banner_image_url` (TEXT)
- `status` (ENUM: 'active', 'on_hold', 'wrapped', 'cancelled')
- `created_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())
- `updated_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())

#### `characters` & `role_assignments`
Roles defined inside a project and their contracted actor assignments.
- `id` (UUID, Primary Key)
- `project_id` (UUID, REFERENCES projects(id) ON DELETE CASCADE)
- `name` (VARCHAR(255) NOT NULL)
- `description` (TEXT)
- `type` (ENUM: 'lead', 'supporting', 'cameo', 'background', 'stunt_double')
- `actor_profile_id` (UUID, REFERENCES actor_profiles(id), NULLABLE until cast)
- `day_rate` (BIGINT DEFAULT 0)
- `total_agreed_fee` (BIGINT DEFAULT 0)
- `status` (ENUM: 'casting', 'auditioning', 'offered', 'contract_signed', 'locked')

---

### 4. Heart of CINEMA OS: Call Sheets & Schedules

#### `shooting_days`
Planned shoot days within a production schedule.
- `id` (UUID, Primary Key)
- `project_id` (UUID, REFERENCES projects(id) ON DELETE CASCADE)
- `day_number` (INTEGER NOT NULL) # e.g. Day 14 of 45
- `shoot_date` (DATE NOT NULL)
- `unit_name` (VARCHAR(100) DEFAULT 'Main Unit') # Main Unit, 2nd Unit, Splinter Unit
- `primary_location` (VARCHAR(255))
- `general_call_time` (TIME NOT NULL)
- `estimated_wrap_time` (TIME NOT NULL)
- `status` (ENUM: 'scheduled', 'in_progress', 'wrapped', 'cancelled', 'rescheduled')

#### `call_sheets`
Comprehensive daily call sheet documents.
- `id` (UUID, Primary Key)
- `shooting_day_id` (UUID, REFERENCES shooting_days(id) ON DELETE CASCADE)
- `project_id` (UUID, REFERENCES projects(id) ON DELETE CASCADE)
- `version` (INTEGER DEFAULT 1)
- `published_at` (TIMESTAMP WITH TIME ZONE)
- `published_by_user_id` (UUID, REFERENCES users(id))
- `weather_summary` (VARCHAR(255))
- `sunrise_time` (TIME)
- `sunset_time` (TIME)
- `nearest_hospital_name` (VARCHAR(255))
- `nearest_hospital_address` (TEXT)
- `nearest_hospital_phone` (VARCHAR(50))
- `catering_instructions` (TEXT)
- `parking_instructions` (TEXT)
- `special_notes` (TEXT)
- `status` (ENUM: 'draft', 'published', 'revised', 'archived')
- `pdf_url` (TEXT)

#### `call_sheet_scenes`
Scenes scheduled on this specific call sheet.
- `id` (UUID, Primary Key)
- `call_sheet_id` (UUID, REFERENCES call_sheets(id) ON DELETE CASCADE)
- `scene_number` (VARCHAR(20) NOT NULL) # e.g. "Scene 42A"
- `day_or_night` (ENUM: 'DAY', 'NIGHT', 'DUSK', 'DAWN')
- `int_or_ext` (ENUM: 'INT', 'EXT', 'INT/EXT')
- `description` (TEXT)
- `script_pages` (VARCHAR(20)) # e.g., "2 3/8 pgs"
- `cast_ids_required` (INTEGER[])
- `scheduled_start_time` (TIME)
- `scheduled_end_time` (TIME)

#### `call_sheet_cast_calls`
Individual call times for each actor on the call sheet.
- `id` (UUID, Primary Key)
- `call_sheet_id` (UUID, REFERENCES call_sheets(id) ON DELETE CASCADE)
- `actor_profile_id` (UUID, REFERENCES actor_profiles(id) ON DELETE CASCADE)
- `character_name` (VARCHAR(255) NOT NULL)
- `pickup_time` (TIME)
- `hmu_time` (TIME) # Hair, Makeup & Wardrobe call
- `on_set_call_time` (TIME NOT NULL)
- `notes` (TEXT)
- `acknowledged_at` (TIMESTAMP WITH TIME ZONE)
- `acknowledgment_ip` (VARCHAR(50))

---

### 5. Financial Management & Double-Entry Ledger

#### `budget_line_items`
Detailed categorized production budget items.
- `id` (UUID, Primary Key)
- `project_id` (UUID, REFERENCES projects(id) ON DELETE CASCADE)
- `category` (ENUM: 'above_the_line', 'production_staff', 'camera_grip_electric', 'art_department', 'wardrobe_makeup', 'location_travel', 'catering', 'post_production', 'vfx_sound', 'insurance_legal', 'contingency')
- `account_code` (VARCHAR(50) NOT NULL) # e.g., "ATL-1010-DIR"
- `description` (VARCHAR(255) NOT NULL)
- `estimated_amount` (BIGINT NOT NULL DEFAULT 0) # in cents
- `approved_amount` (BIGINT NOT NULL DEFAULT 0)
- `actual_expended` (BIGINT NOT NULL DEFAULT 0)
- `variance` (BIGINT NOT NULL DEFAULT 0)

#### `expenses`
Operational expenses incurred during production.
- `id` (UUID, Primary Key)
- `project_id` (UUID, REFERENCES projects(id) ON DELETE CASCADE)
- `budget_line_item_id` (UUID, REFERENCES budget_line_items(id))
- `submitted_by_user_id` (UUID, REFERENCES users(id))
- `vendor_name` (VARCHAR(255))
- `amount` (BIGINT NOT NULL)
- `currency` (VARCHAR(3) DEFAULT 'USD')
- `expense_date` (DATE NOT NULL)
- `receipt_url` (TEXT)
- `approval_status` (ENUM: 'pending', 'approved', 'rejected', 'reimbursed')
- `approved_by_user_id` (UUID, REFERENCES users(id))
- `notes` (TEXT)

---

### 6. Legal, Contracts & Audit

#### `documents` & `agreements`
- `id` (UUID, Primary Key)
- `organization_id` (UUID, REFERENCES organizations(id) ON DELETE CASCADE)
- `project_id` (UUID, REFERENCES projects(id), NULLABLE)
- `title` (VARCHAR(255) NOT NULL)
- `document_type` (ENUM: 'actor_agreement', 'crew_contract', 'nda', 'location_release', 'music_license', 'insurance_policy')
- `storage_path` (TEXT NOT NULL)
- `file_size_bytes` (BIGINT)
- `mime_type` (VARCHAR(100))
- `signature_status` (ENUM: 'draft', 'sent_for_signature', 'partially_signed', 'fully_executed', 'declined')
- `effective_date` (DATE)
- `expiration_date` (DATE)

#### `audit_logs`
Immutable activity ledger capturing all critical changes across the platform.
- `id` (BIGSERIAL, Primary Key)
- `organization_id` (UUID, REFERENCES organizations(id))
- `user_id` (UUID, REFERENCES users(id), NULLABLE)
- `action` (VARCHAR(100) NOT NULL) # e.g., "CALL_SHEET_PUBLISHED", "EXPENSE_APPROVED"
- `entity_type` (VARCHAR(100) NOT NULL)
- `entity_id` (VARCHAR(100) NOT NULL)
- `previous_state` (JSONB)
- `new_state` (JSONB)
- `ip_address` (VARCHAR(50))
- `user_agent` (TEXT)
- `created_at` (TIMESTAMP WITH TIME ZONE DEFAULT NOW())

