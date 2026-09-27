import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/directory/Navbar';
import Footer from '@/components/directory/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://topagents.lol'),
  title: {
    default: 'topagents.lol — Discover & Upvote the Leading AI Agents',
    template: '%s | topagents.lol',
  },
  description:
    'Discover, compare, and analyze the leading autonomous AI agents across Coding, Browser automation, Voice, Multi-Agent frameworks, and Workflow execution. In-depth technical teardowns, SWE-bench benchmarks, and free community submissions.',
  keywords: [
    'AI agents',
    'autonomous agents',
    'coding agents',
    'SWE-bench',
    'Devin',
    'Claude Code',
    'Cursor',
    'LangGraph',
    'CrewAI',
    'AI directory',
    'top AI agents',
  ],
  authors: [{ name: 'topagents.lol Editorial Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://topagents.lol',
    siteName: 'topagents.lol',
    title: 'topagents.lol — Top 100 AI Agents Directory',
    description:
      'Product Hunt styled directory of the top 100 AI agents with verified SWE-bench benchmarks, architecture breakdowns, and free community submissions.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'topagents.lol — Top 100 AI Agents Directory',
    description:
      'Technical directory of the top 100 AI agents. Architecture deep dives, real metrics, and zero promotional fluff.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col bg-[#F9FAFB] text-gray-900 antialiased font-sans">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
