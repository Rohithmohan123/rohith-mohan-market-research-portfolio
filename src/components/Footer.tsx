import Link from 'next/link';
import { Mail } from 'lucide-react';
import { GithubIcon as Github, LinkedinIcon as Linkedin } from './BrandIcons';
import { site } from '@/lib/site';
import { projects } from '@/data/projects';

export function Footer() {
  return (
    <footer className="mt-24 bg-ink text-white/75">
      <div className="wrap grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-lg font-bold text-white">{site.name}</p>
          <p className="mt-1 text-sm">{site.positioning}</p>
          <p className="mt-4 text-sm">{site.location} · {site.availability}</p>
          <div className="mt-5 flex gap-3">
            <a href={site.linkedin} className="grid h-10 w-10 place-items-center rounded-lg bg-white/10 hover:bg-white/20" aria-label="LinkedIn" target="_blank" rel="noreferrer"><Linkedin size={18} /></a>
            <a href={site.github} className="grid h-10 w-10 place-items-center rounded-lg bg-white/10 hover:bg-white/20" aria-label="GitHub" target="_blank" rel="noreferrer"><Github size={18} /></a>
            {site.email && <a href={`mailto:${site.email}`} className="grid h-10 w-10 place-items-center rounded-lg bg-white/10 hover:bg-white/20" aria-label="Email"><Mail size={18} /></a>}
          </div>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold text-white">Case studies</p>
          <ul className="space-y-2 text-sm">
            {projects.map((p) => <li key={p.slug}><Link href={`/projects/${p.slug}/`} className="hover:text-white">{p.title.replace('Confidential ', '').replace(' – W1 2026', '')}</Link></li>)}
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold text-white">Site</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/experience/" className="hover:text-white">Experience & education</Link></li>
            <li><Link href="/contact/" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="wrap py-5 text-xs text-white/55">© {new Date().getFullYear()} {site.name}. Project dashboards use synthetic demonstration data unless a public source is cited; confidential client information is never shown.</p>
      </div>
    </footer>
  );
}
