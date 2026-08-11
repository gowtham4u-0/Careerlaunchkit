import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import CopyButton from "@/components/CopyButton";
import type { Roadmap, Strategy } from "@/lib/launchkit";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function LaunchkitPage({ params }: Props) {
  const { id } = await params;
  const num = Number(id);
  if (!Number.isFinite(num)) notFound();

  const [row] = await db.select().from(profiles).where(eq(profiles.id, num));
  if (!row) notFound();

  const roadmap = JSON.parse(row.roadmapJson) as Roadmap;
  const strategy = JSON.parse(row.strategyJson) as Strategy;

  const StepBadge = ({ n }: { n: string }) => (
    <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-600">
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white">{n}</span>
      Step {n}
    </span>
  );

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-extrabold tracking-tight">
            Career<span className="text-indigo-600">LaunchKit</span>
          </Link>
          <Link href="/" className="text-sm font-medium text-slate-500 hover:text-slate-800">
            ← Back
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{row.name}&apos;s LaunchKit</h1>
        <p className="mt-2 text-slate-600">
          {row.targetRoles} · {row.targetCities} · generated {new Date(row.createdAt).toLocaleString()}
        </p>
      </section>

      {/* STEP 1 — Resume */}
      <section className="mx-auto max-w-5xl px-6">
        <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <StepBadge n="1" />
            <h2 className="text-xl font-bold text-slate-900">ATS-Friendly Resume</h2>
            <div className="flex gap-2">
              <CopyButton text={row.resumeText} label="Copy" />
              <a
                href={`/api/launchkit/${row.id}/resume.txt`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
              >
                ↓ Download .txt
              </a>
            </div>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Zero graphics, columns or tables — fully ATS readable. Paste into Jobscan / Resumeworded to score it.
          </p>
          <pre className="mt-5 overflow-x-auto rounded-2xl bg-slate-900 p-6 text-sm leading-relaxed text-slate-100">
            {row.resumeText}
          </pre>
        </div>
      </section>

      {/* STEP 2 — Roadmap */}
      <section className="mx-auto max-w-5xl px-6 pt-10">
        <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <StepBadge n="2" />
          <h2 className="mt-2 text-xl font-bold text-slate-900">Skill Enhancement Roadmap</h2>

          <h3 className="mt-8 text-sm font-bold uppercase tracking-wider text-slate-500">Core skills to master</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {roadmap.coreSkills.map((s, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 p-5">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                    {i + 1}
                  </span>
                  <h4 className="font-semibold text-slate-900">{s.name}</h4>
                </div>
                <p className="mt-3 text-sm text-slate-600">{s.why}</p>
                <p className="mt-1 text-sm text-slate-600">{s.where}</p>
                <ul className="mt-3 space-y-1">
                  {s.resources.map((r, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-slate-500">
                      <span className="mt-0.5 text-emerald-500">▸</span> {r}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <h3 className="mt-8 text-sm font-bold uppercase tracking-wider text-slate-500">Essential tools to learn</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {roadmap.tools.map((t, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 p-4">
                <h4 className="font-semibold text-slate-900">{t.name}</h4>
                <p className="mt-1 text-sm text-slate-600">{t.purpose}</p>
              </div>
            ))}
          </div>

          <h3 className="mt-8 text-sm font-bold uppercase tracking-wider text-slate-500">Free certifications to add today</h3>
          <div className="mt-4 space-y-3">
            {roadmap.certifications.map((c, i) => (
              <div key={i} className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4">
                <div>
                  <p className="font-semibold text-slate-900">{c.name}</p>
                  <p className="text-sm text-slate-600">{c.provider}</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">{c.focus}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STEP 3 — Portfolio */}
      <section className="mx-auto max-w-5xl px-6 pt-10">
        <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <StepBadge n="3" />
          <h2 className="mt-2 text-xl font-bold text-slate-900">Portfolio Website</h2>
          <p className="mt-2 text-sm text-slate-500">
            A complete single-file <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">index.html</code> styled with Tailwind
            (CDN). Save it, push to GitHub, and enable GitHub Pages for a live link.
          </p>

          <div className="mt-5 flex gap-2">
            <CopyButton text={row.portfolioHtml} label="Copy HTML" />
            <a
              href={`/api/launchkit/${row.id}/portfolio.html`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
            >
              ↓ Download index.html
            </a>
          </div>

          <h3 className="mt-6 text-sm font-bold uppercase tracking-wider text-slate-500">Live preview</h3>
          <iframe
            title="Portfolio preview"
            srcDoc={row.portfolioHtml}
            className="mt-3 h-[480px] w-full rounded-2xl border border-slate-200 bg-white"
          />
        </div>
      </section>

      {/* STEP 4 — Strategy */}
      <section className="mx-auto max-w-5xl px-6 pt-10">
        <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <StepBadge n="4" />
          <h2 className="mt-2 text-xl font-bold text-slate-900">Job Search & Automation Strategy</h2>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <StrategyCard title="LinkedIn" color="text-sky-700 bg-sky-50" items={strategy.linkedin} />
            <StrategyCard title="Naukri.com" color="text-orange-700 bg-orange-50" items={strategy.naukri} />
            <StrategyCard title="Apna & JobShop" color="text-violet-700 bg-violet-50" items={strategy.apna} />
            <StrategyCard title="Direct Portals & Alerts" color="text-emerald-700 bg-emerald-50" items={strategy.alerts} />
          </div>

          <h3 className="mt-8 text-sm font-bold uppercase tracking-wider text-slate-500">Quick execution checklist</h3>
          <ul className="mt-3 space-y-2">
            {strategy.checklist.map((c, i) => (
              <li key={i} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                  {i + 1}
                </span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

function StrategyCard({
  title,
  items,
  color,
}: {
  title: string;
  items: string[];
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 p-5">
      <h4 className={`inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${color}`}>
        {title}
      </h4>
      <ul className="mt-4 space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
