export type StackGroup = {
  label: string;
  items: string[];
};

export const stack: StackGroup[] = [
  {
    label: 'Front-end',
    items: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
  },
  {
    label: '3D & Motion',
    items: ['React Three Fiber', 'Three.js', 'GSAP', 'Framer Motion'],
  },
  {
    label: 'Back-end & Automação',
    items: ['Node.js', 'APIs REST', 'Integrações', 'Automação de processos'],
  },
  {
    label: 'Infra & Deploy',
    items: ['Vercel', 'GitHub Actions', 'GitHub Pages'],
  },
];
