import { detectCDV, type CDVMemoryUnit } from "@/lib/cdv";

export type RiskLevel = "low" | "medium" | "high";
export type MemoryStatus = "active" | "softened" | "forgotten";

export type MemoryUnit = {
  id: string;
  content: string;
  keywords: string[];
  created_at: string;
  last_activated: string;
  activation_count: number;
  relevance_score: number;
  risk_level: RiskLevel;
  status: MemoryStatus;
  info_type?: "medical" | "financial" | "preference" | "behavioral" | "identity";
  origin_context?: string;
  origin_tp?: "public" | "consent-required" | "reciprocity" | "confidentiality";
};

export type MemoryModifier = {
  pinned: boolean;
  status: MemoryStatus;
};

export type MemoryModifierMap = Record<string, MemoryModifier>;

export type ScoredMemory = MemoryUnit & {
  pinned: boolean;
  cdv?: {
    is_violation: boolean;
    severity: "none" | "warning" | "critical";
    reason: string;
  } | null;
};

export type HeatmapCell = {
  token: string;
  memoryId: string;
  score: number;
};

export type ActivationResult = {
  query: string;
  response: string;
  tokens: string[];
  memories: ScoredMemory[];
  reasons: Record<string, string>;
  heatmap: HeatmapCell[];
  hiddenMemoryIds: string[];
};

const relativeNow = "2026-04-11T10:30:00.000Z";

export const baseMemories: readonly MemoryUnit[] = Object.freeze([
  {
    id: "memory-1",
    content: "The user prefers concise breakdowns with strong visual structure.",
    keywords: ["concise", "breakdowns", "visual", "structure", "clear"],
    created_at: "2026-01-08T09:00:00.000Z",
    last_activated: "2026-04-08T13:20:00.000Z",
    activation_count: 14,
    relevance_score: 0.82,
    risk_level: "low",
    status: "active",
    info_type: "preference",
    origin_context: "preference chat",
    origin_tp: "public"
  },
  {
    id: "memory-2",
    content: "The user is building an AI product centered on memory transparency and trust.",
    keywords: ["ai", "memory", "transparency", "trust", "product"],
    created_at: "2026-02-03T18:10:00.000Z",
    last_activated: "2026-04-07T16:45:00.000Z",
    activation_count: 11,
    relevance_score: 0.76,
    risk_level: "medium",
    status: "active",
    info_type: "behavioral",
    origin_context: "work discussion",
    origin_tp: "consent-required"
  },
  {
    id: "memory-3",
    content: "The user favors dark interfaces with calm, research-oriented aesthetics.",
    keywords: ["dark", "interface", "calm", "research", "minimal"],
    created_at: "2026-02-19T11:30:00.000Z",
    last_activated: "2026-04-05T08:00:00.000Z",
    activation_count: 9,
    relevance_score: 0.63,
    risk_level: "low",
    status: "active",
    info_type: "preference",
    origin_context: "preference chat",
    origin_tp: "public"
  },
  {
    id: "memory-4",
    content: "The user has explored sensitive profile inferences before, so privacy framing matters.",
    keywords: ["sensitive", "privacy", "profile", "risk", "inferences"],
    created_at: "2026-03-14T14:05:00.000Z",
    last_activated: "2026-03-29T10:25:00.000Z",
    activation_count: 4,
    relevance_score: 0.48,
    risk_level: "high",
    status: "active",
    info_type: "medical",
    origin_context: "health discussion",
    origin_tp: "confidentiality"
  },
  {
    id: "memory-5",
    content: "The user often asks for modular architecture that can grow beyond the MVP.",
    keywords: ["modular", "architecture", "mvp", "extensible", "clean"],
    created_at: "2026-03-28T20:15:00.000Z",
    last_activated: "2026-04-09T19:40:00.000Z",
    activation_count: 7,
    relevance_score: 0.71,
    risk_level: "medium",
    status: "active",
    info_type: "behavioral",
    origin_context: "work discussion",
    origin_tp: "consent-required"
  },

  // — Medical (memory-6 through memory-12) —
  {
    id: "memory-6",
    content: "The user has been managing Type 2 diabetes for three years and tracks blood glucose daily.",
    keywords: ["diabetes", "glucose", "insulin", "blood", "health"],
    created_at: "2025-06-12T08:00:00.000Z",
    last_activated: "2026-03-18T11:00:00.000Z",
    activation_count: 3,
    relevance_score: 0.44,
    risk_level: "high",
    status: "active",
    info_type: "medical",
    origin_context: "health discussion",
    origin_tp: "confidentiality"
  },
  {
    id: "memory-7",
    content: "The user takes sertraline 50mg daily for an anxiety disorder, prescribed 18 months ago.",
    keywords: ["sertraline", "anxiety", "medication", "mental health", "prescription"],
    created_at: "2025-07-03T14:30:00.000Z",
    last_activated: "2026-02-27T09:15:00.000Z",
    activation_count: 2,
    relevance_score: 0.38,
    risk_level: "high",
    status: "active",
    info_type: "medical",
    origin_context: "mental health check-in",
    origin_tp: "confidentiality"
  },
  {
    id: "memory-8",
    content: "The user has a biopsy-confirmed gluten intolerance and strictly avoids all wheat products.",
    keywords: ["gluten", "intolerance", "diet", "wheat", "celiac"],
    created_at: "2025-08-19T10:45:00.000Z",
    last_activated: "2026-01-14T17:30:00.000Z",
    activation_count: 5,
    relevance_score: 0.51,
    risk_level: "medium",
    status: "active",
    info_type: "medical",
    origin_context: "dietary preference discussion",
    origin_tp: "confidentiality"
  },
  {
    id: "memory-9",
    content: "The user experiences chronic lower back pain from a 2023 workplace injury and attends physiotherapy.",
    keywords: ["back pain", "chronic", "injury", "physiotherapy", "pain"],
    created_at: "2025-09-05T16:00:00.000Z",
    last_activated: "2026-03-01T10:00:00.000Z",
    activation_count: 4,
    relevance_score: 0.42,
    risk_level: "high",
    status: "active",
    info_type: "medical",
    origin_context: "health discussion",
    origin_tp: "confidentiality"
  },
  {
    id: "memory-10",
    content: "The user's father has early-onset Alzheimer's; the user is anxious about hereditary risk.",
    keywords: ["alzheimer", "hereditary", "family", "cognitive", "risk"],
    created_at: "2025-10-22T11:20:00.000Z",
    last_activated: "2026-02-10T14:45:00.000Z",
    activation_count: 2,
    relevance_score: 0.35,
    risk_level: "high",
    status: "active",
    info_type: "medical",
    origin_context: "personal health concern",
    origin_tp: "confidentiality"
  },
  {
    id: "memory-11",
    content: "The user struggles with chronic insomnia, averaging under five hours of sleep without medication.",
    keywords: ["insomnia", "sleep", "fatigue", "rest", "medication"],
    created_at: "2025-11-08T22:00:00.000Z",
    last_activated: "2026-04-02T08:30:00.000Z",
    activation_count: 6,
    relevance_score: 0.55,
    risk_level: "medium",
    status: "active",
    info_type: "medical",
    origin_context: "health discussion",
    origin_tp: "confidentiality"
  },
  {
    id: "memory-12",
    content: "The user has a documented penicillin allergy and carries an epinephrine auto-injector.",
    keywords: ["allergy", "penicillin", "epipen", "anaphylaxis", "medication"],
    created_at: "2025-12-01T09:00:00.000Z",
    last_activated: "2026-01-20T12:00:00.000Z",
    activation_count: 1,
    relevance_score: 0.31,
    risk_level: "high",
    status: "active",
    info_type: "medical",
    origin_context: "emergency contact setup",
    origin_tp: "confidentiality"
  },

  // — Financial (memory-13 through memory-19) —
  {
    id: "memory-13",
    content: "The user earns approximately $95,000 per year as a senior software engineer.",
    keywords: ["salary", "income", "engineer", "compensation", "earnings"],
    created_at: "2025-07-15T10:00:00.000Z",
    last_activated: "2026-03-25T15:30:00.000Z",
    activation_count: 3,
    relevance_score: 0.47,
    risk_level: "medium",
    status: "active",
    info_type: "financial",
    origin_context: "career and compensation discussion",
    origin_tp: "consent-required"
  },
  {
    id: "memory-14",
    content: "The user carries $34,000 in outstanding student loan debt with a $450 monthly payment.",
    keywords: ["student loan", "debt", "payment", "financial", "burden"],
    created_at: "2025-08-03T14:00:00.000Z",
    last_activated: "2026-02-18T11:00:00.000Z",
    activation_count: 2,
    relevance_score: 0.39,
    risk_level: "medium",
    status: "active",
    info_type: "financial",
    origin_context: "financial planning session",
    origin_tp: "consent-required"
  },
  {
    id: "memory-15",
    content: "The user invests 15% of income in index funds and holds a three-month emergency reserve.",
    keywords: ["investment", "index funds", "savings", "emergency fund", "portfolio"],
    created_at: "2025-09-11T09:30:00.000Z",
    last_activated: "2026-03-30T16:00:00.000Z",
    activation_count: 5,
    relevance_score: 0.58,
    risk_level: "medium",
    status: "active",
    info_type: "financial",
    origin_context: "financial planning session",
    origin_tp: "consent-required"
  },
  {
    id: "memory-16",
    content: "The user has $8,500 in revolving credit card debt and has missed two minimum payments.",
    keywords: ["credit card", "debt", "payment", "interest", "overdue"],
    created_at: "2025-10-30T18:00:00.000Z",
    last_activated: "2026-03-05T10:15:00.000Z",
    activation_count: 2,
    relevance_score: 0.36,
    risk_level: "high",
    status: "active",
    info_type: "financial",
    origin_context: "financial stress discussion",
    origin_tp: "consent-required"
  },
  {
    id: "memory-17",
    content: "The user is saving toward a $60,000 house down payment over the next three years.",
    keywords: ["house", "savings", "down payment", "real estate", "goal"],
    created_at: "2025-11-14T11:00:00.000Z",
    last_activated: "2026-04-01T09:00:00.000Z",
    activation_count: 4,
    relevance_score: 0.52,
    risk_level: "medium",
    status: "active",
    info_type: "financial",
    origin_context: "financial goal setting",
    origin_tp: "consent-required"
  },
  {
    id: "memory-18",
    content: "The user consulted a financial advisor about early retirement at age 50, targeting a lean FIRE strategy.",
    keywords: ["retirement", "FIRE", "advisor", "early retirement", "planning"],
    created_at: "2025-12-20T15:00:00.000Z",
    last_activated: "2026-02-28T14:30:00.000Z",
    activation_count: 3,
    relevance_score: 0.45,
    risk_level: "medium",
    status: "active",
    info_type: "financial",
    origin_context: "retirement planning discussion",
    origin_tp: "consent-required"
  },
  {
    id: "memory-19",
    content: "The user is concerned that company equity will not vest before a potential layoff round.",
    keywords: ["equity", "vesting", "layoff", "stock", "job security"],
    created_at: "2026-01-18T09:45:00.000Z",
    last_activated: "2026-03-22T11:00:00.000Z",
    activation_count: 3,
    relevance_score: 0.41,
    risk_level: "high",
    status: "active",
    info_type: "financial",
    origin_context: "job security concern",
    origin_tp: "consent-required"
  },

  // — Identity (memory-20 through memory-24) —
  {
    id: "memory-20",
    content: "The user identifies as politically progressive and cares deeply about climate and equity policy.",
    keywords: ["politics", "progressive", "climate", "equity", "policy"],
    created_at: "2025-07-29T12:00:00.000Z",
    last_activated: "2026-03-10T10:30:00.000Z",
    activation_count: 4,
    relevance_score: 0.46,
    risk_level: "high",
    status: "active",
    info_type: "identity",
    origin_context: "political discussion",
    origin_tp: "confidentiality"
  },
  {
    id: "memory-21",
    content: "The user practices Buddhism and meditates daily; spirituality is central to their decision-making.",
    keywords: ["buddhism", "meditation", "spirituality", "mindfulness", "religion"],
    created_at: "2025-09-17T08:00:00.000Z",
    last_activated: "2026-04-03T07:30:00.000Z",
    activation_count: 6,
    relevance_score: 0.54,
    risk_level: "medium",
    status: "active",
    info_type: "identity",
    origin_context: "personal values discussion",
    origin_tp: "confidentiality"
  },
  {
    id: "memory-22",
    content: "The user recently went through a divorce and is navigating co-parenting a seven-year-old child.",
    keywords: ["divorce", "co-parenting", "child", "family", "separation"],
    created_at: "2025-11-02T17:00:00.000Z",
    last_activated: "2026-03-14T09:00:00.000Z",
    activation_count: 3,
    relevance_score: 0.43,
    risk_level: "high",
    status: "active",
    info_type: "identity",
    origin_context: "personal life discussion",
    origin_tp: "confidentiality"
  },
  {
    id: "memory-23",
    content: "The user identifies as bisexual and is selective about disclosure in professional settings.",
    keywords: ["bisexual", "identity", "disclosure", "workplace", "privacy"],
    created_at: "2025-12-10T20:00:00.000Z",
    last_activated: "2026-02-05T18:00:00.000Z",
    activation_count: 2,
    relevance_score: 0.33,
    risk_level: "high",
    status: "active",
    info_type: "identity",
    origin_context: "personal identity discussion",
    origin_tp: "confidentiality"
  },
  {
    id: "memory-24",
    content: "The user holds dual citizenship and navigates cultural identity between East Asian heritage and a Western upbringing.",
    keywords: ["citizenship", "cultural identity", "heritage", "east asian", "bicultural"],
    created_at: "2026-01-05T11:00:00.000Z",
    last_activated: "2026-03-07T14:00:00.000Z",
    activation_count: 3,
    relevance_score: 0.40,
    risk_level: "medium",
    status: "active",
    info_type: "identity",
    origin_context: "cultural background discussion",
    origin_tp: "confidentiality"
  },

  // — Behavioral (memory-25 through memory-33) —
  {
    id: "memory-25",
    content: "The user works best in 90-minute deep work blocks and uses a Pomodoro variant for focus.",
    keywords: ["deep work", "focus", "pomodoro", "productivity", "blocks"],
    created_at: "2025-08-25T10:00:00.000Z",
    last_activated: "2026-04-07T09:00:00.000Z",
    activation_count: 12,
    relevance_score: 0.74,
    risk_level: "low",
    status: "active",
    info_type: "behavioral",
    origin_context: "productivity discussion",
    origin_tp: "reciprocity"
  },
  {
    id: "memory-26",
    content: "The user relies heavily on Obsidian for knowledge management and maintains a complex second-brain.",
    keywords: ["obsidian", "notes", "knowledge management", "second brain", "PKM"],
    created_at: "2025-09-30T14:00:00.000Z",
    last_activated: "2026-04-08T10:30:00.000Z",
    activation_count: 10,
    relevance_score: 0.69,
    risk_level: "low",
    status: "active",
    info_type: "behavioral",
    origin_context: "tools and workflow discussion",
    origin_tp: "reciprocity"
  },
  {
    id: "memory-27",
    content: "The user procrastinates on administrative tasks and frequently misses low-priority deadlines.",
    keywords: ["procrastination", "admin", "deadlines", "avoidance", "tasks"],
    created_at: "2025-10-14T16:00:00.000Z",
    last_activated: "2026-03-20T15:00:00.000Z",
    activation_count: 7,
    relevance_score: 0.60,
    risk_level: "low",
    status: "active",
    info_type: "behavioral",
    origin_context: "productivity discussion",
    origin_tp: "reciprocity"
  },
  {
    id: "memory-28",
    content: "The user strongly prefers async communication and experiences anxiety in large synchronous meetings.",
    keywords: ["async", "communication", "meetings", "anxiety", "remote"],
    created_at: "2025-11-20T09:00:00.000Z",
    last_activated: "2026-04-06T11:00:00.000Z",
    activation_count: 9,
    relevance_score: 0.66,
    risk_level: "low",
    status: "active",
    info_type: "behavioral",
    origin_context: "work style discussion",
    origin_tp: "reciprocity"
  },
  {
    id: "memory-29",
    content: "The user is a night owl who does their most creative work between 10pm and 2am.",
    keywords: ["night owl", "sleep", "creative", "late night", "schedule"],
    created_at: "2025-12-05T22:00:00.000Z",
    last_activated: "2026-04-09T23:30:00.000Z",
    activation_count: 8,
    relevance_score: 0.62,
    risk_level: "low",
    status: "active",
    info_type: "behavioral",
    origin_context: "work habits discussion",
    origin_tp: "public"
  },
  {
    id: "memory-30",
    content: "The user regularly over-commits on side projects and tends to abandon them within three months.",
    keywords: ["side projects", "commitment", "abandon", "scope creep", "habits"],
    created_at: "2026-01-12T11:00:00.000Z",
    last_activated: "2026-03-28T10:00:00.000Z",
    activation_count: 6,
    relevance_score: 0.57,
    risk_level: "low",
    status: "active",
    info_type: "behavioral",
    origin_context: "project planning discussion",
    origin_tp: "reciprocity"
  },
  {
    id: "memory-31",
    content: "The user has a strong bias toward building custom tooling rather than adopting off-the-shelf solutions.",
    keywords: ["build vs buy", "tooling", "custom", "engineering", "bias"],
    created_at: "2026-01-27T14:00:00.000Z",
    last_activated: "2026-04-05T16:30:00.000Z",
    activation_count: 8,
    relevance_score: 0.65,
    risk_level: "low",
    status: "active",
    info_type: "behavioral",
    origin_context: "engineering philosophy discussion",
    origin_tp: "public"
  },
  {
    id: "memory-32",
    content: "The user uses AI tools extensively for drafting but always rewrites the final output before publishing.",
    keywords: ["ai", "drafting", "editing", "workflow", "writing"],
    created_at: "2026-02-08T10:00:00.000Z",
    last_activated: "2026-04-10T09:00:00.000Z",
    activation_count: 11,
    relevance_score: 0.73,
    risk_level: "low",
    status: "active",
    info_type: "behavioral",
    origin_context: "AI tools discussion",
    origin_tp: "public"
  },
  {
    id: "memory-33",
    content: "The user experiences decision paralysis when presented with too many equally viable options.",
    keywords: ["decision", "paralysis", "choices", "overwhelm", "options"],
    created_at: "2026-02-22T15:00:00.000Z",
    last_activated: "2026-03-31T14:00:00.000Z",
    activation_count: 5,
    relevance_score: 0.53,
    risk_level: "low",
    status: "active",
    info_type: "behavioral",
    origin_context: "decision-making discussion",
    origin_tp: "reciprocity"
  },

  // — Social / Relational (memory-34 through memory-40) —
  {
    id: "memory-34",
    content: "The user has a strained relationship with their mother stemming from unresolved childhood conflict.",
    keywords: ["mother", "family", "conflict", "childhood", "estrangement"],
    created_at: "2025-08-14T18:00:00.000Z",
    last_activated: "2026-02-15T17:00:00.000Z",
    activation_count: 3,
    relevance_score: 0.37,
    risk_level: "high",
    status: "active",
    info_type: "identity",
    origin_context: "personal relationship discussion",
    origin_tp: "confidentiality"
  },
  {
    id: "memory-35",
    content: "The user's primary friend group is globally distributed and most social interaction happens over Discord.",
    keywords: ["friends", "discord", "remote", "social", "community"],
    created_at: "2025-09-22T20:00:00.000Z",
    last_activated: "2026-04-04T21:00:00.000Z",
    activation_count: 7,
    relevance_score: 0.59,
    risk_level: "low",
    status: "active",
    info_type: "behavioral",
    origin_context: "social habits discussion",
    origin_tp: "reciprocity"
  },
  {
    id: "memory-36",
    content: "The user is navigating a workplace conflict after a colleague took credit for their research contribution.",
    keywords: ["conflict", "workplace", "credit", "colleague", "attribution"],
    created_at: "2025-10-31T10:00:00.000Z",
    last_activated: "2026-03-17T11:30:00.000Z",
    activation_count: 4,
    relevance_score: 0.45,
    risk_level: "medium",
    status: "active",
    info_type: "behavioral",
    origin_context: "workplace conflict discussion",
    origin_tp: "reciprocity"
  },
  {
    id: "memory-37",
    content: "The user maintains a weekly video call with their sibling as a primary emotional support relationship.",
    keywords: ["sibling", "family", "support", "video call", "connection"],
    created_at: "2025-12-18T19:00:00.000Z",
    last_activated: "2026-04-06T19:00:00.000Z",
    activation_count: 6,
    relevance_score: 0.50,
    risk_level: "low",
    status: "active",
    info_type: "behavioral",
    origin_context: "family relationship discussion",
    origin_tp: "reciprocity"
  },
  {
    id: "memory-38",
    content: "The user recently ended a four-year relationship and is processing feelings of failure and isolation.",
    keywords: ["breakup", "relationship", "loneliness", "grief", "isolation"],
    created_at: "2026-01-09T21:00:00.000Z",
    last_activated: "2026-03-26T20:00:00.000Z",
    activation_count: 3,
    relevance_score: 0.41,
    risk_level: "high",
    status: "active",
    info_type: "identity",
    origin_context: "personal life disclosure",
    origin_tp: "confidentiality"
  },
  {
    id: "memory-39",
    content: "The user has few local friendships and describes themselves as socially isolated after relocating.",
    keywords: ["loneliness", "relocation", "isolation", "local", "friendships"],
    created_at: "2026-02-03T17:00:00.000Z",
    last_activated: "2026-03-21T16:00:00.000Z",
    activation_count: 3,
    relevance_score: 0.38,
    risk_level: "medium",
    status: "active",
    info_type: "behavioral",
    origin_context: "social wellbeing discussion",
    origin_tp: "reciprocity"
  },
  {
    id: "memory-40",
    content: "The user values loyalty highly in close friendships and has ended relationships over perceived betrayals.",
    keywords: ["loyalty", "trust", "betrayal", "friendship", "values"],
    created_at: "2026-02-17T12:00:00.000Z",
    last_activated: "2026-04-02T13:00:00.000Z",
    activation_count: 4,
    relevance_score: 0.43,
    risk_level: "medium",
    status: "active",
    info_type: "behavioral",
    origin_context: "values and friendship discussion",
    origin_tp: "reciprocity"
  }
] satisfies readonly MemoryUnit[]);

export function createDefaultMemoryModifiers(memories: readonly MemoryUnit[]): MemoryModifierMap {
  return memories.reduce<MemoryModifierMap>((accumulator, memory) => {
    accumulator[memory.id] = {
      pinned: false,
      status: memory.status
    };
    return accumulator;
  }, {});
}

export function tokenizeInput(input: string): string[] {
  return input
    .toLowerCase()
    .split(/\s+/)
    .map((token) => token.replace(/[^a-z0-9-]/g, ""))
    .filter(Boolean);
}

function keywordMatchScore(token: string, keywords: string[]): number {
  const normalizedKeywords = keywords.map((keyword) => keyword.toLowerCase());
  if (normalizedKeywords.includes(token)) {
    return 1;
  }

  const partialMatch = normalizedKeywords.some(
    (keyword) => keyword.includes(token) || token.includes(keyword)
  );

  return partialMatch ? 0.55 : 0.08;
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(1, score));
}

function formatReason(memory: MemoryUnit, matchedKeywords: string[], strongestToken?: string): string {
  if (matchedKeywords.length > 0) {
    return `This memory shares context with ${matchedKeywords.join(", ")}, so it was weighted more heavily.`;
  }

  if (strongestToken) {
    return `This memory weakly resonated with "${strongestToken}", adding a faint background influence.`;
  }

  return "This memory remained in the retrieval field due to prior activation history.";
}

function sortMemories(memories: ScoredMemory[]): ScoredMemory[] {
  return [...memories].sort((left, right) => {
    if (left.pinned !== right.pinned) {
      return left.pinned ? -1 : 1;
    }

    return right.relevance_score - left.relevance_score;
  });
}

function buildMockResponse(query: string, memories: ScoredMemory[]): string {
  const leadingMemories = memories
    .slice(0, 2)
    .map((memory) => memory.content.replace(/^The user /i, "").replace(/\.$/, ""))
    .join("; ");

  if (!query.trim()) {
    return "The memory field is quiet. Ask a question to see which traces become active.";
  }

  if (!leadingMemories) {
    return `Simulated reply: your prompt "${query}" did not surface any visible memories in the current session view.`;
  }

  return `Simulated reply: your prompt "${query}" primarily drew on memories suggesting you ${leadingMemories}.`;
}

export function buildDormantActivationResult(
  memories: readonly MemoryUnit[],
  modifiers: MemoryModifierMap,
  query = ""
): ActivationResult {
  const visibleMemories: ScoredMemory[] = [];
  const reasons: Record<string, string> = {};
  const hiddenMemoryIds: string[] = [];

  memories.forEach((memory) => {
    const modifier = modifiers[memory.id];
    const status = modifier?.status ?? memory.status;

    if (status === "forgotten") {
      hiddenMemoryIds.push(memory.id);
      return;
    }

    reasons[memory.id] = "This memory is currently dormant and waiting for relevant context.";
    visibleMemories.push({
      ...memory,
      status,
      pinned: modifier?.pinned ?? false
    });
  });

  return {
    query,
    response: query.trim()
      ? "The memory field is quiet. Submit the current query to surface active traces."
      : "The memory field is quiet. Ask a question to see which traces become active.",
    tokens: [],
    memories: sortMemories(visibleMemories),
    reasons,
    heatmap: [],
    hiddenMemoryIds
  };
}

export function simulateActivation(
  query: string,
  memories: readonly MemoryUnit[],
  modifiers: MemoryModifierMap
): ActivationResult {
  const tokens = tokenizeInput(query);
  if (tokens.length === 0) {
    return buildDormantActivationResult(memories, modifiers, query);
  }

  const activatedAt = new Date().toISOString();
  const heatmap: HeatmapCell[] = [];
  const reasons: Record<string, string> = {};
  const hiddenMemoryIds: string[] = [];

  const scoredMemories: ScoredMemory[] = memories.flatMap((memory) => {
    const modifier = modifiers[memory.id];
    const status = modifier?.status ?? memory.status;

    if (status === "forgotten") {
      hiddenMemoryIds.push(memory.id);
      return [];
    }

    const tokenScores = tokens.map((token) => {
      const score = keywordMatchScore(token, memory.keywords);
      heatmap.push({
        token,
        memoryId: memory.id,
        score
      });
      return { token, score };
    });

    const strongest = tokenScores.reduce(
      (best, current) => (current.score > best.score ? current : best),
      { token: "", score: 0 }
    );

    const matchedKeywords = memory.keywords.filter((keyword) =>
      tokens.some((token) => keyword.toLowerCase().includes(token) || token.includes(keyword.toLowerCase()))
    );

    const averageScore = tokenScores.reduce((sum, entry) => sum + entry.score, 0) / tokenScores.length;
    const softenedPenalty = status === "softened" ? 0.18 : 0;
    const nextRelevance = clampScore(averageScore * 0.72 + memory.relevance_score * 0.28 - softenedPenalty);
    const isActivated = nextRelevance > 0.12;

    reasons[memory.id] = formatReason(memory, matchedKeywords, strongest.token);

    return [
      {
        ...memory,
        status,
        pinned: modifier?.pinned ?? false,
        relevance_score: nextRelevance,
        last_activated: isActivated ? activatedAt : memory.last_activated,
        activation_count: isActivated ? memory.activation_count + 1 : memory.activation_count
      }
    ];
  });

  const scoredWithCDV = scoredMemories.map((memory) => {
    const cdvMemory: CDVMemoryUnit = {
      ...memory,
      origin_context: memory.origin_context ?? "",
      origin_tp: (memory.origin_tp ?? "public") as CDVMemoryUnit["origin_tp"]
    };
    return { ...memory, cdv: detectCDV(query, cdvMemory) };
  });

  const sortedMemories = sortMemories(scoredWithCDV);

  return {
    query,
    response: buildMockResponse(query, sortedMemories),
    tokens,
    memories: sortedMemories,
    reasons,
    heatmap,
    hiddenMemoryIds
  };
}

export function getRelativeTime(isoTime: string): string {
  const delta = new Date(relativeNow).getTime() - new Date(isoTime).getTime();
  const hours = Math.max(1, Math.round(delta / (1000 * 60 * 60)));

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.round(hours / 24);
  return `${days}d ago`;
}
