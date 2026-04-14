export function GuidePanel() {
  return (
    <div className="space-y-6">
      <section className="mystic-panel rounded-[2rem] px-6 py-8 md:px-8">
        <p className="section-kicker">Guide</p>
        <h2 className="section-title mt-4">How to read the basin</h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
          Pensieve is a memory observability interface. It does not reveal a real hidden chain of thought. Instead, it
          offers a legible surface for reasoning about what a model appears to remember and how that memory influences
          its answer.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="mystic-panel rounded-[1.8rem] p-6">
          <h3 className="font-display text-2xl text-white">What a memory unit means</h3>
          <div className="silk-divider mt-4" />
          <div className="mt-4 grid gap-3 text-sm leading-7 text-slate-300">
            <p>A memory unit is a compact record with content, keywords, timestamps, risk level, and a relevance score.</p>
            <p>These records stay intact at the base layer. Session controls only add reversible modifiers on top.</p>
            <p>Risk badges indicate how sensitive or consequential a surfaced memory may be.</p>
          </div>
        </article>

        <article className="mystic-panel rounded-[1.8rem] p-6">
          <h3 className="font-display text-2xl text-white">How relevance is computed</h3>
          <div className="silk-divider mt-4" />
          <div className="mt-4 grid gap-3 text-sm leading-7 text-slate-300">
            <p>The current query is tokenized into words.</p>
            <p>Each token is compared to each memory&apos;s keywords to produce a local influence score between 0 and 1.</p>
            <p>The ranking and heatmap are simulated observability surfaces, not a live retrieval trace.</p>
          </div>
        </article>

        <article className="mystic-panel rounded-[1.8rem] p-6">
          <h3 className="font-display text-2xl text-white">What the controls mean</h3>
          <div className="silk-divider mt-4" />
          <div className="mt-4 grid gap-3 text-sm leading-7 text-slate-300">
            <p><span className="text-white">Soften</span> lowers a memory&apos;s future influence without deleting it.</p>
            <p><span className="text-white">Forget</span> hides a memory from the current session.</p>
            <p><span className="text-white">Pin</span> keeps a memory at the top of the ranked list.</p>
            <p><span className="text-white">Restore Forgotten</span> reveals hidden memories again.</p>
            <p><span className="text-white">Undo</span> rewinds the previous reversible action.</p>
          </div>
        </article>

        <article className="mystic-panel rounded-[1.8rem] p-6">
          <h3 className="font-display text-2xl text-white">Mock vs live</h3>
          <div className="silk-divider mt-4" />
          <div className="mt-4 grid gap-3 text-sm leading-7 text-slate-300">
            <p>Mock mode keeps everything local and uses the existing simulated response behavior.</p>
            <p>Live mode sends the query and ranked memories to the server for a structured explainability response.</p>
            <p>The heatmap remains simulated until connected to a real retrieval or memory system.</p>
          </div>
        </article>
      </section>
    </div>
  );
}
