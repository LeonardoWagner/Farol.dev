'use client';

import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { WHATSAPP_URL } from '@/lib/constants';

const NAV_ITEMS = [
  { label: 'Sobre', id: 'sobre' },
  { label: 'Serviços', id: 'servicos' },
  { label: 'Processo', id: 'processo' },
  { label: 'Projetos', id: 'projetos' },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavClick = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 84, behavior: 'smooth' });
  };

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-(--border-subtle) bg-black/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-4 md:px-10">
        <Logo />

        <nav
          className={cn(
            'absolute top-full left-0 right-0 flex-col items-start gap-1 border-b border-(--border-subtle) bg-black px-6 py-4',
            'md:static md:flex md:flex-row md:items-center md:gap-8 md:border-none md:bg-transparent md:p-0',
            menuOpen ? 'flex' : 'hidden md:flex',
          )}
        >
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="py-2 font-body text-sm font-medium text-white/70 transition-colors duration-[120ms] hover:text-white md:py-0"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button href={WHATSAPP_URL} size="sm" className="hidden md:inline-flex">
            Falar com a gente
          </Button>
          <button
            className="inline-flex h-10 w-10 items-center justify-center text-white md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
}
