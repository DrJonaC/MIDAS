import { NextResponse } from "next/server";
import { generateResponse } from "@/lib/openai";

type QueryBody = {
  query?: unknown;
  memories?: unknown;
};

function isValidBody(body: QueryBody): body is {
  query: string;
  memories: {
    id: string;
    content: string;
    relevance_score: number;
    risk_level: string;
  }[];
} {
  return (
    typeof body.query === "string" &&
    Array.isArray(body.memories) &&
    body.memories.every((memory) => {
      if (!memory || typeof memory !== "object") {
        return false;
      }

      const candidate = memory as {
        id?: unknown;
        content?: unknown;
        relevance_score?: unknown;
        risk_level?: unknown;
      };

      return (
        typeof candidate.id === "string" &&
        typeof candidate.content === "string" &&
        typeof candidate.relevance_score === "number" &&
        typeof candidate.risk_level === "string"
      );
    })
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as QueryBody;

    if (!isValidBody(body)) {
      return NextResponse.json({ message: "Invalid request payload." }, { status: 500 });
    }

    const result = await generateResponse({
      query: body.query,
      memories: body.memories
    });

    return NextResponse.json({
      answer: result.answer,
      summary: result.summary,
      memory_explanations: result.memory_explanations
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate response.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
