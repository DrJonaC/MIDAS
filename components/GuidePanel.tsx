export function GuidePanel() {
  return (
    <div className="space-y-6">
      <section className="mystic-panel rounded-[2rem] px-6 py-8 md:px-8">
        <p className="section-kicker">Guide</p>
        <h2 className="section-title mt-4">How MIDAS detects context drift</h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
          MIDAS — Memory Integrity and Drift-Aware Safeguard — is a privacy security layer for agentic systems. It
          checks every stored memory against the context in which it was collected and flags cases where an agent is
          about to use information outside its original permitted flow.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="mystic-panel rounded-[1.8rem] p-6">
          <h3 className="font-display text-2xl text-white">What a Context-Drift Violation is</h3>
          <div className="silk-divider mt-4" />
          <div className="mt-4 grid gap-3 text-sm leading-7 text-slate-300">
            <p>A Context-Drift Violation (CDV) occurs when a memory entry originally collected under one context is activated in a query belonging to a different, incompatible context.</p>
            <p>Each memory entry carries an <span className="text-white">origin context</span> — the transmission principle under which it was captured.</p>
            <p>At query time, MIDAS compares the query&apos;s operative context against each entry&apos;s origin context and raises a violation when contextual integrity is broken.</p>
          </div>
        </article>

        <article className="mystic-panel rounded-[1.8rem] p-6">
          <h3 className="font-display text-2xl text-white">Transmission principle &amp; the TP poset</h3>
          <div className="silk-divider mt-4" />
          <div className="mt-4 grid gap-3 text-sm leading-7 text-slate-300">
            <p>A <span className="text-white">transmission principle</span> (TP) is the norm governing how information may flow — consent, confidentiality, professional duty, public record, and so on.</p>
            <p>TPs form a <span className="text-white">partial order</span> (poset): some are strictly more restrictive than others; some are incomparable.</p>
            <p>A memory captured under TP<sub>origin</sub> may only flow into a query whose TP dominates TP<sub>origin</sub> in the poset. Otherwise the flow is a violation.</p>
          </div>
        </article>

        <article className="mystic-panel rounded-[1.8rem] p-6">
          <h3 className="font-display text-2xl text-white">Severity levels</h3>
          <div className="silk-divider mt-4" />
          <div className="mt-4 grid gap-3 text-sm leading-7 text-slate-300">
            <p><span className="rounded-full border border-rose-400/50 bg-rose-400/20 px-2 py-0.5 text-[11px] font-medium text-rose-200">🚨 Critical</span> — the query context is strictly incomparable to or strictly less restrictive than origin. The agent would leak protected information.</p>
            <p><span className="rounded-full border border-amber-400/40 bg-amber-400/15 px-2 py-0.5 text-[11px] font-medium text-amber-200">⚠ Warning</span> — the query context is adjacent to or nearly compatible with origin. The flow is borderline and warrants review.</p>
            <p><span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[11px] font-medium text-emerald-200">✓ Clean</span> — the query context dominates origin in the poset. The flow respects contextual integrity.</p>
          </div>
        </article>

        <article className="mystic-panel rounded-[1.8rem] p-6">
          <h3 className="font-display text-2xl text-white">Controls &amp; detection modes</h3>
          <div className="silk-divider mt-4" />
          <div className="mt-4 grid gap-3 text-sm leading-7 text-slate-300">
            <p><span className="text-white">Soften</span> lowers a memory entry&apos;s future activation weight without deleting it.</p>
            <p><span className="text-white">Forget</span> removes a memory entry from the current scan.</p>
            <p><span className="text-white">Pin</span> keeps a memory entry at the top of the flagged list.</p>
            <p><span className="text-white">Restore</span> and <span className="text-white">Undo</span> revert any session-level change.</p>
            <p><span className="text-white">Mock Mode</span> runs CDV detection locally; <span className="text-white">Live Mode</span> delegates drift analysis to the server-side LLM integration.</p>
          </div>
        </article>
      </section>
    </div>
  );
}
