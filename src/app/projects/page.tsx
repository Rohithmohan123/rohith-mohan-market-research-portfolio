import type { Metadata } from 'next';
import { ProjectCard } from '@/components/ProjectCard';
import { projects } from '@/data/projects';

export const metadata: Metadata = {
  title: 'Research projects',
  description: 'Market research case studies: automotive NPS, UAE higher education demand, mystery shopping and kitchenware price benchmarking.'
};

export default function ProjectsPage() {
  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="wrap py-14">
          <p className="eyebrow">Portfolio</p>
          <h1 className="mt-2 text-4xl font-extrabold sm:text-5xl">Research projects</h1>
          <p className="mt-4 max-w-[64ch] text-lg text-ink-2">Four projects based on real research work, rebuilt as public case studies. Background is genuine; every dashboard uses synthetic demonstration data or cited public sources, and confidential client details are left out.</p>
        </div>
      </section>
      <section className="wrap py-14">
        <div className="grid gap-6 md:grid-cols-2">{projects.map((p, i) => <ProjectCard key={p.slug} p={p} index={i} />)}</div>
      </section>
    </>
  );
}
