import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

const base =
  'group relative inline-flex items-center justify-center gap-2 rounded-full font-body font-semibold ' +
  'transition-colors duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] cursor-pointer ' +
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--focus-ring)';

// A faint expanding-ring "signal" pulse — only plays while hovered/focused
// (the animation is applied via group-hover/group-focus-visible variants, not
// unconditionally, so nothing animates on an idle page full of buttons).
const pulseRing = (
  <span
    aria-hidden
    className="pointer-events-none absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 group-hover:[animation:button-pulse_1.4s_ease-out_infinite] group-focus-visible:opacity-100 group-focus-visible:[animation:button-pulse_1.4s_ease-out_infinite]"
  />
);

const variants = {
  primary: 'bg-coral text-black hover:bg-white',
  outline: 'border border-(--border-default) text-white hover:border-coral hover:text-coral',
  ghost: 'text-white/80 hover:text-white',
} as const;

const sizes = {
  sm: 'px-5 py-2.5 text-sm',
  md: 'px-7 py-3.5 text-[15px]',
  lg: 'px-8 py-4 text-base',
} as const;

type CommonProps = {
  children: ReactNode;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
};

type ButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type AnchorProps = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  href,
  ...rest
}: ButtonProps | AnchorProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {pulseRing}
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {pulseRing}
      {children}
    </button>
  );
}
