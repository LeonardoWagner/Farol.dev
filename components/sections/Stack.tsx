import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { stack } from '@/data/stack';

export function Stack() {
  return (
    <section className="bg-(--surface-raised) py-24 md:py-32">
      <Container>
        <SectionHeading eyebrow="Capacidade técnica" title="Stack" />

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {stack.map((group, i) => (
            <Reveal key={group.label} delay={i * 0.05}>
              <p className="mb-4 font-mono text-xs tracking-wide text-(--text-secondary) uppercase">
                {group.label}
              </p>
              <ul className="flex flex-col gap-2.5">
                {group.items.map((item) => (
                  <li key={item} className="font-display text-base font-medium text-white">
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
