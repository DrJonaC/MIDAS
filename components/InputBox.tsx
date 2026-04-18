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
        <label htmlFor="query" className="block text-sm uppercase tracking-[0.24em] text-gold">
          Query
        </label>
        {modeLabel ? (
          <span className="rounded-full border border-gold/20 bg-black-surface px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-mist shadow-[0_0_20px_rgba(212,175,55,0.08)]">
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
          className="min-h-14 flex-1 rounded-[1.25rem] border border-gold/20 bg-black-surface px-4 text-sm text-white outline-none transition placeholder:text-mist focus:border-gold/60 focus:shadow-pulse disabled:cursor-not-allowed disabled:opacity-70"
        />
        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          className="rounded-[1.25rem] border border-gold bg-gold px-5 py-3 text-sm font-semibold text-black transition hover:bg-gold-light hover:shadow-pulse disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? "Consulting the basin..." : "Surface Memory"}
        </button>
      </div>
    </div>
  );
}
