import { HeatmapCell, ScoredMemory } from "@/lib/memory";

type HeatmapProps = {
  tokens: string[];
  memories: ScoredMemory[];
  heatmap: HeatmapCell[];
};

function getCellScore(heatmap: HeatmapCell[], token: string, memoryId: string): number {
  return heatmap.find((cell) => cell.token === token && cell.memoryId === memoryId)?.score ?? 0;
}

function getCellColor(score: number): string {
  if (score >= 0.9) return "bg-cyan-300/90";
  if (score >= 0.6) return "bg-cyan-400/60";
  if (score >= 0.3) return "bg-cyan-500/35";
  if (score > 0) return "bg-slate-700/80";
  return "bg-slate-900/80";
}

export function Heatmap({ tokens, memories, heatmap }: HeatmapProps) {
  if (tokens.length === 0 || memories.length === 0) {
    return (
      <div className="mystic-panel rounded-[1.9rem] p-6">
        <p className="text-sm text-mist/80">Submit a query to render token-to-memory influence.</p>
      </div>
    );
  }

  return (
    <div className="mystic-panel rounded-[1.9rem] p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-mist/70">Model View</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-white">Influence Heatmap</h2>
        </div>
        <div className="text-right text-xs text-mist/70">
          <p>Columns: input tokens</p>
          <p>Rows: memory units</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-[1.5rem] border border-white/10 bg-slate-950/35 p-3">
        <div
          className="grid min-w-max gap-2"
          style={{ gridTemplateColumns: `220px repeat(${tokens.length}, minmax(54px, 1fr))` }}
        >
          <div />
          {tokens.map((token) => (
            <div
              key={token}
              className="rounded-xl border border-white/10 bg-slate-950/60 px-2 py-3 text-center text-xs text-mist shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
            >
              {token}
            </div>
          ))}

          {memories.map((memory) => (
            <div key={memory.id} className="contents">
              <div className="rounded-2xl border border-white/10 bg-slate-950/50 px-3 py-4 text-sm leading-6 text-slate-200">
                {memory.content}
              </div>
              {tokens.map((token) => {
                const score = getCellScore(heatmap, token, memory.id);
                return (
                  <div
                    key={`${memory.id}-${token}`}
                    title={`Token "${token}" activates Memory "${memory.content}" with score ${score.toFixed(2)}`}
                    className={`flex aspect-square items-center justify-center rounded-2xl border border-white/5 text-[11px] text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] ${getCellColor(score)}`}
                  >
                    {score.toFixed(2)}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
