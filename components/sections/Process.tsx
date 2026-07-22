import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProcessScrollFx } from './ProcessScrollFx';
import { SectionLighting } from '@/components/lighting/SectionLighting';
import { LightParticles } from '@/components/lighting/LightParticles';
import { CompassRose } from '@/components/navigation-theme/CompassRose';
import { BuoyMarker } from '@/components/navigation-theme/BuoyMarker';
import { process } from '@/data/process';

const PROCESS_PARTICLES = [
  { x: '10%', y: '20%', size: 2.5, delayS: 0 },
  { x: '30%', y: '75%', size: 2, delayS: 2 },
  { x: '55%', y: '15%', size: 2, delayS: 4 },
  { x: '78%', y: '70%', size: 2.5, delayS: 1.2 },
];

export function Process() {
  return (
    <section id="processo" className="relative isolate overflow-hidden bg-black py-24 md:py-32">
      <SectionLighting variant="process" />
      <LightParticles particles={PROCESS_PARTICLES} color="rgba(255,107,87,0.4)" />
      <ProcessScrollFx />
      <CompassRose size={160} className="absolute -top-6 right-0 hidden text-white lg:block" />
      <Container className="relative">
        <div className="flex items-start gap-2.5">
          <BuoyMarker size={18} className="mt-1 text-coral" />
          <SectionHeading
            eyebrow="Do briefing ao ar — uma travessia em seis etapas"
            title="Processo"
            description="Seis etapas, sempre nessa ordem — previsibilidade para você, clareza para nós."
          />
        </div>

        <div className="mt-16 flex flex-col gap-10 md:flex-row md:gap-0">
          {process.map((step, i) => (
            <div key={step.number} className="process-step relative flex flex-1 flex-col md:px-4">
              <div className="flex items-center">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-(--border-default) font-mono text-sm text-coral">
                  {step.number}
                </span>
                {i < process.length - 1 ? (
                  <span
                    className="process-line ml-3 hidden h-px flex-1 bg-(--border-default) md:block"
                    aria-hidden
                  />
                ) : null}
              </div>
              <p className="mt-5 font-mono text-[11px] tracking-wide text-(--text-secondary) uppercase">
                {step.journeyLabel}
              </p>
              <h3 className="mt-1 font-display text-base font-bold text-white">{step.title}</h3>
              <p className="mt-2 text-body-s leading-normal text-(--text-secondary)">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
