import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** clsx + tailwind-merge — conflicting Tailwind utilities (e.g. a component's
 * base `inline-flex` vs a caller's override `hidden`) don't resolve predictably
 * by string order alone; twMerge is what actually makes the later one win. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
