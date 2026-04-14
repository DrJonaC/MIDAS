"use client";

type InputBoxProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  modeLabel?: string;
};

export function InputBox({ value, onChange, onSubmit, isLoading = false, modeLabel }: InputBoxProps) {
  return (
    <div className="mystic-panel rounded-[1.75rem] p-4 md:p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <label htmlFor="query" className="block text-sm uppercase tracking-[0.24em] text-mist/80">
          Query
        </label>
        {modeLabel ? (
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-mist/80 shadow-[0_0_20px_rgba(114,224,209,0.08)]">
            {modeLabel}
          </span>
        ) : null}
      </div>
      <div className="flex flex-col gap-3 md:flex-row">
        <input
          id="query"
          value={value}
          disabled={isLoading}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onSubmit();
            }
          }}
          placeholder="Ask something..."
          className="min-h-14 flex-1 rounded-[1.25rem] border border-white/10 bg-slate-950/70 px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-glow/60 focus:shadow-pulse disabled:cursor-not-allowed disabled:opacity-70"
        />
        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          className="rounded-[1.25rem] border border-glow/30 bg-gradient-to-r from-glow/15 to-cyan-300/10 px-5 py-3 text-sm font-medium text-white transition hover:border-glow/60 hover:bg-glow/25 hover:shadow-pulse disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? "Consulting the basin..." : "Surface Memory"}
        </button>
      </div>
    </div>
  );
}
