import Link from "next/link";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { desc } from "drizzle-orm";
import LaunchForm from "@/components/LaunchForm";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const saved = await db
    .select({
      id: profiles.id,
      name: profiles.name,
      targetRoles: profiles.targetRoles,
      targetCities: profiles.targetCities,
      createdAt: profiles.createdAt,
    })
    .from(profiles)
    .orderBy(desc(profiles.createdAt))
    .limit(20);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Nav */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-extrabold tracking-tight">
            Career<span className="text-indigo-600">LaunchKit</span>
          </Link>
          <a
            href="#builder"
            className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Build my kit
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 py-16 text-center sm:py-24">
        <p className="mx-auto inline-block rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-600">
          ATS Resume · Skill Roadmap · Portfolio · Job Automation
        </p>
        <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-6xl">
          Your complete career launch kit,<br className="hidden sm:block" /> generated in seconds.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
          Enter your profile once and instantly get an ATS-friendly resume, a role-matched skill roadmap with free
          certifications, a copy-paste portfolio website, and an automated job-search strategy for Indian platforms.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm font-medium text-slate-700">
          {["ATS-scannable resume", "Tailwind portfolio HTML", "Free certifications", "LinkedIn & Naukri hacks"].map((t) => (
            <span key={t} className="rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
              ✓ {t}
            </span>
          ))}
        </div>
      </section>

      {/* Builder */}
      <section id="builder" className="mx-auto max-w-3xl px-6 pb-20">
        <div className="rounded-3xl bg-white p-6 shadow-[0_24px_60px_rgba(16,24,40,0.10)] sm:p-10">
          <h2 className="text-2xl font-bold text-slate-900">Your profile</h2>
          <p className="mb-8 mt-1 text-sm text-slate-500">
            Fill the fields below — your outputs are customized from these answers.
          </p>
          <LaunchForm />
        </div>
      </section>

      {/* History */}
      {saved.length > 0 && (
        <section className="mx-auto max-w-3xl px-6 pb-24">
          <h2 className="text-xl font-bold text-slate-900">Previously generated kits</h2>
          <ul className="mt-4 space-y-3">
            {saved.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/launchkit/${p.id}`}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition hover:border-indigo-300 hover:shadow"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{p.name}</p>
                    <p className="text-sm text-slate-500">{p.targetRoles} · {p.targetCities}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer className="border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-500">
        Career LaunchKit — resume, roadmap, portfolio & job automation, all in one place.
      </footer>
    </main>
  );
}
