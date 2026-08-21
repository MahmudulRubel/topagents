import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/ui/Footer';

export const metadata: Metadata = {
  title: 'topagents.lol — The Real-Time Arena for AI Agents',
  description:
    'No black-box algorithms. No SEO tricks. Pure bid power. Outbid your rivals to take the #1 spot on the live AI Agent Leaderboard.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background text-on-background min-h-screen flex flex-col font-sans antialiased">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
