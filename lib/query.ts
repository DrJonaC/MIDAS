import { ActivationResult, ScoredMemory } from "@/lib/memory";

export type PensieveMode = "mock" | "live";

export type QueryMemoryInput = {
  memory_id: string;
  content: string;
  relevance_score: number;
  risk_level: ScoredMemory["risk_level"];
  keywords: string[];
};

export type MemoryExplanation = {
  memory_id: string;
  why: string;
};

export type LLMQueryResult = {
  answer: string;
  summary: string;
  memory_explanations: MemoryExplanation[];
};

export type QueryApiRequest = {
  mode: PensieveMode;
  query: string;
  memories: QueryMemoryInput[];
};

export type QueryApiResponse = {
  ok: boolean;
  data?: LLMQueryResult;
  error?: string;
  meta?: {
    provider: string;
    model: string;
    mode: PensieveMode;
  };
};

export type NarrativeState = LLMQueryResult & {
  provider: string;
  model: string;
  source: PensieveMode;
};

export function pickTopMemories(memories: readonly ScoredMemory[], limit = 4): QueryMemoryInput[] {
  return memories.slice(0, limit).map((memory) => ({
    memory_id: memory.id,
    content: memory.content,
    relevance_score: Number(memory.relevance_score.toFixed(3)),
    risk_level: memory.risk_level,
    keywords: memory.keywords
  }));
}

export function buildMockNarrative(result: ActivationResult): NarrativeState {
  const topMemories = result.memories.slice(0, 3);

  return {
    answer: result.response,
    summary: topMemories.length
      ? `Most activated traces: ${topMemories.map((memory) => memory.content).join(" ")}`
      : "No visible memories were activated by the current prompt.",
    memory_explanations: topMemories.map((memory) => ({
      memory_id: memory.id,
      why: result.reasons[memory.id] ?? "This memory remained available in the active field."
    })),
    provider: "local-simulation",
    model: "heuristic-memory-engine",
    source: "mock"
  };
}

export function mergeMemoryExplanationMap(
  fallbackReasons: Record<string, string>,
  explanations: MemoryExplanation[]
): Record<string, string> {
  const next = { ...fallbackReasons };

  explanations.forEach((explanation) => {
    next[explanation.memory_id] = explanation.why;
  });

  return next;
}
