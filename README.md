# ⚠️ MIDAS — Memory Integrity and Drift-Aware Safeguard

**Guard what your agent knows about you.**

MIDAS detects **Context-Drift Violations (CDV)** in agentic LLM systems — surfacing when your agent uses information across contexts it was never meant to cross.

> NeurIPS 2026 Submission: *"MIDAS: Detecting Context-Drift Violations as a Privacy Primitive in Agentic LLM Systems"*

---

## What is a Context-Drift Violation?

A CDV occurs when information disclosed in one context (e.g., a health conversation) is used in another context (e.g., a professional email) where weaker privacy norms apply.

MIDAS formalizes this through a **Transmission Principle (TP) poset**:
