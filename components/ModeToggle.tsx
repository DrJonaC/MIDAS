"use client";

import { usePensieve } from "@/lib/session";

export function ModeToggle() {
  const { mode, setMode } = usePensieve();

  return (
    <div className="mystic-panel inline-flex rounded-full p-1">
      {(["mock", "live"] as const).map((value) => {
        const active = mode === value;

        return (
          <button
            key={value}
            type="button"
            onClick={() => setMode(value)}
            className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.22em] transition ${
              active ? "bg-gold text-black shadow-pulse" : "text-mist hover:text-gold"
            }`}
          >
            {value === "mock" ? "Mock Mode" : "Live LLM"}
          </button>
        );
      })}
    </div>
  );
}
