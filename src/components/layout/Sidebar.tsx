'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Bookmark, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Search', href: '/search', icon: Search },
    { name: 'Watchlist', href: '/watchlist', icon: Bookmark },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-16 hidden h-[calc(100vh-4rem)] w-20 flex-col border-r border-zinc-800 bg-black py-4 md:flex lg:w-64 lg:items-start lg:px-4">
      <nav className="flex w-full flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center justify-center gap-4 rounded-md p-3 transition-colors lg:w-full lg:justify-start',
                isActive
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
              )}
            >
              <item.icon className="h-6 w-6" />
              <span className="hidden lg:block font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
