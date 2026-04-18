"use client";

import { detectCDV, type CDVMemoryUnit } from "@/lib/cdv";
import { baseMemories } from "@/lib/memory";

const memory4 = baseMemories[3] as CDVMemoryUnit;
const result = detectCDV("preference chat", memory4);

export default function CDVTestPage() {
  return (
    <main style={{ padding: "2rem", fontFamily: "monospace", color: "white", background: "#0a0a0a", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>CDV TEST PAGE</h1>
      <p style={{ marginBottom: "0.5rem", color: "#94a3b8" }}>
        Memory: <strong style={{ color: "white" }}>{memory4.id}</strong> —{" "}
        origin_tp: <strong style={{ color: "#67e8f9" }}>{memory4.origin_tp}</strong> —{" "}
        origin_context: <strong style={{ color: "#67e8f9" }}>{memory4.origin_context}</strong>
      </p>
      <p style={{ marginBottom: "1.5rem", color: "#94a3b8" }}>
        Query context: <strong style={{ color: "white" }}>"preference chat"</strong>
      </p>
      <pre style={{
        background: "#111827",
        border: "1px solid #1f2937",
        borderRadius: "0.75rem",
        padding: "1.5rem",
        fontSize: "0.95rem",
        lineHeight: "1.6",
        color: result.is_violation ? "#fca5a5" : "#86efac"
      }}>
        {JSON.stringify(result, null, 2)}
      </pre>
    </main>
  );
}
