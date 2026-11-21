import Link from 'next/link';
import { ArrowRight, Download, GraduationCap, Briefcase, MapPin, FileText } from 'lucide-react';
import { LinkedinIcon } from '@/components/BrandIcons';
import { ProjectCard } from '@/components/ProjectCard';
import { projects } from '@/data/projects';
import { asset, experience, industries, site, skillGroups, targetRoles } from '@/lib/site';

const heroBars = [
  { label: 'Philippines', value: 1.6 }, { label: 'Nigeria', value: -13.1 },
  { label: 'Egypt', value: -16.7 }, { label: 'DR Congo', value: -41.0 }
];

const process = [
  { t: 'Brief & questions', d: 'Turn the business question into research objectives and the decisions the work should support.' },
  { t: 'Research design', d: 'Choose methods and sources, write the questionnaire or audit sheet, and define the sample.' },
  { t: 'Data & fieldwork', d: 'Collect, clean and validate the data, keeping a log of every correction.' },
  { t: 'Analysis', d: 'Cross-tabs, NPS and driver analysis, benchmarking and verbatim coding.' },
  { t: 'Reporting', d: 'Charts, scorecards and a clear written story with recommendations.' }
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line bg-surface">
        <div className="pointer-events-none absolute inset-0 opacity-[0.5] [background-image:linear-gradient(#e2e8ef_1px,transparent_1px),linear-gradient(90deg,#e2e8ef_1px,transparent_1px)] [background-size:44px_44px] [mask-image:linear-gradient(180deg,#000,transparent_85%)]" aria-hidden />
        <div className="wrap relative grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="eyebrow"><MapPin size={14} aria-hidden /> Dubai, UAE · {site.availability}</p>
            <h1 className="mt-4 text-[40px] font-extrabold leading-[1.04] sm:text-5xl lg:text-[58px]">
              Rohith Mohan<span className="mt-2 block text-brand">Market Research Analyst</span>
            </h1>
            <p className="mt-6 max-w-[56ch] text-lg leading-relaxed text-ink-2">
              I turn survey, customer-feedback and market data into clear insight on customer experience, NPS, competitors and market demand, with two years of research work at The Digital Tantra.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Specialisms">
              {['Consumer Insights', 'Customer Experience', 'NPS Analysis', 'Mystery Shopping', 'Competitor Benchmarking'].map((s) => <li key={s} className="chip">{s}</li>)}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/projects/" className="btn btn-primary">View case studies <ArrowRight size={18} aria-hidden /></Link>
              <a href={asset(site.cv)} className="btn btn-ghost" download><Download size={18} aria-hidden /> Download CV</a>
              <a href={site.linkedin} className="btn btn-ghost" target="_blank" rel="noreferrer"><LinkedinIcon size={16} /> LinkedIn</a>
            </div>
          </div>

          {/* Insight panel built from the NPS case study (synthetic data) */}
          <div className="card relative p-6 shadow-[0_30px_70px_-35px_rgba(12,29,46,0.45)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-muted">Case study preview</p>
                <p className="font-display text-lg font-bold">NPS by market, two-wheeler owners</p>
              </div>
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-800">Demo data</span>
            </div>
            <dl className="mt-5 grid grid-cols-3 gap-3">
              {[['NPS', '−16.0'], ['CSAT', '3.78'], ['Responses', '3,112']].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-surface p-3"><dt className="text-[11px] text-muted">{k}</dt><dd className="font-display text-xl font-bold tabular-nums">{v}</dd></div>
              ))}
            </dl>
            <ul className="mt-6 space-y-3">
              {heroBars.map((b) => {
                const w = (Math.abs(b.value) / 45) * 100;
                return (
                  <li key={b.label} className="grid grid-cols-[6.5rem_1fr] items-center gap-3 text-sm">
                    <span className="text-ink-2">{b.label}</span>
                    <span className="grid h-6 grid-cols-2">
                      <span className="flex justify-end border-r border-ink/30">{b.value < 0 && <span className="bar-grow-neg rounded-l bg-neg" style={{ width: `${w}%` }} />}</span>
                      <span className="flex items-center">{b.value >= 0 && <span className="bar-grow h-full rounded-r bg-pos" style={{ width: `${Math.max(w, 2)}%` }} />}<span className="ml-1.5 text-xs font-semibold tabular-nums">{b.value > 0 ? '+' : ''}{b.value}</span></span>
                    </span>
                  </li>
                );
              })}
            </ul>
            <Link href="/projects/automotive-nps-feedback-analysis/" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline">Open the full dashboard <ArrowRight size={15} aria-hidden /></Link>
          </div>
        </div>
      </section>

      {/* At a glance: facts only */}
      <section className="border-b border-line">
        <div className="wrap grid gap-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Briefcase, k: '2 years in research', v: 'The Digital Tantra, Oct 2024 – Oct 2026' },
            { icon: FileText, k: `${projects.length} case studies`, v: 'Automotive, education, public services, retail' },
            { icon: GraduationCap, k: 'MCA · GPA 8.7', v: 'CMS College of Science and Commerce, 2024' },
            { icon: MapPin, k: 'Targeting the UAE', v: 'Dubai, Abu Dhabi and Sharjah' }
          ].map(({ icon: Icon, k, v }) => (
            <div key={k} className="flex gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand"><Icon size={19} aria-hidden /></span>
              <div><p className="font-display font-bold">{k}</p><p className="text-sm text-muted">{v}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* Case studies */}
      <section className="wrap py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Selected work</p>
            <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Research case studies</h2>
            <p className="mt-2 max-w-[62ch] text-ink-2">Each case study explains the problem, method, analysis and deliverables. Dashboards use synthetic data or cited public sources; confidential client data is never shown.</p>
          </div>
          <Link href="/projects/" className="btn btn-ghost">All projects <ArrowRight size={16} aria-hidden /></Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2">{projects.map((p, i) => <ProjectCard key={p.slug} p={p} index={i} />)}</div>
      </section>

      {/* Process */}
      <section className="bg-ink py-20 text-white">
        <div className="wrap">
          <p className="eyebrow text-[#9db6ff]">How I work</p>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">From business question to decision-ready insight</h2>
          <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2 lg:grid-cols-5">
            {process.map((s, i) => (
              <li key={s.t} className="bg-ink p-6">
                <span className="font-display text-sm font-bold text-[#9db6ff]">0{i + 1}</span>
                <h3 className="mt-3 text-lg font-bold">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Skills */}
      <section className="wrap py-20">
        <p className="eyebrow">Skills & tools</p>
        <h2 className="mt-2 text-3xl font-bold sm:text-4xl">What I bring to a research team</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {skillGroups.map((g) => (
            <div key={g.title} className="card p-5">
              <h3 className="font-bold">{g.title}</h3>
              <ul className="mt-3 space-y-1.5 text-sm text-ink-2">{g.items.map((i) => <li key={i}>{i}</li>)}</ul>
            </div>
          ))}
        </div>
      </section>

      {/* Experience preview + roles */}
      <section className="border-y border-line bg-surface py-20">
        <div className="wrap grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="eyebrow">Experience</p>
            <h2 className="mt-2 text-3xl font-bold">Where I have worked</h2>
            <ol className="mt-8 space-y-6 border-l-2 border-line pl-6">
              {experience.map((e) => (
                <li key={e.org} className="relative">
                  <span className="absolute -left-[33px] top-1.5 h-4 w-4 rounded-full border-4 border-surface bg-brand" aria-hidden />
                  <p className="text-sm text-muted">{e.period || 'Internship'}</p>
                  <h3 className="text-lg font-bold">{e.role}</h3>
                  <p className="text-ink-2">{e.org} · {e.place}</p>
                </li>
              ))}
            </ol>
            <Link href="/experience/" className="mt-8 inline-flex items-center gap-1 font-semibold text-brand hover:underline">Full experience, education and certifications <ArrowRight size={16} aria-hidden /></Link>
          </div>
          <div className="space-y-8">
            <div>
              <h3 className="font-bold">Roles I am targeting</h3>
              <ul className="mt-3 flex flex-wrap gap-2">{targetRoles.map((r) => <li key={r} className="chip">{r}</li>)}</ul>
            </div>
            <div>
              <h3 className="font-bold">Industries</h3>
              <ul className="mt-3 flex flex-wrap gap-2">{industries.map((r) => <li key={r} className="chip">{r}</li>)}</ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="wrap pt-20">
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-3xl bg-brand px-8 py-12 text-white sm:px-12">
          <div>
            <h2 className="text-3xl font-bold">Hiring for a research or insights role?</h2>
            <p className="mt-2 max-w-[52ch] text-white/85">I am available immediately for roles in Dubai, Abu Dhabi and Sharjah.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact/" className="btn bg-white text-brand hover:bg-brand-soft">Get in touch</Link>
            <a href={asset(site.cv)} className="btn border border-white/50 text-white hover:bg-white/10" download><Download size={18} aria-hidden /> CV (PDF)</a>
          </div>
        </div>
      </section>
    </>
  );
}
