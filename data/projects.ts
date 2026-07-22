import type { StaticImageData } from 'next/image';

// `src` must be a static import (e.g. `import shot from '@/assets/projects/foo.png'`),
// never a public/-relative string — next/image doesn't prepend basePath to plain
// string src under `images.unoptimized` (required for static export), so a raw
// string would 404 once deployed under the /Farol.dev subpath. Static imports are
// resolved by the bundler and don't have that problem.
export type ProjectMedia =
  | { kind: 'screenshot'; src: StaticImageData; alt: string }
  | { kind: 'mockup'; accentGradient: [string, string, string] };

export type Project = {
  slug: string;
  name: string;
  category: string;
  description: string;
  stack: string[];
  liveUrl?: string;
  githubUrl: string;
  media: ProjectMedia;
};

// Real projects from github.com/herickhoelscher. Descriptions are intentionally
// generic/honest — no fabricated results or metrics. `media` starts as `mockup`
// for all four (no screenshot-capture tool available); to swap in a real
// screenshot, drop the file into assets/projects/<slug>.png, add
// `import <slug>Shot from '@/assets/projects/<slug>.png'` above, and change the
// entry to `{ kind: 'screenshot', src: <slug>Shot, alt: '...' }` — no component changes needed.
export const projects: Project[] = [
  {
    slug: 'lp-dradriano',
    name: 'Dr. Adriano',
    category: 'Landing Page',
    description:
      'Landing page para apresentação profissional e captação de contato, com identidade visual própria e navegação direta ao ponto.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    githubUrl: 'https://github.com/herickhoelscher/Lp_Dradriano',
    media: { kind: 'mockup', accentGradient: ['#FF6B57', '#8A5CFF', '#4C6FFF'] },
  },
  {
    slug: 'lp-ship',
    name: 'Ship',
    category: 'Landing Page',
    description:
      'Landing page construída para comunicar a proposta de valor do negócio com clareza e conduzir o visitante direto ao contato.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    liveUrl: 'https://lp-ship.vercel.app',
    githubUrl: 'https://github.com/herickhoelscher/Lp_Ship',
    media: { kind: 'mockup', accentGradient: ['#4C6FFF', '#3ED8B6', '#8A5CFF'] },
  },
  {
    slug: 'lp-dr-vanessa',
    name: 'Dr. Vanessa',
    category: 'Landing Page',
    description:
      'Landing page para apresentação profissional, com foco em transmitir confiança e facilitar o agendamento de contato.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    liveUrl: 'https://lpdrvanessa.vercel.app',
    githubUrl: 'https://github.com/herickhoelscher/lp_drVanessa',
    media: { kind: 'mockup', accentGradient: ['#8A5CFF', '#FF6B57', '#3ED8B6'] },
  },
  {
    slug: 'lp-alpe',
    name: 'Alpe',
    category: 'Landing Page',
    description:
      'Landing page desenvolvida para apresentar a marca Alpe, com layout responsivo e navegação orientada à conversão.',
    stack: ['HTML', 'CSS', 'JavaScript'],
    liveUrl: 'https://lpalpeprimeraversao.vercel.app',
    githubUrl: 'https://github.com/herickhoelscher/Lp_Alpe_V2',
    media: { kind: 'mockup', accentGradient: ['#3ED8B6', '#4C6FFF', '#FF6B57'] },
  },
];
