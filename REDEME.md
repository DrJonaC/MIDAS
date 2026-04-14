\# 🧠 Pensieve (冥想盆)



\*\*Observe how memory shapes an answer.\*\*



Pensieve is an interactive system for visualizing, interpreting, and managing how Large Language Models (LLMs) “remember” a user.

It bridges the gap between \*\*model-level mechanisms\*\* and \*\*user-level understanding\*\*, making AI memory observable, explainable, and partially controllable.



\---



\## ✨ Motivation



Modern LLMs increasingly rely on personalization and memory.

However, users have little visibility into:



\* What the model remembers

\* Why certain information resurfaces

\* Whether some memories are overly persistent or sensitive



Pensieve explores a new interface paradigm:



> \*\*What if users could inspect and manage AI memory like a “Pensieve”?\*\*



\---



\## 🔍 Key Features



\### 1. Dual Perspective Interface



\* \*\*Surface Model View (Model Perspective)\*\*



&#x20; \* Query input

&#x20; \* Response generation (Mock / Live LLM)

&#x20; \* Influence heatmap (token × memory)

&#x20; \* Memory summary



\* \*\*User View (Human Perspective)\*\*



&#x20; \* Keyword priority ranking

&#x20; \* Surfaced themes

&#x20; \* Memory fragments (cards)

&#x20; \* Explanations for why each memory surfaced



\---



\### 2. Memory Abstraction



Each memory is represented as a structured unit:



\* content (semantic memory)

\* keywords

\* relevance\_score

\* activation\_count

\* last\_activated

\* risk label (heuristic)

\* status (active / softened / forgotten / pinned)



\---



\### 3. Explainability Layer



Pensieve does not only generate answers—it explains them.



In \*\*Live Mode\*\*, the system returns:



\* `answer`: model-generated response

\* `summary`: high-level memory activation summary

\* `memory\_explanations`: why each memory surfaced



\---



\### 4. Reversible Memory Controls



Users can interact with memory:



\* \*\*Soften\*\* → reduce influence

\* \*\*Forget\*\* → hide from view

\* \*\*Pin\*\* → keep prioritized

\* \*\*Restore / Undo / Reset\*\*



This simulates a controllable memory system.



\---



\### 5. Memory Risk Interpretation (Heuristic)



Pensieve introduces a lightweight risk layer:



\* benign

\* sticky (overly persistent)

\* sensitive (profile-like)

\* dormant (hidden but retrievable)

\* leaky (unexpected resurfacing)



\---



\## 🏗️ System Architecture



\### Frontend



\* Next.js (App Router)

\* TypeScript

\* Tailwind CSS

\* React Context (shared session state)



\### Backend



\* Next.js API Route (`/api/query`)

\* Server-side OpenAI integration



\### Core Modules



\* `lib/session.tsx` → shared state management

\* `lib/openai.ts` → LLM interface

\* `components/\*` → UI + visualization

\* `app/\*` → routed pages



\---



\## 🔁 Data Flow



```

User Query

&#x20;  ↓

Memory Activation (local heuristic)

&#x20;  ↓

Top Memory Selection

&#x20;  ↓

→ (Mock Mode) simulated response

→ (Live Mode) OpenAI API call

&#x20;  ↓

Structured Output:

&#x20; - answer

&#x20; - summary

&#x20; - memory\_explanations

&#x20;  ↓

UI Rendering:

&#x20; - response panel

&#x20; - memory summary

&#x20; - memory cards

&#x20; - heatmap

```



\---



\## 🧪 Demo



Try in Surface Model:



```

What do you know about me?

```



Then switch to \*\*User View\*\* to observe:



\* prioritized memory

\* themes

\* explanations



\---



\## 🔐 Environment Setup



Create `.env.local`:



```

OPENAI\_API\_KEY=your\_api\_key\_here

```



Then run:



```bash

npm install

npm run dev

```



\---



\## ⚠️ Notes



\* Memory influence is currently \*\*heuristic (simulated)\*\*

\* The system focuses on \*\*interpretability, not accuracy\*\*

\* No real persistent user memory is stored



\---



\## 🚀 Future Work



\* True retrieval-based memory system

\* Memory leak detection via adversarial prompts

\* Token-level attribution (attention tracing)

\* User-controlled memory privacy (seal / mask / redact)

\* Embedding-based similarity instead of keyword overlap



\---



\## 🧠 Key Insight



Pensieve explores a core question:



> \*\*AI should not only remember — it should explain what it remembers, and why.\*\*



\---



\## 📄 License



MIT



