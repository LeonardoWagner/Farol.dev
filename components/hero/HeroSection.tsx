import { Container } from '@/components/ui/Container';
import { HeroContent } from './HeroContent';
import { HeroVisual } from './HeroVisual';

export function HeroSection() {
  return (
    <section
      className="relative flex min-h-[92vh] items-center overflow-hidden"
      style={{
        background: 'linear-gradient(150deg, #0A0D18 0%, #0D1220 42%, #0A1220 75%, #080B14 100%)',
      }}
    >
      {/* Ambient glow behind the whole scene — the "atmosphere" the flat
          black background was missing. Sits behind the canvas; the canvas's
          own alpha:true background lets this show through its empty space. */}
      <div
        className="pointer-events-none absolute -right-[10%] top-[8%] h-[70%] w-[55%] rounded-full opacity-70 blur-[100px]"
        style={{
          background:
            'radial-gradient(circle, rgba(255,107,87,0.22) 0%, rgba(138,92,255,0.16) 45%, transparent 75%)',
        }}
      />
      <div
        className="pointer-events-none absolute right-[5%] bottom-0 h-[45%] w-[50%] rounded-full opacity-60 blur-[90px]"
        style={{
          background: 'radial-gradient(circle, rgba(76,111,255,0.16) 0%, transparent 70%)',
        }}
      />

      <HeroVisual />

      {/* Text-legibility scrim — narrower and lighter than a flat left-black
          overlay, so the scene keeps breathing room on the right two-thirds. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, #0A0D18 0%, rgba(10,13,24,0.85) 30%, rgba(10,13,24,0.35) 55%, transparent 72%)',
        }}
      />

      {/* pointer-events-none here (and re-enabled on HeroContent's own root)
          so clicking Container's large empty padding area — most of the
          hero's width, since it's centered up to max-w-1280 — doesn't block
          clicks meant for the moon or the beam-aim interaction underneath. */}
      <Container className="relative py-32 pointer-events-none">
        <HeroContent />
      </Container>
    </section>
  );
}
