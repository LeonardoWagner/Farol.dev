import type { LucideIcon } from 'lucide-react';
import {
  Rocket,
  Building2,
  LayoutDashboard,
  Workflow,
  Code2,
  Sparkles,
  LifeBuoy,
  Palette,
} from 'lucide-react';

export type Service = {
  slug: string;
  icon: LucideIcon;
  title: string;
  description: string;
  tag: string;
};

export const services: Service[] = [
  {
    slug: 'landing-pages',
    icon: Rocket,
    title: 'Landing pages de alta conversão',
    description:
      'Páginas construídas para um objetivo: converter. Copy direta, hierarquia visual clara e performance de carregamento que não perde visitante no caminho.',
    tag: 'Aquisição',
  },
  {
    slug: 'sites-institucionais',
    icon: Building2,
    title: 'Sites institucionais premium',
    description:
      'Presença digital que representa o nível da marca — arquitetura de informação pensada, identidade visual aplicada com consistência, sem parecer template.',
    tag: 'Marca',
  },
  {
    slug: 'dashboards-sistemas',
    icon: LayoutDashboard,
    title: 'Dashboards e sistemas',
    description:
      'Interfaces internas e painéis de dados desenhados para uso diário: clareza de leitura, fluxos curtos, e informação relevante em primeiro plano.',
    tag: 'Produto',
  },
  {
    slug: 'automacoes',
    icon: Workflow,
    title: 'Automações',
    description:
      'Processos manuais e repetitivos convertidos em fluxos automáticos — menos tempo operacional, menos erro humano, mais previsibilidade.',
    tag: 'Eficiência',
  },
  {
    slug: 'software-sob-medida',
    icon: Code2,
    title: 'Software sob medida',
    description:
      'Quando uma solução pronta não resolve, construímos do zero — arquitetura pensada para o problema real, não para o caso genérico.',
    tag: 'Engenharia',
  },
  {
    slug: 'interfaces-experiencias',
    icon: Sparkles,
    title: 'Interfaces e experiências digitais',
    description:
      'Motion, microinterações e detalhes de acabamento aplicados com intenção — o tipo de refinamento que o usuário sente antes de conseguir explicar.',
    tag: 'Experiência',
  },
  {
    slug: 'suporte-evolucao',
    icon: LifeBuoy,
    title: 'Suporte e evolução de produtos',
    description:
      'Depois do lançamento, o produto continua vivo. Acompanhamento técnico, correções e novas versões conforme o negócio cresce.',
    tag: 'Continuidade',
  },
  {
    slug: 'branding-digital',
    icon: Palette,
    title: 'Branding digital aplicado a interfaces',
    description:
      'Identidade visual traduzida em componentes reais de produto — tokens de cor, tipografia e motion consistentes em cada tela.',
    tag: 'Identidade',
  },
];
