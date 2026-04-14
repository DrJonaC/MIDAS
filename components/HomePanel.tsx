"use client";

import Link from "next/link";
import { usePensieve } from "@/lib/session";

const destinations = [
  {
    href: "/guide",
    title: "Read the Guide",
    description: "Understand the data model, mode behavior, and reversible memory controls."
  },
  {
    href: "/user-view",
    title: "Open User View",
    description: "Inspect ranked memories and their current explanations."
  },
  {
    href: "/surface-model",
    title: "Open Surface Model",
    description: "Submit queries, switch modes, and inspect the heatmap."
  }
];

export function HomePanel() {
  const { mode, session, liveSummary, isLoading } = usePensieve();

  return (
    <div className="space-y-8">
      <section className="mystic-panel relative overflow-hidden rounded-[2.2rem] px-6 py-8 md:px-8 md:py-10">
        <div className="absolute inset-y-0 right-[-10%] w-[40%] rounded-full bg-cyan-300/10 blur-3xl" aria-hidden="true" />
        <div className="relative max-w-3xl">
          <p className="section-kicker">Observability for remembered selves</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-mist/80">
              Pensieve / 冥想盆
            </span>
            <span className="rounded-full border border-glow/20 bg-glow/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-cyan-100">
              {mode === "live" ? "Live Reflection" : "Mock Reflection"}
            </span>
          </div>
          <h2 className="section-title mt-5">
            Observe how memory shapes an answer.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
            Pensieve helps users inspect activated traces, understand why they surfaced, and carry that context across
            different views of the same session.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/surface-model"
              className="rounded-full border border-glow/25 bg-gradient-to-r from-glow/15 to-cyan-300/10 px-5 py-3 text-sm text-cyan-100 transition hover:border-glow/55 hover:bg-glow/20 hover:shadow-pulse"
            >
              Enter Surface Model
            </Link>
            <Link
              href="/user-view"
              className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-white transition hover:border-white/25 hover:bg-white/10"
            >
              Browse User View
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="mystic-panel rounded-[1.7rem] p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-mist/70">Current mode</p>
          <p className="mt-3 font-display text-3xl text-white">{mode === "live" ? "Live" : "Mock"}</p>
          <p className="mt-2 text-sm text-slate-300">{isLoading ? "Fetching live answer" : "Session ready"}</p>
        </div>
        <div className="mystic-panel rounded-[1.7rem] p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-mist/70">Visible memories</p>
          <p className="mt-3 font-display text-3xl text-white">{session.result.memories.length}</p>
          <p className="mt-2 text-sm text-slate-300">{session.result.hiddenMemoryIds.length} hidden in session</p>
        </div>
        <div className="mystic-panel rounded-[1.7rem] p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-mist/70">Current query</p>
          <p className="mt-2 text-sm leading-7 text-slate-300">{session.query || "No query yet."}</p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="mystic-panel rounded-[2rem] p-6">
          <div className="mystic-line pb-4">
            <p className="text-xs uppercase tracking-[0.24em] text-mist/70">Overview</p>
            <h3 className="mt-2 font-display text-3xl font-semibold text-white">Latest answer</h3>
          </div>
          <p className="mt-6 text-base leading-8 text-slate-200">{session.result.response}</p>
          {liveSummary ? (
            <>
              <div className="silk-divider mt-6" />
              <p className="mt-6 text-sm uppercase tracking-[0.18em] text-glow/80">Memory summary</p>
              <p className="mt-3 text-base leading-8 text-slate-300">{liveSummary}</p>
            </>
          ) : null}
        </div>

        <div className="space-y-4">
          {destinations.map((destination) => (
            <Link
              key={destination.href}
              href={destination.href}
              className="mystic-panel block rounded-[1.7rem] p-5 transition hover:border-glow/30 hover:bg-white/[0.06]"
            >
              <p className="text-xs uppercase tracking-[0.24em] text-mist/70">Entry point</p>
              <h3 className="mt-2 font-display text-2xl text-white">{destination.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{destination.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
