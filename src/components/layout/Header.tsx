import Link from 'next/link';
import { Search, User } from 'lucide-react';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between bg-zinc-900 px-4 shadow-md border-b border-zinc-800">
      <div className="flex items-center">
        <Link href="/" className="text-2xl font-bold text-[#E50914]">
          STREMUR
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/search" className="p-2 text-zinc-400 hover:text-white transition-colors">
          <Search className="h-6 w-6" />
        </Link>
        <Link href="/profile" className="p-2 text-zinc-400 hover:text-white transition-colors">
          <User className="h-6 w-6" />
        </Link>
      </div>
    </header>
  );
}
