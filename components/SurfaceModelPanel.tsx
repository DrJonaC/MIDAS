"use client";

import { Heatmap } from "@/components/Heatmap";
import { InputBox } from "@/components/InputBox";
import { SessionControls } from "@/components/SessionControls";
import { usePensieve } from "@/lib/session";

export function SurfaceModelPanel() {
  const { mode, setMode, session, liveSummary, isLoading, error, setQuery, submitQuery } = usePensieve();

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="mystic-panel rounded-[2rem] px-6 py-8 md:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="section-kicker">Surface Model</p>
                <h2 className="section-title mt-4">
                  Query the basin and inspect the activation surface.
                </h2>
                <p className="mt-4 text-base leading-8 text-slate-300">
                  This technical view combines the query panel, response panel, token-level activation, and the memory
                  mechanics behind the current surface.
                </p>
              </div>
              <SessionControls />
              <button
                type="button"
                onClick={() => setMode(mode === "live" ? "mock" : "live")}
                className="rounded-full border border-glow/25 bg-gradient-to-r from-glow/15 to-cyan-300/10 px-3 py-2 text-xs text-cyan-100 transition hover:border-glow/55 hover:bg-glow/20 hover:shadow-pulse"
              >
                {mode === "live" ? "Live Mode" : "Mock Mode"}
              </button>
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
          </div>

          <Heatmap tokens={session.result.tokens} memories={session.result.memories} heatmap={session.result.heatmap} />
        </div>

        <div className="space-y-6">
          <section className="mystic-panel rounded-[1.9rem] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-mist/70">Response Panel</p>
                <h3 className="mt-2 font-display text-3xl text-white">Current answer</h3>
              </div>
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-mist">
                {mode === "live" ? "Live" : "Mock"}
              </span>
            </div>

            <div className="mt-6">
              <p className="text-sm uppercase tracking-[0.18em] text-glow/80">Answer</p>
              <p className="mt-3 text-base leading-8 text-slate-200">{session.result.response}</p>
            </div>

            <div className="mt-6 rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm uppercase tracking-[0.18em] text-glow/80">Memory summary</p>
              <p className="mt-3 text-base leading-8 text-slate-300">
                {mode === "live" && liveSummary
                  ? liveSummary
                  : "A local summary will appear here when Live Mode returns structured explainability."}
              </p>
            </div>

            {error ? <p className="mt-5 text-sm text-rose-200">{error}</p> : null}
            {isLoading ? (
              <p className="mt-5 text-xs uppercase tracking-[0.22em] text-glow/85">Drawing live interpretation...</p>
            ) : null}
          </section>

          <section className="mystic-panel rounded-[1.9rem] p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-mist/70">Mechanics</p>
            <h3 className="mt-2 font-display text-3xl text-white">How the surface is rendered</h3>
            <div className="silk-divider mt-4" />
            <div className="mt-5 grid gap-3 text-sm leading-7 text-slate-300">
              <p>The heatmap is still generated locally from token-to-keyword overlap.</p>
              <p>New queries always recompute activation from immutable base memory data plus reversible session modifiers.</p>
              <p>In Live LLM mode, only the answer and memory explanations are delegated to the server-side OpenAI integration.</p>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
