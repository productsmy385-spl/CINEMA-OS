import { pool } from "./index";

export async function initializeDatabase() {
  if (!pool) {
    throw new Error("Database pool is not configured. DATABASE_URL is required.");
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN;");

    // Extensions
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    // 1. Organizations
    await client.query(`
      CREATE TABLE IF NOT EXISTS organizations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        type VARCHAR(50) DEFAULT 'production_house' NOT NULL,
        clerk_org_id VARCHAR(100) UNIQUE,
        logo_url TEXT,
        registration_number VARCHAR(100),
        tax_id VARCHAR(100),
        default_currency VARCHAR(3) DEFAULT 'USD' NOT NULL,
        timezone VARCHAR(50) DEFAULT 'America/Los_Angeles' NOT NULL,
        subscription_tier VARCHAR(50) DEFAULT 'professional' NOT NULL,
        is_suspended BOOLEAN DEFAULT FALSE NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      );
    `);

    // 2. Users
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        clerk_user_id VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        avatar_url TEXT,
        phone_number VARCHAR(50),
        is_super_admin BOOLEAN DEFAULT FALSE NOT NULL,
        is_active BOOLEAN DEFAULT TRUE NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      );
    `);

    // 3. Organization Memberships
    await client.query(`
      CREATE TABLE IF NOT EXISTS organization_memberships (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role VARCHAR(50) DEFAULT 'crew_member' NOT NULL,
        department VARCHAR(100),
        permissions JSONB DEFAULT '[]'::jsonb NOT NULL,
        is_active BOOLEAN DEFAULT TRUE NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      );
    `);

    // 4. Projects (Movies, Web Series, Commercials)
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        code VARCHAR(20) NOT NULL,
        format VARCHAR(50) DEFAULT 'feature_film' NOT NULL,
        phase VARCHAR(50) DEFAULT 'development' NOT NULL,
        logline TEXT,
        synopsis TEXT,
        genre JSONB DEFAULT '[]'::jsonb,
        estimated_budget NUMERIC(15, 2) DEFAULT 0.00,
        currency VARCHAR(3) DEFAULT 'USD',
        start_date DATE,
        projected_wrap_date DATE,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      );
    `);

    // 5. Actors (Talent)
    await client.query(`
      CREATE TABLE IF NOT EXISTS actors (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
        user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        stage_name VARCHAR(150) NOT NULL,
        legal_name VARCHAR(150),
        agency_name VARCHAR(150),
        manager_contact VARCHAR(150),
        email VARCHAR(255),
        phone VARCHAR(50),
        standard_day_rate NUMERIC(12, 2) DEFAULT 0.00,
        union_status VARCHAR(50) DEFAULT 'SAG-AFTRA',
        status VARCHAR(50) DEFAULT 'available',
        height VARCHAR(30),
        weight VARCHAR(30),
        hair_color VARCHAR(30),
        eye_color VARCHAR(30),
        languages JSONB DEFAULT '[]'::jsonb,
        skills JSONB DEFAULT '[]'::jsonb,
        bio TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      );
    `);

    // 6. Call Sheets
    await client.query(`
      CREATE TABLE IF NOT EXISTS call_sheets (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
        project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        shoot_date DATE NOT NULL,
        day_number INT NOT NULL,
        total_days INT NOT NULL,
        general_crew_call TIME NOT NULL,
        estimated_wrap TIME NOT NULL,
        director_name VARCHAR(150),
        cinematographer_name VARCHAR(150),
        producer_name VARCHAR(150),
        status VARCHAR(50) DEFAULT 'draft' NOT NULL,
        weather_summary TEXT,
        nearest_hospital TEXT,
        special_instructions TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      );
    `);

    // 7. Shoot Locations & Fleet
    await client.query(`
      CREATE TABLE IF NOT EXISTS shoot_locations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
        project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
        name VARCHAR(255) NOT NULL,
        address TEXT NOT NULL,
        gps_coordinates VARCHAR(100),
        basecamp_lot VARCHAR(150),
        assigned_chauffeur VARCHAR(150),
        chauffeur_phone VARCHAR(50),
        security_pass_instructions TEXT,
        nearest_hospital TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      );
    `);

    // 8. Arranged Meetings & Director Pitches
    await client.query(`
      CREATE TABLE IF NOT EXISTS manager_meetings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
        actor_id UUID REFERENCES actors(id) ON DELETE CASCADE,
        actor_name VARCHAR(150) NOT NULL,
        title VARCHAR(255) NOT NULL,
        with_whom VARCHAR(255) NOT NULL,
        company_or_studio VARCHAR(255),
        meeting_type VARCHAR(100) NOT NULL,
        date_time VARCHAR(100) NOT NULL,
        format VARCHAR(100) NOT NULL,
        location_or_link TEXT,
        prep_notes TEXT,
        status VARCHAR(50) DEFAULT 'Scheduled' NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      );
    `);

    // 9. Budgets & Expenses
    await client.query(`
      CREATE TABLE IF NOT EXISTS budgets (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
        project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        total_budget NUMERIC(15, 2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'USD' NOT NULL,
        approved_by UUID REFERENCES users(id),
        status VARCHAR(50) DEFAULT 'draft' NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS expenses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
        project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        department VARCHAR(100) NOT NULL,
        vendor_name VARCHAR(255) NOT NULL,
        amount NUMERIC(12, 2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'USD' NOT NULL,
        description TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'pending' NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      );
    `);

    // 10. Audit Logs
    await client.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        organization_id UUID,
        user_id UUID,
        actor_role VARCHAR(50),
        action VARCHAR(100) NOT NULL,
        resource_type VARCHAR(100) NOT NULL,
        resource_id VARCHAR(100),
        details JSONB DEFAULT '{}'::jsonb,
        ip_address VARCHAR(50),
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
      );
    `);

    await client.query("COMMIT;");
    return { success: true, message: "CINEMA OS database tables successfully initialized." };
  } catch (error) {
    await client.query("ROLLBACK;");
    throw error;
  } finally {
    client.release();
  }
}

