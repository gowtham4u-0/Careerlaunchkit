"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const FIELDS: { key: string; label: string; placeholder: string; hint?: string }[] = [
  { key: "name", label: "Full name", placeholder: "e.g. Priya Sharma", hint: "Appears on your resume & portfolio." },
  { key: "email", label: "Email", placeholder: "you@example.com" },
  { key: "phone", label: "Phone", placeholder: "+91 98765 43210" },
  { key: "linkedin", label: "LinkedIn URL (optional)", placeholder: "https://linkedin.com/in/you" },
  { key: "location", label: "Current location", placeholder: "e.g. Chennai" },
  { key: "targetCities", label: "Target cities / mode", placeholder: "Chennai, Bangalore, Hybrid, Remote", hint: "Comma separated." },
  { key: "degree", label: "Degree", placeholder: "e.g. B.Tech Computer Science" },
  { key: "institution", label: "Institution (optional)", placeholder: "e.g. Anna University" },
  { key: "graduationYear", label: "Graduation year", placeholder: "e.g. 2026" },
  { key: "targetRoles", label: "Target job roles", placeholder: "Data Analyst, Full-Stack Developer, HR Specialist", hint: "Comma separated — first role shapes your summary." },
  { key: "skills", label: "Top skills (3–8)", placeholder: "SQL, Python, React, Communication", hint: "Comma separated." },
];

export default function LaunchForm() {
  const router = useRouter();
  const [form, setForm] = useState<Record<string, string>>({
    name: "", email: "", phone: "", linkedin: "", location: "", targetCities: "",
    degree: "", institution: "", graduationYear: "", targetRoles: "", skills: "",
  });
  const [projects, setProjects] = useState("");
  const [experience, setExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/launchkit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, projects, experience }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      router.push(`/launchkit/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to build your launchkit");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        {FIELDS.map((f) => (
          <label key={f.key} className="block text-sm">
            <span className="font-medium text-slate-700">
              {f.label}
              {!["linkedin", "institution"].includes(f.key) && <span className="text-rose-500"> *</span>}
            </span>
            <input
              value={form[f.key] ?? ""}
              onChange={(e) => set(f.key, e.target.value)}
              placeholder={f.placeholder}
              className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
            {f.hint && <span className="mt-1 block text-xs text-slate-400">{f.hint}</span>}
          </label>
        ))}
      </div>

      <label className="block text-sm">
        <span className="font-medium text-slate-700">Key projects <span className="text-rose-500">*</span></span>
        <textarea
          value={projects}
          onChange={(e) => setProjects(e.target.value)}
          rows={3}
          placeholder={"e.g. Sales Dashboard, E-commerce API, Attendance Tracker\n(one per line or comma separated)"}
          className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
        <span className="mt-1 block text-xs text-slate-400">Each becomes a bullet with a strong action verb + metric.</span>
      </label>

      <label className="block text-sm">
        <span className="font-medium text-slate-700">Experience / internships (optional)</span>
        <textarea
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          rows={2}
          placeholder="e.g. Data Analyst Intern, ABC Ltd"
          className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </label>

      {error && (
        <p className="rounded-lg bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:opacity-95 disabled:opacity-60"
      >
        {loading ? "Building your launchkit…" : "Generate my Career LaunchKit →"}
      </button>
    </form>
  );
}
