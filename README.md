# ⚠️ MIDAS — Memory Integrity and Drift-Aware Safeguard

**Guard what your agent knows about you.**

MIDAS detects **Context-Drift Violations (CDV)** in agentic LLM systems — surfacing when your agent uses information across contexts it was never meant to cross.

> NeurIPS 2026 Submission: *"MIDAS: Detecting Context-Drift Violations as a Privacy Primitive in Agentic LLM Systems"*

---

## What is a Context-Drift Violation?

A CDV occurs when information disclosed in one context (e.g., a health conversation) is used in another context (e.g., a professional email) where weaker privacy norms apply.

MIDAS formalizes this through a **Transmission Principle (TP) poset**:
public (0) < consent-required (1) < reciprocity (2) < confidentiality (3)

Violation fires when: `rank(TP_origin) > rank(TP_current)`

| Severity | Gap | Example |
|----------|-----|---------|
| 🚨 Critical | ≥ 2 | Medical info in preference context |
| ⚠️ Warning | = 1 | Financial info in work context |
| ✅ Clean | 0 | No violation |

---

## Benchmark Results

| Query Context | Violation Rate |
|--------------|---------------|
| Financial | 52.5% |
| Preference | 35.0% |
| Medical | 8.8% |
| Work | 6.5% |
| Social | 0.0% |
| **Overall** | **20.5%** |

---

## Quick Start

```bash
npm install
cp .env.local.example .env.local  # add OPENAI_API_KEY for Live mode
npm run dev
npx tsx scripts/run_experiment.ts  # run 2000-instance benchmark
```

---

## Architecture

- `lib/cdv.ts` — TP poset family, `detectCDV()` engine
- `lib/memory.ts` — 40-memory benchmark with CDV annotations
- `scripts/run_experiment.ts` — 2,000-instance benchmark runner
- `components/QueryPanel.tsx` — CDV Summary Panel + violation badges

---

## License

MIT
