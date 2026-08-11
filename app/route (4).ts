import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { desc } from "drizzle-orm";
import { buildLaunchKit } from "@/lib/launchkit";
import { LaunchKitInput } from "@/lib/launchkit";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as LaunchKitInput;
    const required = [
      "name",
      "email",
      "phone",
      "location",
      "targetCities",
      "degree",
      "graduationYear",
      "targetRoles",
      "skills",
      "projects",
    ];
    for (const field of required) {
      if (!body[field as keyof LaunchKitInput]?.trim()) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const kit = buildLaunchKit(body);

    const [row] = await db
      .insert(profiles)
      .values({
        name: body.name,
        email: body.email,
        phone: body.phone,
        linkedin: body.linkedin ?? "",
        location: body.location,
        targetCities: body.targetCities,
        degree: body.degree,
        institution: body.institution ?? "",
        graduationYear: body.graduationYear,
        targetRoles: body.targetRoles,
        skills: body.skills,
        projects: body.projects,
        experience: body.experience ?? "",
        resumeText: kit.resumeText,
        roadmapJson: JSON.stringify(kit.roadmap),
        portfolioHtml: kit.portfolioHtml,
        strategyJson: JSON.stringify(kit.strategy),
      })
      .returning({ id: profiles.id });

    return NextResponse.json({ id: row.id }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to build launchkit" }, { status: 500 });
  }
}

export async function GET() {
  const rows = await db
    .select({
      id: profiles.id,
      name: profiles.name,
      targetRoles: profiles.targetRoles,
      targetCities: profiles.targetCities,
      createdAt: profiles.createdAt,
    })
    .from(profiles)
    .orderBy(desc(profiles.createdAt));

  return NextResponse.json({ profiles: rows });
}
