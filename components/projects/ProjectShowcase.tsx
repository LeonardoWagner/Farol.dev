import { Reveal } from '@/components/ui/Reveal';
import { ProjectMockup } from './ProjectMockup';
import { ProjectCard } from './ProjectCard';
import type { Project } from '@/data/projects';

export function ProjectShowcase({ projects }: { projects: Project[] }) {
  return (
    <div className="flex flex-col gap-24 md:gap-32">
      {projects.map((project, i) => (
        <Reveal key={project.slug}>
          <div
            className={`grid items-center gap-10 md:grid-cols-2 md:gap-16 ${
              i % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''
            }`}
          >
            <ProjectMockup media={project.media} name={project.name} url={project.liveUrl} />
            <ProjectCard project={project} />
          </div>
        </Reveal>
      ))}
    </div>
  );
}
