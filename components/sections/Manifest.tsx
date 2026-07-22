import { Container } from '@/components/ui/Container';
import { SectionLighting } from '@/components/lighting/SectionLighting';
import { Reveal } from '@/components/ui/Reveal';

export function Manifest() {
  return (
    <section className="relative isolate overflow-hidden bg-black py-32 md:py-44">
      <SectionLighting variant="manifest" />

      <Container className="relative">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-display text-3xl leading-tight font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              Código com direção.
            </p>
            <p className="mt-4 font-display text-3xl leading-tight font-bold tracking-tight text-(--text-secondary) sm:text-4xl md:text-5xl">
              A luz que tira produtos da ideia
              <br className="hidden sm:block" /> e coloca no mundo.
            </p>
            <p className="mt-8 font-body text-lg text-coral">
              Construímos produtos digitais que resolvem problemas reais.
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
