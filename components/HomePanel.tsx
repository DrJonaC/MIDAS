"use client";

import Link from "next/link";
import { QueryPanel } from "@/components/QueryPanel";
import { usePensieve } from "@/lib/session";

const destinations = [
  {
    href: "/guide",
    title: "Read the Guide",
    description: "Understand CDV detection, the TP poset, severity levels, and reversible controls."
  },
  {
    href: "/user-view",
    title: "Open Privacy Dashboard",
    description: "Inspect flagged memory entries and the contextual integrity analysis."
  },
  {
    href: "/surface-model",
    title: "Open Detection Surface",
    description: "Submit queries, run live CDV detection, and inspect the token-to-memory heatmap."
  }
];

export function HomePanel() {
  const { mode, session, narrative, isLoading } = usePensieve();

  return (
    <div className="space-y-8">
      <section className="mystic-panel relative overflow-hidden rounded-[2.2rem] px-6 py-8 md:px-8 md:py-10">
        <div className="absolute inset-y-0 right-[-10%] w-[40%] rounded-full bg-gold/10 blur-3xl" aria-hidden="true" />
        <div className="relative max-w-3xl">
          <p className="section-kicker">Privacy surveillance for agentic memory</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-gold/20 bg-black-surface px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-mist">
              MIDAS
            </span>
            <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-gold">
              {mode === "live" ? "Live Detection" : "Mock Detection"}
            </span>
          </div>
          <h2 className="section-title mt-5">
            Guard what your agent knows about you.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
            MIDAS detects Context-Drift Violations in real time — surfacing when your agent uses information across
            contexts it was never meant to cross.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/surface-model"
              className="rounded-full border border-gold bg-gold px-5 py-3 text-sm font-semibold text-black transition hover:bg-gold-light hover:shadow-pulse"
            >
              Open Detection Surface
            </Link>
            <Link
              href="/user-view"
              className="rounded-full border border-gold/20 bg-black-surface px-5 py-3 text-sm text-white transition hover:border-gold/40 hover:bg-gold/10"
            >
              Open Privacy Dashboard
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="mystic-panel rounded-[1.7rem] p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-gold">Detection mode</p>
          <p className="mt-3 font-display text-3xl text-white">{mode === "live" ? "Live" : "Mock"}</p>
          <p className="mt-2 text-sm text-slate-300">{isLoading ? "Running live detection" : "Detection ready"}</p>
        </div>
        <div className="mystic-panel rounded-[1.7rem] p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-gold">Tracked memories</p>
          <p className="mt-3 font-display text-3xl text-white">{session.result.memories.length}</p>
          <p className="mt-2 text-sm text-slate-300">{session.result.hiddenMemoryIds.length} hidden from scan</p>
        </div>
        <div className="mystic-panel rounded-[1.7rem] p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-gold">Current query</p>
          <p className="mt-2 text-sm leading-7 text-slate-300">{session.query || "No query yet."}</p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="mystic-panel rounded-[2rem] p-6">
          <div className="mystic-line pb-4">
            <p className="text-xs uppercase tracking-[0.24em] text-gold">Overview</p>
            <h3 className="mt-2 font-display text-3xl font-semibold text-white">Latest answer</h3>
          </div>
          <p className="mt-6 text-base leading-8 text-slate-200">{session.result.response}</p>
          {narrative.summary ? (
            <>
              <div className="silk-divider mt-6" />
              <p className="mt-6 text-sm uppercase tracking-[0.18em] text-gold">Detection summary</p>
              <p className="mt-3 text-base leading-8 text-slate-300">{narrative.summary}</p>
            </>
          ) : null}
        </div>

        <div className="space-y-4">
          {destinations.map((destination) => (
            <Link
              key={destination.href}
              href={destination.href}
              className="mystic-panel block rounded-[1.7rem] p-5 transition hover:border-gold/40 hover:bg-gold/5"
            >
              <p className="text-xs uppercase tracking-[0.24em] text-gold">Entry point</p>
              <h3 className="mt-2 font-display text-2xl text-white">{destination.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{destination.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <QueryPanel />
    </div>
  );
}
