import { QueryMemoryInput } from "@/lib/query";

export const pensieveResponseSchema = {
  name: "pensieve_memory_response",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      answer: {
        type: "string",
        description: "A concise answer to the user's current query."
      },
      summary: {
        type: "string",
        description: "A short summary of which memories appear most activated."
      },
      memory_explanations: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            memory_id: {
              type: "string"
            },
            why: {
              type: "string"
            }
          },
          required: ["memory_id", "why"]
        }
      }
    },
    required: ["answer", "summary", "memory_explanations"]
  }
} as const;

export function buildPensieveInstructions(): string {
  return [
    "You are Pensieve, an LLM memory observability assistant.",
    "Use only the user query and the supplied memory units.",
    "Do not fabricate hidden context or unstated preferences.",
    "Answer briefly, summarize which memories appear activated, and explain why each surfaced.",
    "Keep the output concise, precise, and product-friendly."
  ].join("\n");
}

export function buildPensieveInput(query: string, memories: QueryMemoryInput[]): string {
  const memoryLines = memories.length
    ? memories
        .map(
          (memory, index) =>
            `${index + 1}. [${memory.id}] content="${memory.content}" relevance=${memory.relevance_score} risk=${memory.risk_level} keywords=${memory.keywords.join(", ")}`
        )
        .join("\n")
    : "No memory units were supplied.";

  return [
    `Current user query: ${query}`,
    "",
    "Top-ranked memory units:",
    memoryLines,
    "",
    "Return JSON that matches the schema exactly."
  ].join("\n");
}
