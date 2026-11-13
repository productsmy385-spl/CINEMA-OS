import { NextResponse } from "next/server";
import { initializeDatabase } from "@/lib/db/init-db";
import { isDbConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST() {
  if (!isDbConfigured) {
    return NextResponse.json(
      {
        success: false,
        error: "DATABASE_URL environment variable is not configured.",
      },
      { status: 503 }
    );
  }

  try {
    const res = await initializeDatabase();
    return NextResponse.json(res);
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Database migration failed.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST();
}

