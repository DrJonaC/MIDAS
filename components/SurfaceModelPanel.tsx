"use client";

import { Heatmap } from "@/components/Heatmap";
import { InputBox } from "@/components/InputBox";
import { SessionControls } from "@/components/SessionControls";
import { usePensieve } from "@/lib/session";

export function SurfaceModelPanel() {
  const { mode, setMode, session, narrative, isLoading, error, setQuery, submitQuery } = usePensieve();

  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="mystic-panel rounded-[2rem] px-6 py-8 md:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="section-kicker">Detection Surface</p>
                <h2 className="section-title mt-4">
                  Run drift detection and inspect the activation surface.
                </h2>
                <p className="mt-4 text-base leading-8 text-slate-300">
                  Technical view of the detection pipeline — query tokens, per-memory CDV checks, activation scores,
                  and the mechanics behind the privacy surface.
                </p>
              </div>
              <SessionControls />
              <button
                type="button"
                onClick={() => setMode(mode === "live" ? "mock" : "live")}
                className="rounded-full border border-gold bg-gold px-3 py-2 text-xs font-semibold text-black transition hover:bg-gold-light hover:shadow-pulse"
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
                <p className="text-xs uppercase tracking-[0.24em] text-gold">Response Panel</p>
                <h3 className="mt-2 font-display text-3xl text-white">Current answer</h3>
              </div>
              <span className="rounded-full border border-gold/20 bg-black-surface px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-mist">
                {mode === "live" ? "Live" : "Mock"}
              </span>
            </div>

            <div className="mt-6">
              <p className="text-sm uppercase tracking-[0.18em] text-gold">Answer</p>
              <p className="mt-3 text-base leading-8 text-slate-200">{session.result.response}</p>
            </div>

            <div className="mt-6 rounded-[1.4rem] border border-gold/20 bg-black-surface p-4">
              <p className="text-sm uppercase tracking-[0.18em] text-gold">Detection summary</p>
              <p className="mt-3 text-base leading-8 text-slate-300">
                {mode === "live" && narrative.summary
                  ? narrative.summary
                  : "A local summary will appear here when Live Mode returns structured CDV analysis."}
              </p>
            </div>

            {error ? <p className="mt-5 text-sm text-rose-200">{error}</p> : null}
            {isLoading ? (
              <p className="mt-5 text-xs uppercase tracking-[0.22em] text-gold">Running live drift detection...</p>
            ) : null}
          </section>

          <section className="mystic-panel rounded-[1.9rem] p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-gold">Detection pipeline</p>
            <h3 className="mt-2 font-display text-3xl text-white">How the detection surface is built</h3>
            <div className="silk-divider mt-4" />
            <div className="mt-5 grid gap-3 text-sm leading-7 text-slate-300">
              <p>Token-to-memory influence is computed locally from keyword overlap.</p>
              <p>Each query recomputes activation from immutable base memory entries plus reversible session modifiers.</p>
              <p>In Live mode, CDV detection and memory explanations run on the server-side LLM integration.</p>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
