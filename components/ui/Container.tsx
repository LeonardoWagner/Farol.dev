import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Container({
  children,
  className,
  as: As = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section';
}) {
  return (
    <As className={cn('mx-auto w-full max-w-[1280px] px-6 md:px-10', className)}>{children}</As>
  );
}
