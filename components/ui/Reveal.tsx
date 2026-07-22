'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion';
import { DURATION, EASE_OUT } from '@/lib/motion-tokens';

/**
 * Client-only animation boundary. Sections stay Server Components and pass
 * already-rendered content in as `children` — only this leaf wraps it in motion.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: DURATION.reveal, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

export function RevealGroup({
  children,
  stagger = 0.08,
  className,
}: {
  children: ReactNode;
  stagger?: number;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, className, y = 20 }: { children: ReactNode; className?: string; y?: number }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        visible: { opacity: 1, y: 0, transition: { duration: DURATION.reveal, ease: EASE_OUT } },
      }}
    >
      {children}
    </motion.div>
  );
}
