import { Logo } from '@/components/brand/Logo';
import { SectionLighting } from '@/components/lighting/SectionLighting';
import { WaveDivider } from '@/components/navigation-theme/WaveDivider';
import { CoordinateLabel } from '@/components/navigation-theme/CoordinateLabel';

const LINKS = [
  { label: 'Sobre', href: '#sobre' },
  { label: 'Serviços', href: '#servicos' },
  { label: 'Processo', href: '#processo' },
  { label: 'Projetos', href: '#projetos' },
];

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-(--border-subtle) bg-black py-12">
      <SectionLighting variant="footer" />
      <WaveDivider className="absolute inset-x-0 top-0 -translate-y-1/2 text-white" />
      <div className="relative mx-auto flex max-w-[1280px] flex-col items-start gap-8 px-6 md:flex-row md:items-center md:justify-between md:px-10">
        <div className="flex flex-col gap-3">
          <Logo />
          <p className="max-w-xs text-body-s text-(--text-secondary)">
            Software studio para negócios que não querem navegar no escuro.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-body text-sm text-(--text-secondary) transition-colors duration-[120ms] hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex flex-col items-start gap-1.5 md:items-end">
          <p className="font-mono text-xs text-(--text-secondary)">© {new Date().getFullYear()} Farol.dev</p>
          <CoordinateLabel label="Farol.dev" />
        </div>
      </div>
    </footer>
  );
}
