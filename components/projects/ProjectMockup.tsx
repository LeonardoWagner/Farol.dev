import Image from 'next/image';
import type { ProjectMedia } from '@/data/projects';

/** Browser-chrome frame. Renders a real screenshot when available, otherwise a
 * branded gradient placeholder — swap `media` to `{ kind: 'screenshot', ... }`
 * in data/projects.ts once a real capture exists, no component change needed. */
export function ProjectMockup({
  media,
  name,
  url,
}: {
  media: ProjectMedia;
  name: string;
  url?: string;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-(--border-subtle) bg-(--surface-card) shadow-lg">
      <div className="flex items-center gap-1.5 border-b border-(--border-subtle) bg-(--surface-raised) px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        {url ? (
          <span className="ml-3 truncate font-mono text-xs text-(--text-secondary)">
            {url.replace(/^https?:\/\//, '')}
          </span>
        ) : null}
      </div>

      <div className="relative aspect-[16/10]">
        {media.kind === 'screenshot' ? (
          <Image src={media.src} alt={media.alt} fill className="object-cover object-top" />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${media.accentGradient[0]}26 0%, ${media.accentGradient[1]}26 50%, ${media.accentGradient[2]}26 100%)`,
            }}
          >
            <span
              className="font-display text-6xl font-bold opacity-40"
              style={{
                backgroundImage: `linear-gradient(135deg, ${media.accentGradient[0]}, ${media.accentGradient[1]}, ${media.accentGradient[2]})`,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              {name.charAt(0)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
