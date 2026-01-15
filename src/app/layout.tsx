import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Sidebar } from '@/components/layout/Sidebar';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'STREMUR',
  description: 'Streaming Service',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn(inter.className, 'bg-black text-white antialiased')}>
        <Header />
        <div className="flex min-h-screen pt-16">
            <Sidebar />
            <main className="flex-1 px-4 py-6 md:ml-20 lg:ml-64 pb-20 md:pb-6">
                {children}
            </main>
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
