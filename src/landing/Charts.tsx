// Hand-built charts. Every width and height is value / axis max, so the marks are to scale.

export interface Bar {
  label: string;
  value: number;
  display: string;
  tone: "seal" | "ink" | "ctx";
}

export function BarChart({ bars, max, ticks, label }: { bars: Bar[]; max: number; ticks: string[]; label: string }) {
  return (
    <div className="bars" role="img" aria-label={label}>
      {bars.map((b) => (
        <div key={b.label} title={`${b.label}: ${b.display}`}>
          <div className="bar-label">
            <span>{b.label}</span>
            <span>{b.display}</span>
          </div>
          <div className="track">
            <div className={`fill ${b.tone === "ctx" ? "" : b.tone}`} style={{ width: `${(b.value / max) * 100}%` }} />
          </div>
        </div>
      ))}
      <div className="axis">
        {ticks.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
    </div>
  );
}

export function UnitChart({ on, label }: { on: number; label: string }) {
  return (
    <div className="units" role="img" aria-label={label}>
      {Array.from({ length: 100 }, (_, i) => (
        <i key={i} className={i < on ? "on" : undefined} />
      ))}
    </div>
  );
}

export interface StackedYear {
  year: string;
  ctx: number;
  grow: number;
}

export function StackedColumns({ data, max, ticks, label, ctxName, growName }: {
  data: StackedYear[];
  max: number;
  ticks: number[];
  label: string;
  ctxName: string;
  growName: string;
}) {
  const pct = (v: number) => `${(v / max) * 100}%`;
  return (
    <div className="stack">
      <div className="legend">
        <span><i style={{ background: "var(--color-stone)" }} />{ctxName}</span>
        <span><i style={{ background: "var(--color-seal)" }} />{growName}</span>
      </div>
      <div className="columns" role="img" aria-label={label}>
        <div className="yaxis">
          {ticks.map((t) => (
            <span key={t} style={{ bottom: pct(t) }}>{t}</span>
          ))}
        </div>
        <div className="plot">
          {ticks.slice(1).map((t) => (
            <div key={t} className="gridline" style={{ bottom: pct(t) }} />
          ))}
          {data.map((d) => (
            <div className="col" key={d.year}>
              <div className="seg ctx" style={{ height: pct(d.ctx) }} title={`${d.year} · ${ctxName}: ${d.ctx}`} />
              <div className="seg grow" style={{ height: pct(d.grow) }} title={`${d.year} · ${growName}: ${d.grow}`} />
            </div>
          ))}
        </div>
        <div className="xlabels">
          {data.map((d) => (
            <span key={d.year}>
              {d.year}
              <br />
              {d.ctx + d.grow}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
