import Image from 'next/image';
import Link from 'next/link';
import logoSrc from '@/assets/logo/farol-icon.png';

export function Logo({ withWordmark = true }: { withWordmark?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="Farol.dev — início">
      <Image
        src={logoSrc}
        alt=""
        width={30}
        height={30}
        className="rounded-[7px]"
        priority
      />
      {withWordmark ? (
        <span className="font-display text-lg font-bold text-white">
          Farol<span className="text-coral">.dev</span>
        </span>
      ) : null}
    </Link>
  );
}
