"use client";

import { usePensieve } from "@/lib/session";

export function SessionControls() {
  const { resetView, restoreForgotten, undo, session } = usePensieve();

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={resetView}
        className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white transition hover:border-white/25 hover:bg-white/10"
      >
        Reset View
      </button>
      <button
        type="button"
        onClick={restoreForgotten}
        className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white transition hover:border-white/25 hover:bg-white/10"
      >
        Restore Forgotten
      </button>
      <button
        type="button"
        onClick={undo}
        disabled={session.history.length === 0}
        className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white transition hover:border-white/25 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Undo
      </button>
    </div>
  );
}
