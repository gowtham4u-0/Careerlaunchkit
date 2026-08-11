import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const num = Number(id);
  if (!Number.isFinite(num)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  const [row] = await db.select().from(profiles).where(eq(profiles.id, num));
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    linkedin: row.linkedin,
    location: row.location,
    targetCities: row.targetCities,
    degree: row.degree,
    institution: row.institution,
    graduationYear: row.graduationYear,
    targetRoles: row.targetRoles,
    skills: row.skills,
    projects: row.projects,
    experience: row.experience,
    resumeText: row.resumeText,
    roadmap: JSON.parse(row.roadmapJson),
    portfolioHtml: row.portfolioHtml,
    strategy: JSON.parse(row.strategyJson),
    createdAt: row.createdAt,
  });
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const num = Number(id);
  if (!Number.isFinite(num)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  await db.delete(profiles).where(eq(profiles.id, num));
  return NextResponse.json({ ok: true });
}
