/* ------------------------------------------------------------------ *
 *  Career LaunchKit Generator
 *  Deterministic content engine that turns a raw profile into the four
 *  structured deliverables: ATS resume, skill roadmap, portfolio site,
 *  and job-search automation strategy.
 * ------------------------------------------------------------------ */

export interface LaunchKitInput {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  location: string;
  targetCities: string;
  degree: string;
  institution: string;
  graduationYear: string;
  targetRoles: string;
  skills: string;
  projects: string;
  experience: string;
}

export interface CoreSkill {
  name: string;
  why: string;
  where: string;
  resources: string[];
}

export interface Tool {
  name: string;
  purpose: string;
}

export interface Certification {
  name: string;
  provider: string;
  focus: string;
}

export interface Roadmap {
  coreSkills: CoreSkill[];
  tools: Tool[];
  certifications: Certification[];
}

export interface Strategy {
  linkedin: string[];
  naukri: string[];
  apna: string[];
  alerts: string[];
  checklist: string[];
}

export interface LaunchKit {
  resumeText: string;
  roadmap: Roadmap;
  portfolioHtml: string;
  strategy: Strategy;
}

/* ----------------------------- helpers ---------------------------- */

const split = (value: string): string[] =>
  value
    .split(/[,;\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);

const titleCase = (s: string) =>
  s.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());

const ACTION_VERBS = [
  "Architected",
  "Optimized",
  "Spearheaded",
  "Automated",
  "Engineered",
  "Delivered",
  "Streamlined",
  "Launched",
  "Orchestrated",
  "Built",
];

/** Heuristic metric appended to a project bullet for ATS impact. */
function metricFor(index: number): string {
  const metrics = [
    "cutting processing time by 30%",
    "improving throughput by 25%",
    "reducing manual effort by 40%",
    "boosting engagement by 35%",
    "slashing turnaround by 28%",
    "lifting conversion by 22%",
  ];
  return metrics[index % metrics.length];
}

function renderResume(i: LaunchKitInput): string {
  const roles = split(i.targetRoles);
  const skills = split(i.skills);
  const projectLines = split(i.projects);
  const expLines = split(i.experience);

  const primaryRole = roles[0] ?? "Professional";
  const roleList = roles.join(", ");
  const cityPart = i.location ? `\n${i.location}` : "";
  const linkedinPart = i.linkedin ? ` | ${i.linkedin}` : "";

  const core = [
    ...skills,
    "Cross-Functional Collaboration",
    "Agile Project Delivery",
    "Data-Driven Decision Making",
    "Communication & Presentation",
  ]
    .slice(0, 14)
    .join(", ");

  const projectBlock =
    projectLines.length > 0
      ? `\nPROJECTS\n${projectLines
          .map((p, idx) => {
            const verb = ACTION_VERBS[idx % ACTION_VERBS.length];
            return `• ${titleCase(p)} — ${verb} a focused initiative from discovery to delivery, ${metricFor(idx)}. Instrumented measurable outcomes, documented results, and presented findings to stakeholders.`;
          })
          .join("\n")}`
      : "";

  const expBlock =
    expLines.length > 0
      ? `\nEXPERIENCE\n${expLines
          .map((e, idx) => {
            const verb = ACTION_VERBS[(idx + 3) % ACTION_VERBS.length];
            return `• ${titleCase(e)} — ${verb} day-to-day responsibilities while resolving ~20+ requests weekly and ${metricFor(idx + 2)}. Partnered with teams to align deliverables with business goals.`;
          })
          .join("\n")}`
      : "";

  const edu = `${i.degree}${i.institution ? `, ${i.institution}` : ""} | ${i.graduationYear}`;

  return [
    `${i.name.toUpperCase()}`,
    `${i.location || ""}${linkedinPart ? ` | ${i.email} | ${i.phone}${linkedinPart}` : ` | ${i.email} | ${i.phone}`}`,
    ``,
    `PROFESSIONAL SUMMARY`,
    `Motivated ${primaryRole.toLowerCase()} with hands-on experience across ${projectLines.length} projects and ${skills.length}+ core skills including ${skills.slice(0, 3).join(", ")}. Proven ability to ${roles.length > 1 ? `operate across ${roleList} roles` : `deliver for the ${primaryRole} role`} in ${i.targetCities || i.location || "high-growth"} environments. Adept at applying analytical thinking, modern tools, and strong communication to turn requirements into measurable, business-impacting outcomes.`,
    ``,
    `CORE COMPETENCIES`,
    core,
    ``,
    `PROJECTS & EXPERIENCE`,
    `• ${titleCase(primaryRole)} — Self-directed projects aligned with ${roleList}.`,
    ...projectBlock.split("\n").filter(Boolean),
    ...expBlock.split("\n").filter(Boolean),
    ``,
    `EDUCATION`,
    edu,
    ``,
    `CERTIFICATIONS`,
    `• Relevant online certifications — NPTEL / Coursera / Google Digital Garage (See portfolio roadmap for the full stack).`,
  ].join("\n");
}

/* ------------------------------ roadmap ---------------------------- */

const roleKeyword = (roles: string[]): string => {
  const joined = roles.join(" ").toLowerCase();
  if (/data|analytics|analysis/.test(joined)) return "Data & Analytics";
  if (/front|react|web|full-?stack/.test(joined)) return "Web / Full-Stack";
  if (/hr|human|recruit/.test(joined)) return "HR & Talent";
  if (/backend|node|api/.test(joined)) return "Backend Engineering";
  if (/product|design|ux/.test(joined)) return "Product & Design";
  return "Tech Professional";
};

function buildRoadmap(i: LaunchKitInput): Roadmap {
  const roles = split(i.targetRoles);
  const bucket = roleKeyword(roles);
  const base = ["SQL & Data Fundamentals", "Excel / Google Sheets", "Python (Pandas, NumPy)", "Power BI / Tableau", "Problem Solving & Communication"];

  const trackByBucket: Record<string, string[]> = {
    "Data & Analytics": [
      "SQL & Relational Databases",
      "Python for Data Analysis (Pandas, NumPy)",
      "Statistical Analysis & A/B Testing",
      "Data Visualization (Power BI / Tableau)",
      "Excel / Google Sheets (Advanced)",
    ],
    "Web / Full-Stack": [
      "JavaScript & TypeScript",
      "React / Next.js Frontend",
      "Node.js / REST APIs",
      "SQL & PostgreSQL",
      "Git, GitHub & CI/CD",
    ],
    "HR & Talent": [
      "ATS & Recruitment Pipelines",
      "HR Analytics & Metrics",
      "Labor Law & Compliance Basics",
      "Interviewing & Onboarding",
      "Excel / Google Sheets (Advanced)",
    ],
    "Backend Engineering": [
      "Node.js / Python Backend",
      "PostgreSQL & Database Design",
      "REST & GraphQL API Design",
      "Authentication & Security",
      "Docker & Cloud Basics",
    ],
    "Product & Design": [
      "UX Research & Wireframing (Figma)",
      "Prototyping & Design Systems",
      "HTML / CSS / Tailwind",
      "Product Metrics & Roadmaps",
      "User Testing & Iteration",
    ],
  };

  const skills = trackByBucket[bucket] ?? base;

  const coreSkills: CoreSkill[] = skills.map((name, idx) => ({
    name,
    why:
      idx === 0
        ? `Highest-leverage skill for your ${roles[0] ?? "target"} role. Master it first.`
        : `Rounds out the core stack employers screen for in ${bucket} roles.`,
    where:
      idx === 0
        ? "Apply in every project and list at the top of your resume core competencies."
        : "Demonstrate through a single deep project and mention in interviews.",
    resources: [
      idx % 2 === 0
        ? "FreeCodeCamp — free, project-based curriculum"
        : "Kaggle Learn — free micro-courses with datasets",
      "NPTEL — free university-level courses with certificate",
      "Coursera Financial Aid — full courses at no cost",
    ],
  }));

  return {
    coreSkills,
    tools: [
      { name: "Git & GitHub", purpose: "Version control, portfolio hosting (GitHub Pages), and proof of real projects." },
      { name: "LinkedIn", purpose: "Primary recruiter channel; optimize headline, keywords, and activity." },
      { name: "Notion / Google Workspace", purpose: "Track applications, projects, and daily job-search progress." },
    ],
    certifications: [
      { name: "Google Digital Garage — Fundamentals of Digital Marketing", provider: "Google", focus: "Free, widely recognized, easy to finish in a weekend." },
      { name: "SQL for Data Science (or role-matched course)", provider: "Coursera / NPTEL", focus: "Free via Financial Aid; directly maps to your target role." },
      { name: "Technical Interview / Product basics course", provider: "NPTEL / PwC Forage", focus: "Free; add a verified badge to your resume today." },
    ],
  };
}

/* --------------------------- portfolio site ------------------------ */

function buildPortfolio(i: LaunchKitInput): string {
  const name = titleCase(i.name);
  const roles = split(i.targetRoles);
  const role = roles[0] ?? "Professional";
  const skills = split(i.skills);
  const projects = split(i.projects);
  const city = i.location || i.targetCities || "your city";

  const skillChips = skills.map(
    (s, idx) =>
      `<div class="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
        <span class="font-medium text-slate-700">${s}</span>
        <span class="ml-3 h-2 w-20 overflow-hidden rounded-full bg-slate-200"><span class="block h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" style="width:${70 + ((idx * 7) % 28)}%"></span></span>
      </div>`
  ).join("\n      ");

  const projectCards = projects
    .map(
      (p, idx) => `<div class="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
        <div class="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-lg font-bold text-white">${String(idx + 1).padStart(2, "0")}</div>
        <h3 class="text-lg font-semibold text-slate-900">${titleCase(p)}</h3>
        <p class="mt-2 text-sm text-slate-600">Designed and shipped end-to-end. <a href="#" class="font-medium text-indigo-600 hover:underline">Live demo</a> · <a href="https://github.com" class="font-medium text-indigo-600 hover:underline">Source</a></p>
        <div class="mt-4 flex flex-wrap gap-2">${skills.slice(idx * 2, idx * 2 + 3).map((s) => `<span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">${s}</span>`).join("")}</div>
      </div>`
    )
    .join("\n        ");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${name} · ${role}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 font-sans text-slate-900 antialiased">
  <header class="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
    <nav class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
      <a href="#" class="text-lg font-bold tracking-tight">${name.split(" ")[0]}<span class="text-indigo-600">.</span></a>
      <div class="hidden gap-8 text-sm font-medium text-slate-600 sm:flex">
        <a href="#about" class="hover:text-indigo-600">About</a>
        <a href="#skills" class="hover:text-indigo-600">Skills</a>
        <a href="#projects" class="hover:text-indigo-600">Projects</a>
        <a href="#contact" class="hover:text-indigo-600">Contact</a>
      </div>
      <a href="#contact" class="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Hire me</a>
    </nav>
  </header>

  <section class="mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 md:grid-cols-2">
    <div>
      <p class="text-sm font-semibold uppercase tracking-widest text-indigo-600">Hello, I&apos;m</p>
      <h1 class="mt-3 text-5xl font-extrabold leading-tight tracking-tight">${name}</h1>
      <p class="mt-2 text-2xl font-medium text-slate-700">${role} <span class="text-indigo-600">based in ${city}</span></p>
      <p class="mt-5 max-w-md text-slate-600">I turn real problems into measurable outcomes using ${skills.slice(0, 3).join(", ")}. Open to opportunities across ${i.targetCities || city}.</p>
      <div class="mt-8 flex flex-wrap gap-3">
        <a href="#projects" class="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow hover:bg-indigo-700">View my work</a>
        <a href="mailto:${i.email}" class="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 hover:border-indigo-400">${i.email}</a>
      </div>
    </div>
    <div class="relative mx-auto flex h-72 w-72 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 p-2 shadow-2xl">
      <div class="flex h-full w-full items-center justify-center rounded-full bg-slate-50 text-7xl">👨‍💻</div>
    </div>
  </section>

  <section id="about" class="border-y border-slate-200 bg-white py-20">
    <div class="mx-auto max-w-3xl px-6 text-center">
      <h2 class="text-3xl font-bold">About me</h2>
      <p class="mt-4 text-lg text-slate-600">I&apos;m ${name}, a ${role.toLowerCase()} focused on shipping work that matters. I combine ${skills.slice(0, 2).join(", ")} with strong communication and a bias for action. Recently I have been sharpening my skills through hands-on projects and role-matched certifications.</p>
      <p class="mt-4 text-slate-600">Education: ${i.degree}${i.institution ? ` · ${i.institution}` : ""} (${i.graduationYear}).</p>
    </div>
  </section>

  <section id="skills" class="mx-auto max-w-6xl px-6 py-20">
    <h2 class="text-3xl font-bold">Skills matrix</h2>
    <p class="mt-2 text-slate-600">Core competencies across my target roles.</p>
    <div class="mt-8 grid gap-4 sm:grid-cols-2">
      ${skillChips}
    </div>
  </section>

  <section id="projects" class="border-y border-slate-200 bg-slate-100 py-20">
    <div class="mx-auto max-w-6xl px-6">
      <h2 class="text-3xl font-bold">Featured projects</h2>
      <p class="mt-2 text-slate-600">Live demos + source code on GitHub.</p>
      <div class="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        ${projectCards}
      </div>
    </div>
  </section>

  <section id="contact" class="mx-auto max-w-xl px-6 py-20">
    <h2 class="text-center text-3xl font-bold">Let&apos;s work together</h2>
    <p class="mt-2 text-center text-slate-600">I usually reply within 24 hours.</p>
    <form class="mt-8 space-y-4" onsubmit="event.preventDefault();alert('Message sent!');">
      <input required placeholder="Your name" class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-indigo-500" />
      <input required type="email" placeholder="Your email" class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-indigo-500" />
      <textarea required rows="4" placeholder="Your message" class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-indigo-500"></textarea>
      <button class="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700">Send message</button>
    </form>
    <p class="mt-8 text-center text-sm text-slate-500">${name} · ${city} · ${i.email} · ${i.phone}</p>
  </section>

  <footer class="border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-500">
    © ${new Date().getFullYear()} ${name}. Built with care · Hosted free on GitHub Pages / Vercel / Netlify.
  </footer>
</body>
</html>`;
}

/* ---------------------------- strategy ----------------------------- */

function buildStrategy(i: LaunchKitInput): Strategy {
  const cities = i.targetCities.split(/[,\/]/).map((s) => s.trim()).filter(Boolean);
  const c1 = cities[0] ?? "your city";
  const c2 = cities[1] ?? c1;
  const role = split(i.targetRoles)[0] ?? "target role";
  const site = i.linkedin ? i.linkedin.replace(/^https?:\/\//, "") : "your LinkedIn profile";

  return {
    linkedin: [
      `Make your headline keyword-dense: "${role} | ${split(i.skills).slice(0, 2).join(" · ")} | Open to ${c1} & ${c2}".`,
      `Turn on "#OpenToWork" with the recruiter-only setting so it does not clutter your photo badge.`,
      `Set your location + "Remote" as listed, and make searchability "All LinkedIn Members" so recruiters outside your network can find you.`,
      `Run a saved-search with this Boolean string and enable daily email alerts:\n   ("${role}" OR "${split(i.targetRoles)[1] ?? role}") AND ("${c1}" OR "${c2}" OR Remote) AND (entrylevel OR fresher OR "0-2 years")`,
      `Follow 20+ hiring managers / talent teams at companies you target and engage on 2 posts per day to boost algorithmic visibility.`,
    ],
    naukri: [
      `Write a keyword-dense headline, e.g., "${role} | ${split(i.skills).slice(0, 3).join(", ")} | Immediate Joiner | ${c1}".`,
      `Refresh your resume daily: edit a single word and re-save. Naukri ranks "recently updated" profiles higher.`,
      `Set your profile to "Recruiters can view my resume" and add all 3 cities + remote to maximise visibility.`,
      `Use saved-search alerts for your exact job title in ${c1} / ${c2} and apply within 2 hours of each alert — early applicants convert best.`,
    ],
    apna: [
      `Use Apna & JobShop to target local/${c1} and ${c2} openings with instant one-tap applications.`,
      `Write your title exactly as jobs are posted ("${role} - ${c1}") so city filters match you.`,
      `Keep a short, self-video introduction (30s) and upload your ATS resume + portfolio link.`,
      `Check JobShop daily for part-time/gig and fresher "walk-in" drives near ${c1}.`,
    ],
    alerts: [
      `Google Job Alerts (google.com/alerts): alert on  "hiring ${role} ${c1} freshers" and "${role} internships ${c2}" → delivered to inbox daily.`,
      `Set up Google Alerts for official career-portal postings: "site:careers.tcs.com ${role} OR careers.accenture.com ${role}".`,
      `For RSS-driven feeds, use Google Alerts → "Deliver to RSS feed" and add the feed to an RSS reader (Feedly) for push notifications.`,
      `Bookmark official portals (TCS, Infosys, Zoho, Accenture, local startups) and check "Careers" pages each Sunday; many post exclusively there.`,
    ],
    checklist: [
      `Paste your final resume into Jobscan or Resumeworded and score it against your target job description; revise until ≥80%.`,
      `Save your generated portfolio HTML as index.html, push it to a GitHub repo, and enable GitHub Pages for a live ${c1} portfolio link.`,
      `Update a single word in your headline / profile every day on Naukri & LinkedIn to stay at the top of "recently updated" ranking.`,
      `Apply to at least 5 roles per weekday using saved alerts; track every application in a Notion/Google sheet.`,
    ],
  };
}

/* ------------------------------ driver ----------------------------- */

export function buildLaunchKit(input: LaunchKitInput): LaunchKit {
  return {
    resumeText: renderResume(input),
    roadmap: buildRoadmap(input),
    portfolioHtml: buildPortfolio(input),
    strategy: buildStrategy(input),
  };
}

export const helpers = { split, titleCase };
