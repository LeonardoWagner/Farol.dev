import { cn } from '@/lib/utils';

/**
 * A small monospace "coordinates" tag — purely a graphic motif tying back to
 * the navigation/direction concept, not a real address or claim. Always
 * pair the numbers with a conceptual label (e.g. "PONTO DE PARTIDA"), never
 * present standalone as if it were a real location.
 */
export function CoordinateLabel({
  label,
  coordinates = '26°54\'S 049°16\'W',
  className,
}: {
  label: string;
  coordinates?: string;
  className?: string;
}) {
  return (
    <p className={cn('font-mono text-[11px] tracking-wide text-(--text-secondary) uppercase', className)}>
      <span className="text-coral">{label}</span>
      <span className="mx-2 opacity-40">·</span>
      {coordinates}
    </p>
  );
}
