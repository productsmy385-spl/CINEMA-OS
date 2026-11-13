import { NextResponse } from "next/server";
import { pool, isDbConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const startedAt = Date.now();
  let dbStatus = "unconfigured";
  let dbLatencyMs: number | null = null;
  let dbVersion: string | null = null;

  if (isDbConfigured && pool) {
    try {
      const dbStart = Date.now();
      const result = await pool.query("SELECT version() as version;");
      dbLatencyMs = Date.now() - dbStart;
      dbStatus = "connected";
      dbVersion = result.rows[0]?.version?.split(" ")?.slice(0, 2)?.join(" ") || "PostgreSQL";
    } catch (err: any) {
      dbStatus = `error: ${err.message || "Failed to query database"}`;
    }
  }

  return NextResponse.json({
    status: "ok",
    app: "CINEMA OS — Enterprise Film Industry Management SaaS",
    version: "1.0.0",
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    latencyMs: Date.now() - startedAt,
    database: {
      configured: isDbConfigured,
      status: dbStatus,
      dialect: "PostgreSQL",
      latencyMs: dbLatencyMs,
      version: dbVersion,
    },
    authorizedConsoles: [
      { id: "manager", title: "Talent Manager Console", defaultUser: "Evelyn Reed (Apex Talent Agency)" },
      { id: "producer", title: "Executive Producer Console", defaultUser: "Marcus Vance (Vance Global Pictures)" },
      { id: "actor", title: "SAG-AFTRA Actor Portal", defaultUser: "Marcus Sterling (Principal)" },
    ],
  });
}
