import { ExternalLink } from 'lucide-react';
import type { Block } from '@/data/projects';

// Colour roles: NPS segments are semantic (detractor / passive / promoter); tiers use one blue ramp.
const SEGMENT_COLOURS: Record<string, string> = {
  Detractor: 'var(--color-neg)', Passive: 'var(--color-neu)', Promoter: 'var(--color-pos)',
  Value: '#bcd0ff', 'Mid-market': '#5b85f0', Premium: '#1e3a8a'
};
const segmentText = (key: string) => (['Passive', 'Value'].includes(key) ? '#0c1d2e' : '#fff');
const fmt = (v: number, unit = '') => `${v > 0 && unit === '' ? '' : ''}${Number.isInteger(v) ? v : v.toFixed(1)}${unit}`;

function Frame({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <figure className="card p-5 sm:p-6">
      <figcaption className="mb-5">
        <h3 className="text-[17px] font-bold">{title}</h3>
        {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
      </figcaption>
      {children}
    </figure>
  );
}

function Bars({ b }: { b: Extract<Block, { kind: 'bars' }> }) {
  const max = b.max ?? Math.max(...b.data.map((d) => Math.abs(d.value)));
  return (
    <Frame title={b.title} subtitle={b.subtitle}>
      <ul className="space-y-3">
        {b.data.map((d, i) => {
          const pct = Math.min(100, (Math.abs(d.value) / max) * 100);
          const label = `${d.value > 0 && b.diverging ? '+' : ''}${fmt(d.value, b.unit)}`;
          return (
            <li key={d.label} className="grid grid-cols-[minmax(0,9.5rem)_minmax(0,1fr)] items-center gap-3 text-sm sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)]" title={`${d.label}: ${label}${d.note ? ` (${d.note})` : ''}`}>
              <span className="truncate text-ink-2">{d.label}{d.note && <span className="ml-1 hidden text-xs text-muted sm:inline">· {d.note}</span>}</span>
              {b.diverging ? (
                <span className="relative grid h-7 grid-cols-2">
                  <span className="relative flex justify-end border-r border-ink/30">
                    {d.value < 0 && <span className="bar-grow-neg h-full rounded-l-md bg-neg" style={{ width: `${pct}%`, animationDelay: `${i * 60}ms` }} />}
                    {d.value < 0 && <span className="absolute inset-y-0 flex items-center text-xs font-semibold tabular-nums" style={{ right: `calc(${pct}% + 6px)` }}>{label}</span>}
                  </span>
                  <span className="relative flex">
                    {d.value >= 0 && <span className="bar-grow h-full rounded-r-md bg-pos" style={{ width: `${Math.max(pct, 0.8)}%`, animationDelay: `${i * 60}ms` }} />}
                    {d.value >= 0 && <span className="absolute inset-y-0 flex items-center text-xs font-semibold tabular-nums" style={{ left: `calc(${pct}% + 6px)` }}>{label}</span>}
                  </span>
                </span>
              ) : (
                <span className="relative flex h-7 items-center">
                  <span className="bar-grow h-full rounded-r-md bg-brand" style={{ width: `${pct}%`, animationDelay: `${i * 60}ms` }} />
                  <span className="ml-2 shrink-0 text-xs font-semibold tabular-nums">{label}</span>
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </Frame>
  );
}

function Stacked({ b }: { b: Extract<Block, { kind: 'stacked' }> }) {
  return (
    <Frame title={b.title} subtitle={b.subtitle}>
      <ul className="mb-4 flex flex-wrap gap-4 text-xs text-ink-2" aria-label="Legend">
        {b.keys.map((k) => <li key={k} className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm" style={{ background: SEGMENT_COLOURS[k] }} />{k}</li>)}
      </ul>
      <ul className="space-y-3">
        {b.data.map((row) => (
          <li key={row.label} className="grid grid-cols-[minmax(0,7.5rem)_minmax(0,1fr)] items-center gap-3 text-sm sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)]">
            <span className="truncate text-ink-2">{row.label}</span>
            <span className="flex h-8 overflow-hidden rounded-md">
              {b.keys.map((k) => {
                const v = row.segments.find((s) => s.key === k)?.value ?? 0;
                return (
                  <span key={k} className="flex items-center justify-center border-r-2 border-white text-[11px] font-semibold tabular-nums last:border-r-0"
                    style={{ width: `${v}%`, background: SEGMENT_COLOURS[k], color: segmentText(k) }} title={`${row.label} · ${k}: ${v}%`}>
                    {v >= 9 ? `${Math.round(v)}%` : ''}
                  </span>
                );
              })}
            </span>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

function cellColour(v: number, min: number, max: number, diverging?: boolean) {
  if (diverging) {
    const t = Math.max(-1, Math.min(1, v / Math.max(Math.abs(min), Math.abs(max))));
    const [r, g, b] = t < 0 ? [214, 69, 97] : [15, 157, 138];
    const a = 0.12 + Math.abs(t) * 0.78;
    return { background: `rgba(${r},${g},${b},${a})`, color: a > 0.55 ? '#fff' : '#0c1d2e' };
  }
  const t = Math.max(0, Math.min(1, (v - min) / (max - min)));
  const a = 0.08 + t * 0.85;
  return { background: `rgba(29,78,216,${a})`, color: a > 0.55 ? '#fff' : '#0c1d2e' };
}

function Heatmap({ b }: { b: Extract<Block, { kind: 'heatmap' }> }) {
  return (
    <Frame title={b.title} subtitle={b.subtitle}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] border-separate border-spacing-1 text-sm">
          <thead>
            <tr><th className="text-left font-medium text-muted" scope="col"><span className="sr-only">Segment</span></th>
              {b.cols.map((c) => <th key={c} scope="col" className="px-2 pb-1 text-center text-xs font-semibold text-ink-2">{c}</th>)}</tr>
          </thead>
          <tbody>
            {b.rows.map((r) => (
              <tr key={r.label}>
                <th scope="row" className="whitespace-nowrap pr-3 text-left font-medium text-ink-2">{r.label}</th>
                {r.values.map((v, i) => (
                  <td key={i} className="rounded-md px-2 py-2.5 text-center font-semibold tabular-nums" style={cellColour(v, b.min, b.max, b.diverging)} title={`${r.label} · ${b.cols[i]}: ${v}`}>
                    {b.diverging && v > 0 ? '+' : ''}{v.toFixed(1)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Frame>
  );
}

function Table({ b }: { b: Extract<Block, { kind: 'table' }> }) {
  return (
    <Frame title={b.title} subtitle={b.subtitle}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-sm">
          <thead><tr className="border-b border-line">{b.head.map((h) => <th key={h} scope="col" className="py-2 pr-4 text-left text-xs font-semibold text-muted">{h}</th>)}</tr></thead>
          <tbody>
            {b.rows.map((r, i) => (
              <tr key={i} className="border-b border-line last:border-0">
                {r.map((c, j) => <td key={j} className={`py-2.5 pr-4 align-top ${typeof c === 'number' || /^AED|^\d+%?$/.test(String(c)) ? 'whitespace-nowrap tabular-nums' : ''} ${j === 0 ? 'font-medium text-ink' : 'text-ink-2'}`}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Frame>
  );
}

function Facts({ b }: { b: Extract<Block, { kind: 'facts' }> }) {
  return (
    <Frame title={b.title} subtitle={b.subtitle}>
      <ol className="space-y-4">
        {b.items.map((f, i) => (
          <li key={i} className="flex gap-3 text-sm">
            <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-soft text-xs font-bold text-brand">{i + 1}</span>
            <span>
              <span className="text-ink">{f.text}</span>
              <span className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                {f.sources.map((s) => <a key={s.url} href={s.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-medium text-brand hover:underline">{s.label}<ExternalLink size={12} aria-hidden /></a>)}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </Frame>
  );
}

export function ChartBlock({ block }: { block: Block }) {
  switch (block.kind) {
    case 'bars': return <Bars b={block} />;
    case 'stacked': return <Stacked b={block} />;
    case 'heatmap': return <Heatmap b={block} />;
    case 'table': return <Table b={block} />;
    case 'facts': return <Facts b={block} />;
  }
}
