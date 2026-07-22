import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { differentiators } from '@/data/differentiators';

export function Differentials() {
  return (
    <section className="bg-(--surface-raised) py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Como trabalhamos"
          title="Diferenciais"
          description="O que muda quando design, código e estratégia são pensados pela mesma equipe."
        />

        <div className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {differentiators.map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={(i % 3) * 0.06}>
                <div className="flex gap-4">
                  <Icon className="mt-1 shrink-0 text-purple" size={24} strokeWidth={1.5} />
                  <div>
                    <h3 className="font-display text-base font-bold text-white">{item.title}</h3>
                    <p className="mt-2 text-body-s leading-normal text-(--text-secondary)">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
