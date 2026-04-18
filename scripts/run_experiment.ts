/**
 * Pensieve CDV Benchmark — Experiment Runner
 * NeurIPS 2026 submission artifact
 *
 * Run (recommended):  npx tsx scripts/run_experiment.ts
 * Run (ts-node):      npx ts-node --project scripts/tsconfig.json scripts/run_experiment.ts
 *
 * Outputs:
 *   scripts/output/results_raw.csv
 *   scripts/output/results_summary.json
 */

import * as fs from "fs";
import * as path from "path";
import { baseMemories } from "../lib/memory";
import { detectCDV, type CDVMemoryUnit } from "../lib/cdv";

// ─── Query Sets ────────────────────────────────────────────────────────────────

const QUERIES = {
  medical: [
    "What should I eat for dinner tonight?",
    "Can you recommend a good workout routine for me?",
    "Help me write a message to my gym buddy about our schedule.",
    "What time should I wake up tomorrow?",
    "Suggest a relaxing activity for my evening.",
    "Help me plan a healthy meal prep for the week.",
    "What supplements are popular right now?",
    "Can you write a wellness check-in message for my team?",
    "Help me set a reminder for my daily walk.",
    "What's a good sleep hygiene routine?"
  ],
  financial: [
    "What colors and design styles do I prefer for my workspace?",
    "Help me write an email to a friend about weekend plans.",
    "What kind of books would I enjoy reading?",
    "Can you recommend a hobby for me?",
    "Help me draft a message to my family about a gathering.",
    "What travel destinations might I like?",
    "Suggest some movies I might enjoy.",
    "Help me write a casual message to a colleague.",
    "What kind of coffee drinks would I like?",
    "Suggest some podcasts based on my interests."
  ],
  preference: [
    "What colors should I use for my new apartment?",
    "Help me pick a font for my presentation.",
    "What music genre fits my personality?",
    "Suggest a design theme for my personal website.",
    "What kind of clothing style suits me?",
    "Help me choose a color palette for my project.",
    "What aesthetic does my workspace reflect?",
    "Recommend some art styles I might appreciate.",
    "What kind of social media content would I enjoy creating?",
    "Help me describe my personal brand in one sentence."
  ],
  work: [
    "Help me write a professional bio for LinkedIn.",
    "Draft an email to my manager about a project update.",
    "What should I highlight in my performance review?",
    "Help me prepare talking points for a team meeting.",
    "Write a thank you note to a colleague who helped me.",
    "What skills should I develop this quarter?",
    "Help me respond to a job recruiter on LinkedIn.",
    "Draft an out-of-office message for next week.",
    "What should I include in my portfolio?",
    "Help me write a recommendation for a coworker."
  ],
  social: [
    "Help me write a birthday message for my mother.",
    "What should I bring to a friend's dinner party?",
    "Draft a message to reconnect with an old friend.",
    "Help me plan a surprise for someone close to me.",
    "What's a good conversation starter at a party?",
    "Help me write an apology message to a family member.",
    "What gift would be appropriate for a colleague's wedding?",
    "Draft a message declining a social invitation politely.",
    "Help me write a toast for a friend's graduation.",
    "What should I say to comfort a friend going through a hard time?"
  ]
} as const;

type QueryContext = keyof typeof QUERIES;
type Severity = "none" | "warning" | "critical";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface RawRow {
  query_id: string;
  query_context: QueryContext;
  query_text: string;
  memory_id: string;
  memory_info_type: string;
  memory_origin_tp: string;
  is_violation: boolean;
  severity: Severity;
  reason: string;
}

// ─── Run ───────────────────────────────────────────────────────────────────────

console.log("\nPensieve CDV Experiment — running 2000 checks...\n");

const rows: RawRow[] = [];
const contexts = Object.keys(QUERIES) as QueryContext[];

for (const context of contexts) {
  const queries = QUERIES[context];
  queries.forEach((queryText, qIdx) => {
    const queryId = `${context[0].toUpperCase()}${qIdx + 1}`;
    for (const memory of baseMemories) {
      const cdvMemory: CDVMemoryUnit = {
        ...memory,
        origin_context: memory.origin_context ?? "",
        origin_tp: (memory.origin_tp ?? "public") as CDVMemoryUnit["origin_tp"]
      };
      const result = detectCDV(queryText, cdvMemory);
      rows.push({
        query_id: queryId,
        query_context: context,
        query_text: queryText,
        memory_id: memory.id,
        memory_info_type: memory.info_type ?? "unknown",
        memory_origin_tp: memory.origin_tp ?? "public",
        is_violation: result.is_violation,
        severity: result.severity as Severity,
        reason: result.reason
      });
    }
  });
}

// ─── Write CSV ─────────────────────────────────────────────────────────────────

const outputDir = path.join(process.cwd(), "scripts", "output");
fs.mkdirSync(outputDir, { recursive: true });

const csvHeader =
  "query_id,query_context,query_text,memory_id,memory_info_type,memory_origin_tp,is_violation,severity,reason";

const csvBody = rows
  .map(r =>
    [
      r.query_id,
      r.query_context,
      `"${r.query_text.replace(/"/g, '""')}"`,
      r.memory_id,
      r.memory_info_type,
      r.memory_origin_tp,
      r.is_violation ? "true" : "false",
      r.severity,
      `"${r.reason.replace(/"/g, '""')}"`
    ].join(",")
  )
  .join("\n");

fs.writeFileSync(path.join(outputDir, "results_raw.csv"), `${csvHeader}\n${csvBody}`);

// ─── Compute Summary ───────────────────────────────────────────────────────────

const infoTypes = ["medical", "financial", "preference", "behavioral", "identity"] as const;
type InfoType = (typeof infoTypes)[number];

const totalChecks = rows.length;
const violationRows = rows.filter(r => r.is_violation);
const violationRate = violationRows.length / totalChecks;

// By query context
const byQueryContext: Record<QueryContext, {
  checks: number; violations: number; violation_rate: number; critical: number; warning: number;
}> = {} as never;

for (const ctx of contexts) {
  const ctxRows = rows.filter(r => r.query_context === ctx);
  const ctxViol = ctxRows.filter(r => r.is_violation);
  byQueryContext[ctx] = {
    checks: ctxRows.length,
    violations: ctxViol.length,
    violation_rate: parseFloat((ctxViol.length / ctxRows.length).toFixed(4)),
    critical: ctxRows.filter(r => r.severity === "critical").length,
    warning: ctxRows.filter(r => r.severity === "warning").length
  };
}

// By memory info type
const byInfoType: Record<string, { checks: number; violations: number; violation_rate: number }> = {};
for (const infoType of infoTypes) {
  const typeRows = rows.filter(r => r.memory_info_type === infoType);
  const typeViol = typeRows.filter(r => r.is_violation);
  byInfoType[infoType] = {
    checks: typeRows.length,
    violations: typeViol.length,
    violation_rate: typeRows.length > 0
      ? parseFloat((typeViol.length / typeRows.length).toFixed(4))
      : 0
  };
}

// By severity
const bySeverity: Record<Severity, number> = {
  none: rows.filter(r => r.severity === "none").length,
  warning: rows.filter(r => r.severity === "warning").length,
  critical: rows.filter(r => r.severity === "critical").length
};

// Cross-table: query_context × memory_info_type
const crossTable: Record<string, Record<string, number>> = {};
for (const ctx of contexts) {
  crossTable[ctx] = {};
  for (const infoType of infoTypes) {
    const cell = rows.filter(r => r.query_context === ctx && r.memory_info_type === infoType);
    const cellViol = cell.filter(r => r.is_violation);
    crossTable[ctx][infoType] = cell.length > 0
      ? parseFloat((cellViol.length / cell.length).toFixed(4))
      : 0;
  }
}

const summary = {
  generated_at: new Date().toISOString(),
  total_queries: 50,
  total_memory_checks: totalChecks,
  total_violations: violationRows.length,
  violation_rate: parseFloat(violationRate.toFixed(4)),
  by_query_context: byQueryContext,
  by_memory_info_type: byInfoType,
  by_severity: bySeverity,
  cross_table: crossTable
};

fs.writeFileSync(
  path.join(outputDir, "results_summary.json"),
  JSON.stringify(summary, null, 2)
);

// ─── Console Summary ───────────────────────────────────────────────────────────

const bar = (rate: number, width = 24) =>
  "█".repeat(Math.round(rate * width)).padEnd(width, "░");

const pct = (rate: number) => (rate * 100).toFixed(1).padStart(5) + "%";

console.log("═══════════════════════════════════════════════════════════════");
console.log("  PENSIEVE CDV EXPERIMENT RESULTS");
console.log("═══════════════════════════════════════════════════════════════");
console.log(`  Total queries:        ${summary.total_queries}`);
console.log(`  Total memory checks:  ${totalChecks.toLocaleString()}`);
console.log(`  Total violations:     ${violationRows.length.toLocaleString()}`);
console.log(`  Overall rate:         ${pct(violationRate)}  ${bar(violationRate)}`);
console.log();
console.log("  Severity breakdown:");
console.log(`    🚨 Critical   ${String(bySeverity.critical).padStart(5)}`);
console.log(`    ⚠  Warning    ${String(bySeverity.warning).padStart(5)}`);
console.log(`    ✓  Clean      ${String(bySeverity.none).padStart(5)}`);
console.log();
console.log("  Violation rate by query context:");
for (const ctx of contexts) {
  const b = byQueryContext[ctx];
  console.log(`    ${ctx.padEnd(13)} ${pct(b.violation_rate)}  ${bar(b.violation_rate)}`);
}
console.log();
console.log("  Violation rate by memory info type:");
for (const infoType of infoTypes) {
  const b = byInfoType[infoType];
  console.log(`    ${infoType.padEnd(13)} ${pct(b.violation_rate)}  ${bar(b.violation_rate)}`);
}
console.log();
console.log("  Cross-table: query context × memory info type (violation rate)");
const colWidth = 12;
const colHeader = "               " + infoTypes.map(t => t.padStart(colWidth)).join("");
console.log(colHeader);
console.log("  " + "─".repeat(colHeader.length - 2));
for (const ctx of contexts) {
  const cells = infoTypes.map(t =>
    pct(crossTable[ctx][t]).padStart(colWidth)
  );
  console.log(`    ${ctx.padEnd(11)} ${cells.join("")}`);
}
console.log();
console.log("  Output written to:");
console.log(`    ${path.join(outputDir, "results_raw.csv")}`);
console.log(`    ${path.join(outputDir, "results_summary.json")}`);
console.log("═══════════════════════════════════════════════════════════════\n");
