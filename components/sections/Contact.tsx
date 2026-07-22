import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { LightBeam } from '@/components/brand/LightBeam';
import { SectionLighting } from '@/components/lighting/SectionLighting';
import { WHATSAPP_URL } from '@/lib/constants';

export function Contact() {
  return (
    <section className="relative isolate overflow-hidden bg-black py-28 md:py-36">
      <SectionLighting variant="contact" />
      <LightBeam className="opacity-60" />
      <Container className="relative text-center">
        <p className="mb-4 font-body text-xs font-semibold tracking-wide text-coral uppercase">
          Vamos conversar
        </p>
        <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
          Tem um produto pra tirar do papel?
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-body-l leading-relaxed text-(--text-secondary)">
          Conta pra gente o que você está construindo. Respondemos rápido, direto pelo WhatsApp.
        </p>
        <div className="mt-10">
          <Button href={WHATSAPP_URL} size="lg">
            Falar com a gente
          </Button>
        </div>
      </Container>
    </section>
  );
}
