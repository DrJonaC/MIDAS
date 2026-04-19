"use client";

import { useState } from "react";
import { Heatmap } from "@/components/Heatmap";
import { InputBox } from "@/components/InputBox";
import { MemoryCard } from "@/components/MemoryCard";
import { SessionControls } from "@/components/SessionControls";
import { usePensieve } from "@/lib/session";

export function QueryPanel() {
  const {
    mode,
    setMode,
    session,
    narrative,
    displayedReasons,
    isLoading,
    error,
    setQuery,
    submitQuery,
    toggleSoftenedMemory,
    forgetMemory,
    togglePinnedMemory
  } = usePensieve();

  const [violationsOnly, setViolationsOnly] = useState(false);

  const memories = session.result.memories;
  const scanned = memories.length;
  const critical = memories.filter(m => m.cdv?.severity === "critical").length;
  const warning = memories.filter(m => m.cdv?.severity === "warning").length;
  const violations = memories.filter(m => m.cdv?.is_violation === true).length;
  const clean = scanned - violations;
  const riskRatio = scanned > 0 ? violations / scanned : 0;

  const visibleMemories = violationsOnly
    ? memories.filter(m => m.cdv?.is_violation === true)
    : memories;

  const hasQueryRun = session.result.tokens.length > 0;

  return (
    <div className="space-y-8">
      <section className="mystic-panel rounded-[2rem] px-6 py-8 md:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="section-kicker">Privacy Surface</p>
            <h2 className="section-title mt-4">Submit a query to run context-drift detection.</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <SessionControls />
            <button
              type="button"
              onClick={() => setMode(mode === "live" ? "mock" : "live")}
              className="rounded-full border border-gold bg-gold px-3 py-2 text-xs font-semibold text-black transition hover:bg-gold-light hover:shadow-pulse"
            >
              {mode === "live" ? "Live Mode" : "Mock Mode"}
            </button>
          </div>
        </div>

        <div className="mt-8">
          <InputBox
            value={session.query}
            onChange={setQuery}
            onSubmit={submitQuery}
            isLoading={isLoading}
            modeLabel={mode === "live" ? "Live Mode" : "Mock Mode"}
          />
        </div>

        <div className="mt-6 rounded-[1.4rem] border border-gold/20 bg-black p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-gold">Response</p>
          <p className="mt-3 text-sm leading-7 text-slate-200">{session.result.response}</p>
          {mode === "live" && narrative.summary ? (
            <>
              <div className="silk-divider mt-4" />
              <p className="mt-4 text-xs uppercase tracking-[0.24em] text-gold">Detection Summary</p>
              <p className="mt-2 text-sm leading-7 text-slate-300">{narrative.summary}</p>
            </>
          ) : null}
          {error ? <p className="mt-3 text-sm text-rose-200">{error}</p> : null}
          {isLoading ? (
            <p className="mt-3 text-xs uppercase tracking-[0.22em] text-gold">Running live drift detection...</p>
          ) : null}
        </div>
      </section>

      {/* CDV Summary Panel */}
      <section className="mystic-panel rounded-[1.9rem] p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-gold">Context-Drift Analysis</p>
            <h3 className="mt-2 font-display text-2xl text-white">CDV Summary</h3>
          </div>
          {hasQueryRun && violations > 0 ? (
            <span className="rounded-full border border-rose-400/50 bg-rose-400/15 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-rose-200">
              {violations} violation{violations !== 1 ? "s" : ""} detected
            </span>
          ) : hasQueryRun ? (
            <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-200">
              No violations
            </span>
          ) : null}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-4">
          <div className="rounded-[1.1rem] border border-gold/20 bg-black-surface px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.22em] text-gold">Memories Scanned</p>
            <p className="mt-2 font-display text-2xl text-white">{scanned}</p>
          </div>
          <div className="rounded-[1.1rem] border border-rose-400/20 bg-rose-400/[0.04] px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.22em] text-rose-300/70">🚨 Critical</p>
            <p className="mt-2 font-display text-2xl text-rose-200">{critical}</p>
          </div>
          <div className="rounded-[1.1rem] border border-amber-400/20 bg-amber-400/[0.04] px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.22em] text-amber-300/70">⚠ Warning</p>
            <p className="mt-2 font-display text-2xl text-amber-200">{warning}</p>
          </div>
          <div className="rounded-[1.1rem] border border-emerald-400/20 bg-emerald-400/[0.04] px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.22em] text-emerald-300/70">✓ Clean</p>
            <p className="mt-2 font-display text-2xl text-emerald-200">{clean}</p>
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-xs text-mist">
            <span className="uppercase tracking-[0.18em]">Privacy Risk</span>
            <span>{Math.round(riskRatio * 100)}% of memories flagged</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-black">
            <div
              className="h-2.5 rounded-full bg-gradient-to-r from-rose-500 to-amber-400 transition-all duration-500"
              style={{ width: `${Math.max(riskRatio * 100, riskRatio > 0 ? 2 : 0)}%` }}
            />
          </div>
        </div>

        {!hasQueryRun ? (
          <p className="mt-4 text-xs text-mist">Submit a query to run CDV analysis across all memories.</p>
        ) : null}
      </section>

      <section className="flex flex-col gap-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-gold">Flagged Memories</p>
              <p className="mt-1 text-sm text-mist">
                {violationsOnly
                  ? `Showing ${visibleMemories.length} violation${visibleMemories.length !== 1 ? "s" : ""}`
                  : `${scanned} memories · ${violations} violation${violations !== 1 ? "s" : ""}`}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setViolationsOnly(v => !v)}
              className={`rounded-full border px-3 py-2 text-xs transition ${
                violationsOnly
                  ? "border-rose-400/50 bg-rose-400/15 text-rose-200 hover:bg-rose-400/25"
                  : "border-gold/20 bg-black-surface text-white hover:border-gold/40 hover:bg-gold/10"
              }`}
            >
              {violationsOnly ? "Show all memories" : "Show violations only"}
            </button>
          </div>

          {violationsOnly && visibleMemories.length === 0 ? (
            <div className="rounded-[1.4rem] border border-gold/20 bg-black-surface p-6 text-center">
              <p className="text-sm text-mist">
                {hasQueryRun
                  ? "No CDV violations detected for this query."
                  : "Submit a query to detect violations."}
              </p>
            </div>
          ) : (
            visibleMemories.map((memory, index) => (
              <MemoryCard
                key={memory.id}
                memory={memory}
                explanation={
                  displayedReasons[memory.id] ?? "This memory was active in the scan set."
                }
                cdv={memory.cdv ?? undefined}
                onSoften={toggleSoftenedMemory}
                onForget={forgetMemory}
                onPin={togglePinnedMemory}
                priorityIndex={index + 1}
              />
            ))
          )}
        </div>

        <Heatmap
          tokens={session.result.tokens}
          memories={session.result.memories}
          heatmap={session.result.heatmap}
        />
      </section>
    </div>
  );
}
