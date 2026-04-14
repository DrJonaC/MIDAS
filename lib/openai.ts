import OpenAI from "openai";
console.log("API KEY:", process.env.OPENAI_API_KEY);
type GenerateResponseInput = {
  query: string;
  memories: {
    id: string;
    content: string;
    relevance_score: number;
    risk_level: string;
  }[];
};

type MemoryExplanation = {
  memory_id: string;
  why: string;
};

type GenerateResponseOutput = {
  answer: string;
  summary: string;
  memory_explanations: MemoryExplanation[];
};

let cachedClient: OpenAI | null = null;

function getClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY. Add it to .env.local as OPENAI_API_KEY=your_api_key_here.");
  }

  if (!cachedClient) {
    cachedClient = new OpenAI({ apiKey });
  }

  return cachedClient;
}

function buildFallbackResponse(input: GenerateResponseInput, answer: string): GenerateResponseOutput {
  return {
    answer,
    summary:
      input.memories.length > 0
        ? `Most activated memories: ${input.memories
            .slice(0, 3)
            .map((memory) => memory.content)
            .join(" ")}`
        : "No memory summary was available.",
    memory_explanations: input.memories.slice(0, 3).map((memory) => ({
      memory_id: memory.id,
      why: `This memory surfaced because it was included among the highest-ranked memories for the current query.`
    }))
  };
}

function extractJsonObject(text: string): string | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    return null;
  }

  return text.slice(start, end + 1);
}

function isStructuredResponse(value: unknown): value is GenerateResponseOutput {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as GenerateResponseOutput;
  return (
    typeof candidate.answer === "string" &&
    typeof candidate.summary === "string" &&
    Array.isArray(candidate.memory_explanations) &&
    candidate.memory_explanations.every((item) => {
      if (!item || typeof item !== "object") {
        return false;
      }

      const explanation = item as MemoryExplanation;
      return typeof explanation.memory_id === "string" && typeof explanation.why === "string";
    })
  );
}

export async function generateResponse(input: GenerateResponseInput): Promise<GenerateResponseOutput> {
  const client = getClient();
  const topMemories = input.memories.slice(0, 3);
  const memoryBlock = topMemories.length
    ? topMemories
        .map(
          (memory, index) =>
            `${index + 1}. [${memory.id}] ${memory.content} | relevance=${memory.relevance_score} | risk=${memory.risk_level}`
        )
        .join("\n")
    : "No memories were provided.";

  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text: [
              "You are helping a memory observability product answer a user query.",
              "Use the query and provided memories only.",
              "Do not hallucinate personal data that is not explicitly provided.",
              "Return valid JSON only.",
              'Format: {"answer":"string","summary":"string","memory_explanations":[{"memory_id":"string","why":"string"}]}.',
              "The answer should be 2-3 concise sentences.",
              "The summary should briefly describe the most activated memories.",
              "Include one explanation for each provided memory."
            ].join(" ")
          }
        ]
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: `Query:\n${input.query}\n\nTop memories:\n${memoryBlock}`
          }
        ]
      }
    ]
  });

  const outputText = response.output_text?.trim();
  if (!outputText) {
    throw new Error("OpenAI returned an empty answer.");
  }

  const jsonText = extractJsonObject(outputText);
  if (!jsonText) {
    return buildFallbackResponse(input, outputText);
  }

  try {
    const parsed = JSON.parse(jsonText) as unknown;
    if (isStructuredResponse(parsed)) {
      return {
        answer: parsed.answer.trim() || buildFallbackResponse(input, outputText).answer,
        summary: parsed.summary.trim() || buildFallbackResponse(input, outputText).summary,
        memory_explanations: parsed.memory_explanations
      };
    }
  } catch {
    return buildFallbackResponse(input, outputText);
  }

  return buildFallbackResponse(input, outputText);
}
