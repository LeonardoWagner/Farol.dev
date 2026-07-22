import { Container } from '@/components/ui/Container';
import { BrandGrid } from '@/components/brand/BrandGrid';
import { SectionLighting } from '@/components/lighting/SectionLighting';
import { CompassRose } from '@/components/navigation-theme/CompassRose';
import { CoordinateLabel } from '@/components/navigation-theme/CoordinateLabel';
import { Reveal } from '@/components/ui/Reveal';

const PILLARS = [
  {
    color: 'bg-coral',
    label: 'Propósito',
    description: 'Cada projeto começa com uma pergunta: qual problema real estamos resolvendo?',
  },
  {
    color: 'bg-purple',
    label: 'Abordagem',
    description: 'Design e código pensados juntos, do primeiro rascunho ao produto no ar.',
  },
  {
    color: 'bg-teal',
    label: 'Entrega',
    description: 'Não paramos no lançamento — acompanhamos a evolução do produto.',
  },
];

export function About() {
  return (
    <section id="sobre" className="relative isolate overflow-hidden bg-black py-24 md:py-32">
      <SectionLighting variant="about" />
      <BrandGrid />
      <Container className="relative">
        <div className="grid gap-16 md:grid-cols-[1.1fr_1fr] md:items-center">
          <Reveal>
            <p className="mb-4 font-body text-xs font-semibold tracking-wide text-coral uppercase">
              Quem somos
            </p>
            <h2 className="text-display-s md:text-display-m font-display font-bold tracking-tight text-white">
              O nome farol.dev não é acaso.
            </h2>
            <p className="mt-3 font-display text-base font-medium text-(--text-secondary) italic">
              Antes do código, encontramos a rota.
            </p>
            <div className="mt-6 space-y-5 text-body-l leading-relaxed text-(--text-secondary)">
              <p>
                Um farol existe para uma única função: dar direção em meio à escuridão. É essa a
                ideia por trás do nome — construímos software com clareza de propósito, não
                só com boa aparência.
              </p>
              <p>
                Somos um software studio: projetamos e desenvolvemos produtos digitais — landing
                pages, sites institucionais, dashboards e sistemas sob medida — que resolvem
                problemas reais de negócio, do primeiro rascunho ao produto em produção.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-(--border-subtle) bg-(--surface-raised)">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'radial-gradient(circle at 30% 30%, rgba(255,107,87,0.25) 0%, rgba(138,92,255,0.18) 45%, transparent 75%)',
                }}
              />
              <CompassRose
                size={220}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white"
              />
            </div>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-8 border-t border-(--border-subtle) pt-10 sm:grid-cols-3">
          {PILLARS.map((pillar) => (
            <div key={pillar.label} className="flex gap-3.5">
              <span className={`mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full ${pillar.color}`} />
              <div>
                <p className="mb-1.5 font-body text-xs font-semibold tracking-wide text-white uppercase">
                  {pillar.label}
                </p>
                <p className="text-body-s leading-normal text-(--text-secondary)">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <CoordinateLabel label="Ponto de partida" className="mt-10" />
      </Container>
    </section>
  );
}
