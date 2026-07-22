export type ProcessStep = {
  number: string;
  /** Thematic "journey" framing, shown as a small eyebrow above the
   * technical title — additive, the technical name stays the primary label
   * so nothing gets less clear. */
  journeyLabel: string;
  title: string;
  description: string;
};

export const process: ProcessStep[] = [
  {
    number: '01',
    journeyLabel: 'Ponto de partida',
    title: 'Descoberta',
    description:
      'Entendemos o negócio, o público e o problema real por trás do pedido — antes de qualquer tela ser desenhada.',
  },
  {
    number: '02',
    journeyLabel: 'Traçado da rota',
    title: 'Estratégia',
    description:
      'Definimos escopo, prioridades e a arquitetura de informação que vai sustentar o produto.',
  },
  {
    number: '03',
    journeyLabel: 'Construção da embarcação',
    title: 'Design',
    description:
      'Interface desenhada com a identidade da marca aplicada de forma consistente, do wireframe ao acabamento final.',
  },
  {
    number: '04',
    journeyLabel: 'Construção da embarcação',
    title: 'Desenvolvimento',
    description:
      'Código limpo e performático, construído para durar — não só para funcionar na primeira demo.',
  },
  {
    number: '05',
    journeyLabel: 'Lançamento ao mar',
    title: 'Lançamento',
    description:
      'Publicação com checklist técnico: performance, SEO, acessibilidade e responsividade validados antes do ar.',
  },
  {
    number: '06',
    journeyLabel: 'Navegação contínua',
    title: 'Evolução',
    description:
      'O produto continua sendo acompanhado — ajustes, novas features e melhorias conforme o negócio muda.',
  },
];
