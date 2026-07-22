import type { LucideIcon } from 'lucide-react';
import { Compass, Layers, Gauge, Target, Puzzle, Handshake } from 'lucide-react';

export type Differentiator = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const differentiators: Differentiator[] = [
  {
    icon: Compass,
    title: 'Direção estratégica, não só execução',
    description:
      'Antes de abrir o editor, entendemos o problema de negócio. Cada decisão de tela serve a um objetivo — não é estética por estética.',
  },
  {
    icon: Layers,
    title: 'Design e código na mesma cabeça',
    description:
      'Quem desenha a interface é quem escreve o componente. Isso elimina a perda de fidelidade que acontece quando design e desenvolvimento são times isolados.',
  },
  {
    icon: Gauge,
    title: 'Performance como requisito, não afterthought',
    description:
      'Carregamento rápido e interações fluidas fazem parte do escopo desde o primeiro dia — não é uma otimização de última hora.',
  },
  {
    icon: Target,
    title: 'Atenção a detalhe que se sente',
    description:
      'O acabamento fino — motion, espaçamento, contraste, microcopy — é o que separa um produto que parece pronto de um que só está funcional.',
  },
  {
    icon: Puzzle,
    title: 'Solução real, não só interface bonita',
    description:
      'Uma tela pode ser visualmente perfeita e ainda não resolver nada. O objetivo é sempre o resultado prático por trás da tela.',
  },
  {
    icon: Handshake,
    title: 'Parceria de ponta a ponta',
    description:
      'Do primeiro rascunho ao produto no ar — e depois dele. Acompanhamos a evolução, não só a entrega inicial.',
  },
];
