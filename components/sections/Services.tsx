import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { GlowCard } from '@/components/ui/GlowCard';
import { Badge } from '@/components/ui/Badge';
import { Reveal } from '@/components/ui/Reveal';
import { SectionLighting } from '@/components/lighting/SectionLighting';
import { services } from '@/data/services';

export function Services() {
  return (
    <section id="servicos" className="relative isolate overflow-hidden bg-black py-24 md:py-32">
      <SectionLighting variant="services" />
      <Container className="relative">
        <SectionHeading
          eyebrow="O que fazemos"
          title="Serviços"
          description="Da primeira landing page ao sistema completo — cobrimos o produto digital de ponta a ponta."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <Reveal key={service.slug} delay={(i % 4) * 0.05}>
                <GlowCard glow="coral" className="h-full">
                  <Icon className="mb-5 text-coral" size={28} strokeWidth={1.5} />
                  <Badge color="coral" className="mb-4">
                    {service.tag}
                  </Badge>
                  <h3 className="font-display text-lg font-bold text-white">{service.title}</h3>
                  <p className="mt-2.5 text-body-s leading-normal text-(--text-secondary)">
                    {service.description}
                  </p>
                </GlowCard>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
