import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle2, Download, Info, Lock } from 'lucide-react';
import { GithubIcon } from '@/components/BrandIcons';
import { ChartBlock } from '@/components/Charts';
import { getProject, projects } from '@/data/projects';
import { asset, site } from '@/lib/site';

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProject((await params).slug);
  return p ? { title: p.title, description: p.short, openGraph: { type: 'article', title: `${p.title} · ${site.name}`, description: p.short, url: `${site.url}/projects/${p.slug}/`, images: [{ url: `${site.url}/og/${p.slug}.jpg`, width: 1200, height: 630, alt: p.title }] }, twitter: { card: 'summary_large_image' } } : {};
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-line py-12 first:border-0 first:pt-0">
      <h2 className="mb-5 text-2xl font-bold">{title}</h2>
      {children}
    </section>
  );
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProject((await params).slug);
  if (!p) notFound();
  const i = projects.indexOf(p);
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];
  const toc = [['problem', 'Problem'], ['background', 'Background'], ['methodology', 'Methodology'], ['dashboard', 'Dashboard'], ['findings', 'Findings'], ['deliverables', 'Deliverables']];

  return (
    <article>
      <header className="border-b border-line bg-surface">
        <div className="wrap py-12 md:py-16">
          <Link href="/projects/" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-brand"><ArrowLeft size={16} aria-hidden /> All projects</Link>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-brand">{p.sector}</span>
            {p.confidential && <span className="inline-flex items-center gap-1 rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold text-white"><Lock size={11} aria-hidden /> Client not disclosed</span>}
            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-800">{p.dataLabel}</span>
          </div>
          <h1 className="mt-3 max-w-[24ch] text-4xl font-extrabold leading-[1.08] sm:text-5xl">{p.title}</h1>
          <p className="mt-4 max-w-[66ch] text-lg text-ink-2">{p.short}</p>
          <p className="mt-2 text-sm text-muted">Background: {p.context}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href={asset(p.report)} className="btn btn-primary" download><Download size={18} aria-hidden /> Sample report (PDF)</a>
            <a href={p.repo} className="btn btn-ghost" target="_blank" rel="noreferrer"><GithubIcon size={16} /> Code & data on GitHub</a>
            {p.extraDownloads?.map((d) => <a key={d.href} href={asset(d.href)} className="btn btn-ghost" download><Download size={18} aria-hidden /> {d.label}</a>)}
          </div>
          <dl className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {p.kpis.map((k) => (
              <div key={k.label} className="card px-4 py-4">
                <dt className="text-xs font-medium text-muted">{k.label}</dt>
                <dd className="mt-1 font-display text-2xl font-bold tabular-nums">{k.value}</dd>
                {k.note && <dd className="mt-0.5 text-xs text-muted">{k.note}</dd>}
              </div>
            ))}
          </dl>
        </div>
      </header>

      <div className="wrap grid gap-12 py-14 lg:grid-cols-[200px_minmax(0,1fr)]">
        <nav aria-label="On this page" className="hidden lg:block">
          <ul className="sticky top-24 space-y-1 border-l border-line text-sm">
            {toc.map(([id, label]) => <li key={id}><a href={`#${id}`} className="-ml-px block border-l-2 border-transparent py-1.5 pl-4 text-muted hover:border-brand hover:text-ink">{label}</a></li>)}
          </ul>
        </nav>

        <div className="min-w-0">
          <div role="note" className="mb-12 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
            <Info size={20} className="mt-0.5 shrink-0" aria-hidden />
            <p><strong>About the data.</strong> {p.dataNote}</p>
          </div>

          <Section id="problem" title="The problem">
            <p className="max-w-[70ch] text-[17px] leading-relaxed text-ink-2">{p.problem}</p>
            <h3 className="mt-8 text-lg font-bold">Objectives</h3>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {p.objectives.map((o) => <li key={o} className="flex gap-2 text-ink-2"><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-pos" aria-hidden />{o}</li>)}
            </ul>
          </Section>

          <Section id="background" title="Project background">
            <ul className="max-w-[70ch] space-y-3 text-ink-2">{p.background.map((b) => <li key={b} className="leading-relaxed">{b}</li>)}</ul>
          </Section>

          <Section id="methodology" title="Research methodology">
            <ol className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {p.methodology.map((m, n) => (
                <li key={m.step} className="card p-5">
                  <span className="font-display text-sm font-bold text-brand">Step {n + 1}</span>
                  <h3 className="mt-1 font-bold">{m.step}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-2">{m.detail}</p>
                </li>
              ))}
            </ol>
          </Section>

          <Section id="dashboard" title="Analysis dashboard">
            <div className="grid gap-5 xl:grid-cols-2">
              {p.dashboard.map((b, n) => (
                <div key={n} className={'min-w-0 ' + (b.kind === 'table' || b.kind === 'facts' || b.kind === 'heatmap' ? 'xl:col-span-2' : '')}><ChartBlock block={b} /></div>
              ))}
            </div>
          </Section>

          <Section id="findings" title="Key findings (demonstration)">
            <ol className="space-y-3">
              {p.findings.map((f, n) => (
                <li key={f} className="flex gap-4 rounded-xl bg-surface p-4">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink text-xs font-bold text-white">{n + 1}</span>
                  <span className="text-ink-2">{f}</span>
                </li>
              ))}
            </ol>
          </Section>

          <Section id="deliverables" title="Implementation & deliverables">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="font-bold">How it was built</h3>
                <ul className="mt-3 space-y-2 text-ink-2">{p.implementation.map((x) => <li key={x} className="flex gap-2"><span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />{x}</li>)}</ul>
              </div>
              <div>
                <h3 className="font-bold">Deliverables</h3>
                <ul className="mt-3 space-y-2 text-ink-2">{p.deliverables.map((x) => <li key={x} className="flex gap-2"><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-pos" aria-hidden />{x}</li>)}</ul>
                <h3 className="mt-6 font-bold">Tools</h3>
                <ul className="mt-3 flex flex-wrap gap-2">{p.tools.map((t) => <li key={t} className="chip">{t}</li>)}</ul>
              </div>
            </div>
          </Section>

          <nav aria-label="More projects" className="mt-6 grid gap-4 border-t border-line pt-10 sm:grid-cols-2">
            <Link href={`/projects/${prev.slug}/`} className="card group p-5 hover:border-brand/40"><span className="flex items-center gap-1 text-xs text-muted"><ArrowLeft size={14} aria-hidden /> Previous</span><span className="mt-1 block font-bold group-hover:text-brand">{prev.title}</span></Link>
            <Link href={`/projects/${next.slug}/`} className="card group p-5 text-right hover:border-brand/40"><span className="flex items-center justify-end gap-1 text-xs text-muted">Next <ArrowRight size={14} aria-hidden /></span><span className="mt-1 block font-bold group-hover:text-brand">{next.title}</span></Link>
          </nav>
        </div>
      </div>
    </article>
  );
}
