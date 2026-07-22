import { ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { GithubIcon } from '@/components/ui/icons';
import type { Project } from '@/data/projects';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="flex h-full flex-col justify-center">
      <Badge color="purple" className="mb-4 w-fit">
        {project.category}
      </Badge>
      <h3 className="font-display text-2xl font-bold text-white md:text-3xl">{project.name}</h3>
      <p className="mt-4 max-w-md text-body-m leading-relaxed text-(--text-secondary)">
        {project.description}
      </p>

      <ul className="mt-5 flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <li
            key={tech}
            className="rounded-full border border-(--border-subtle) px-3 py-1 font-mono text-xs text-(--text-secondary)"
          >
            {tech}
          </li>
        ))}
      </ul>

      <div className="mt-7 flex flex-wrap gap-5">
        {project.liveUrl ? (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-body text-sm font-semibold text-white transition-colors duration-[120ms] hover:text-coral"
          >
            <ExternalLink size={16} /> Ver ao vivo
          </a>
        ) : null}
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-body text-sm font-semibold text-(--text-secondary) transition-colors duration-[120ms] hover:text-white"
        >
          <GithubIcon size={16} /> GitHub
        </a>
      </div>
    </div>
  );
}
