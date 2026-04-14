"use client";

import { MemoryCard } from "@/components/MemoryCard";
import { SessionControls } from "@/components/SessionControls";
import { usePensieve } from "@/lib/session";

type KeywordPriority = {
  keyword: string;
  weight: number;
};

function getPriorityKeywords(
  memories: {
    keywords: string[];
    relevance_score: number;
  }[]
): KeywordPriority[] {
  const weights = new Map<string, number>();

  memories.forEach((memory) => {
    memory.keywords.forEach((keyword) => {
      const current = weights.get(keyword) ?? 0;
      weights.set(keyword, current + memory.relevance_score);
    });
  });

  return [...weights.entries()]
    .map(([keyword, weight]) => ({ keyword, weight }))
    .sort((left, right) => right.weight - left.weight)
    .slice(0, 10);
}

function getSurfacedThemes(
  memories: {
    content: string;
    keywords: string[];
    relevance_score: number;
  }[]
): string[] {
  const themeSeeds = memories
    .sort((left, right) => right.relevance_score - left.relevance_score)
    .map((memory) => {
      const compactKeywords = memory.keywords.slice(0, 3).join(", ");
      const phrase = memory.content
        .replace(/^The user\s+/i, "")
        .replace(/\.$/, "")
        .replace(/\b(prefers|favors|often asks for|is building|has explored)\b/gi, "")
        .replace(/\s+/g, " ")
        .trim();

      return compactKeywords ? `${compactKeywords} · ${phrase}` : phrase;
    });

  return [...new Set(themeSeeds)].slice(0, 4);
}

export function UserViewPanel() {
  const {
    session,
    liveExplanations,
    toggleSoftenedMemory,
    togglePinnedMemory,
    forgetMemory
  } = usePensieve();
  const visibleMemories = session.result.memories;
  const priorityKeywords = getPriorityKeywords(visibleMemories);
  const surfacedThemes = getSurfacedThemes(visibleMemories);
  const activeCount = visibleMemories.filter((memory) => memory.status === "active").length;
  const pinnedCount = visibleMemories.filter((memory) => memory.pinned).length;
  const softenedCount = visibleMemories.filter((memory) => memory.status === "softened").length;
  const hiddenCount = session.result.hiddenMemoryIds.length;
  const strongestWeight = priorityKeywords[0]?.weight ?? 1;

  return (
    <div className="space-y-6">
      <section className="mystic-panel rounded-[2rem] px-6 py-8 md:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="section-kicker">User View</p>
            <h2 className="section-title mt-4">A calmer reading of what the model recalls</h2>
            <p className="mt-4 text-base leading-8 text-slate-300">
              This view emphasizes human-readable memory phrases, clear relevance, and reversible controls rather than
              low-level mechanics.
            </p>
          </div>
          <SessionControls />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <div className="mystic-panel-soft rounded-[1.4rem] p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-mist/70">Active</p>
          <p className="mt-2 font-display text-3xl text-white">{activeCount}</p>
        </div>
        <div className="mystic-panel-soft rounded-[1.4rem] p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-mist/70">Pinned</p>
          <p className="mt-2 font-display text-3xl text-white">{pinnedCount}</p>
        </div>
        <div className="mystic-panel-soft rounded-[1.4rem] p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-mist/70">Softened</p>
          <p className="mt-2 font-display text-3xl text-white">{softenedCount}</p>
        </div>
        <div className="mystic-panel-soft rounded-[1.4rem] p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-mist/70">Hidden</p>
          <p className="mt-2 font-display text-3xl text-white">{hiddenCount}</p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <div className="mystic-panel rounded-[1.9rem] p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-mist/70">Priority Keywords</p>
            <h3 className="mt-2 font-display text-3xl text-white">What is most salient right now</h3>
            <div className="silk-divider mt-4" />
            <div className="mt-5 flex flex-wrap gap-3">
              {priorityKeywords.map((item) => {
                const intensity = item.weight / strongestWeight;
                const strong = intensity > 0.8;
                const medium = intensity > 0.55;

                return (
                  <span
                    key={item.keyword}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      strong
                        ? "border-glow/35 bg-glow/18 text-white shadow-pulse"
                        : medium
                          ? "border-cyan-300/20 bg-cyan-300/10 text-cyan-100"
                          : "border-white/10 bg-white/[0.04] text-mist"
                    }`}
                  >
                    {item.keyword}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="mystic-panel rounded-[1.9rem] p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-mist/70">Surfaced Themes</p>
            <h3 className="mt-2 font-display text-3xl text-white">Phrase-level memory field</h3>
            <div className="silk-divider mt-4" />
            <div className="mt-5 grid gap-3">
              {surfacedThemes.map((theme, index) => (
                <div
                  key={`${theme}-${index}`}
                  className="mystic-panel-soft rounded-[1.2rem] px-4 py-3 text-sm leading-7 text-slate-200"
                >
                  {theme}
                </div>
              ))}
            </div>
          </div>

          <div className="mystic-panel rounded-[1.9rem] p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-mist/70">Interpretation</p>
            <h3 className="mt-2 font-display text-3xl text-white">Activated memory summary</h3>
            <div className="silk-divider mt-4" />
            <p className="mt-4 text-base leading-8 text-slate-200">
              {session.result.response}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {visibleMemories.map((memory, index) => (
            <MemoryCard
              key={memory.id}
              memory={memory}
              explanation={
                liveExplanations[memory.id] ??
                session.result.reasons[memory.id] ??
                "This memory remained available in the active set."
              }
              onSoften={toggleSoftenedMemory}
              onForget={forgetMemory}
              onPin={togglePinnedMemory}
              priorityIndex={index + 1}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
