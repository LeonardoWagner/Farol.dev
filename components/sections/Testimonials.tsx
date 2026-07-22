import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { GlowCard } from '@/components/ui/GlowCard';
import { testimonials } from '@/data/testimonials';

export function Testimonials() {
  return (
    <section className="bg-black py-24 md:py-32">
      <Container>
        <SectionHeading eyebrow="Prova social" title="O que dizem sobre a gente" />

        <div className="mt-14">
          {testimonials.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t) => (
                <GlowCard key={t.author}>
                  <p className="text-body-m leading-relaxed text-white">“{t.quote}”</p>
                  <p className="mt-5 font-body text-sm font-semibold text-white">{t.author}</p>
                  <p className="text-body-s text-(--text-secondary)">{t.role}</p>
                </GlowCard>
              ))}
            </div>
          ) : (
            <GlowCard className="mx-auto max-w-xl text-center">
              <p className="text-body-m leading-relaxed text-(--text-secondary)">
                Estamos reunindo os primeiros depoimentos de clientes. Em breve, essa seção traz
                relatos reais de quem já trabalhou com a gente.
              </p>
            </GlowCard>
          )}
        </div>
      </Container>
    </section>
  );
}
