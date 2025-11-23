
import { Layers } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" prefetch={false}>
      <Image 
        src="https://cdn.jsdelivr.net/gh/Tharvesh2026/Web-Source@refs/heads/main/egspgoi_logo_tr.webp"
        alt="EGS Pillay Logo"
        width={150}
        height={40}
        className="object-contain"
        priority
      />
    </Link>
  );
}
