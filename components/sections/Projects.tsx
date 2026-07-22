import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProjectShowcase } from '@/components/projects/ProjectShowcase';
import { SectionLighting } from '@/components/lighting/SectionLighting';
import { projects } from '@/data/projects';

export function Projects() {
  return (
    <section id="projetos" className="relative isolate overflow-hidden bg-black py-24 md:py-32">
      <SectionLighting variant="projects" />
      <Container className="relative">
        <SectionHeading
          eyebrow="Trabalho real"
          title="Projetos"
          description="Landing pages que já colocamos no ar — cada uma construída sob medida para o negócio por trás dela."
        />

        <div className="mt-16">
          <ProjectShowcase projects={projects} />
        </div>
      </Container>
    </section>
  );
}
