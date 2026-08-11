import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

/**
 * Stores a saved career profile together with all four generated launchkit
 * outputs so users can revisit their resume, roadmap, portfolio, and strategy.
 */
export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),

  // Identity / contact
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  linkedin: text("linkedin").notNull().default(""),
  location: text("location").notNull(),
  targetCities: text("target_cities").notNull(),

  // Education
  degree: text("degree").notNull(),
  institution: text("institution").notNull().default(""),
  graduationYear: text("graduation_year").notNull(),

  // Targets
  targetRoles: text("target_roles").notNull(),

  // Skills / experience
  skills: text("skills").notNull(),
  projects: text("projects").notNull(),
  experience: text("experience").notNull().default(""),

  // Generated outputs
  resumeText: text("resume_text").notNull(),
  roadmapJson: text("roadmap_json").notNull(),
  portfolioHtml: text("portfolio_html").notNull(),
  strategyJson: text("strategy_json").notNull(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
