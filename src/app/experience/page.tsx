import type { Metadata } from 'next';
import Link from 'next/link';
import { Award, Download, GraduationCap } from 'lucide-react';
import { projects } from '@/data/projects';
import { asset, certifications, education, experience, site, skillGroups } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Experience & education',
  description: 'Professional experience, education, certifications and skills of Rohith Mohan, Market Research Analyst.'
};

export default function ExperiencePage() {
  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="wrap flex flex-wrap items-end justify-between gap-6 py-14">
          <div>
            <p className="eyebrow">Experience</p>
            <h1 className="mt-2 text-4xl font-extrabold sm:text-5xl">Experience & education</h1>
            <p className="mt-4 max-w-[60ch] text-lg text-ink-2">Market research and customer-insight work, backed by a computer applications degree and hands-on data skills.</p>
          </div>
          <a href={asset(site.cv)} className="btn btn-primary" download><Download size={18} aria-hidden /> Download CV (PDF)</a>
        </div>
      </section>

      <section className="wrap grid gap-14 py-14 lg:grid-cols-[1.35fr_1fr]">
        <div>
          <h2 className="text-2xl font-bold">Professional experience</h2>
          <ol className="mt-8 space-y-10 border-l-2 border-line pl-7">
            {experience.map((e) => (
              <li key={e.org} className="relative">
                <span className="absolute -left-[37px] top-1 h-5 w-5 rounded-full border-4 border-white bg-brand shadow" aria-hidden />
                <p className="text-sm font-semibold text-brand">{e.period || 'Internship'}</p>
                <h3 className="mt-1 text-xl font-bold">{e.role}</h3>
                <p className="text-ink-2">{e.org} · {e.place}</p>
                {e.points.length > 0 && <ul className="mt-4 space-y-2 text-ink-2">{e.points.map((pt) => <li key={pt} className="flex gap-2"><span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink-2" />{pt}</li>)}</ul>}
                {e.projects.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold">Related case studies</p>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {e.projects.map((slug) => { const p = projects.find((x) => x.slug === slug)!; return <li key={slug}><Link href={`/projects/${slug}/`} className="chip hover:border-brand hover:text-brand">{p.title}</Link></li>; })}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ol>
          <p className="mt-8 text-sm text-muted">The mystery shopping programme was confidential research; the client and findings are not disclosed.</p>
        </div>

        <div className="space-y-10">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-bold"><GraduationCap size={24} className="text-brand" aria-hidden /> Education</h2>
            <ul className="mt-6 space-y-4">
              {education.map((ed) => (
                <li key={ed.degree} className="card p-5">
                  <p className="text-sm text-muted">{ed.period}</p>
                  <h3 className="mt-1 font-bold">{ed.degree}</h3>
                  <p className="text-ink-2">{ed.school}</p>
                  {ed.grade && <p className="mt-2 inline-block rounded-md bg-brand-soft px-2 py-0.5 text-sm font-semibold text-brand">{ed.grade}</p>}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-bold"><Award size={24} className="text-brand" aria-hidden /> Certifications</h2>
            <ul className="mt-6 divide-y divide-line rounded-2xl border border-line">
              {certifications.map((c) => (
                <li key={c.name} className="px-5 py-3.5">
                  <p className="font-semibold">{c.name}</p>
                  {(c.issuer || c.year) && <p className="text-sm text-muted">{[c.issuer, c.year].filter(Boolean).join(' · ')}</p>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-surface py-14">
        <div className="wrap">
          <h2 className="text-2xl font-bold">Skills & tools</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {skillGroups.map((g) => (
              <div key={g.title} className="card p-5">
                <h3 className="font-bold">{g.title}</h3>
                <ul className="mt-3 space-y-1.5 text-sm text-ink-2">{g.items.map((i) => <li key={i}>{i}</li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
