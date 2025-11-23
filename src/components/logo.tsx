
import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center" prefetch={false}>
      <span className="text-2xl font-bold font-headline text-primary">ProjectVerse</span>
    </Link>
  );
}
