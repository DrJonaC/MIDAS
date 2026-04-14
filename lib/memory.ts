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
};

export type MemoryModifier = {
  pinned: boolean;
  status: MemoryStatus;
};

export type MemoryModifierMap = Record<string, MemoryModifier>;

export type ScoredMemory = MemoryUnit & {
  pinned: boolean;
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
    status: "active"
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
    status: "active"
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
    status: "active"
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
    status: "active"
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
    status: "active"
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

  const sortedMemories = sortMemories(scoredMemories);

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
