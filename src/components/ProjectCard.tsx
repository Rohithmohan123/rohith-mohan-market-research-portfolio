import Link from 'next/link';
import { ArrowRight, Lock } from 'lucide-react';
import type { Project } from '@/data/projects';

export function ProjectCard({ p, index }: { p: Project; index: number }) {
  return (
    <Link href={`/projects/${p.slug}/`} className="card group flex h-full flex-col p-6 transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-[0_18px_40px_-20px_rgba(12,29,46,0.35)]">
      <div className="mb-5 flex items-center justify-between gap-3">
        <span className="text-xs font-semibold text-brand">{String(index + 1).padStart(2, '0')} · {p.sector}</span>
        {p.confidential && <span className="inline-flex items-center gap-1 rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold text-white"><Lock size={11} aria-hidden /> Confidential client</span>}
      </div>
      <h3 className="text-xl font-bold leading-snug group-hover:text-brand">{p.title}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{p.short}</p>
      <dl className="mt-5 grid grid-cols-2 gap-3">
        {p.kpis.slice(0, 2).map((k) => (
          <div key={k.label} className="rounded-xl bg-surface px-3 py-2.5">
            <dt className="text-[11px] font-medium text-muted">{k.label}</dt>
            <dd className="font-display text-lg font-bold tabular-nums">{k.value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-5 flex flex-wrap gap-1.5">{p.tags.slice(0, 4).map((t) => <span key={t} className="chip py-0.5 text-xs">{t}</span>)}</div>
      <div className="mt-auto flex items-center justify-between pt-6 text-sm">
        <span />
        <span className="inline-flex items-center gap-1 font-semibold text-brand">Case study <ArrowRight size={16} className="transition group-hover:translate-x-0.5" aria-hidden /></span>
      </div>
    </Link>
  );
}
