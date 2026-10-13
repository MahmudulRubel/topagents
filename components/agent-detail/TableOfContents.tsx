'use client';

import { useState, useEffect } from 'react';

const SECTIONS = [
  { id: 'executive-summary', label: '1. What It Is & Who It’s For' },
  { id: 'architecture-deep-dive', label: '2. How It Works Step-by-Step' },
  { id: 'core-capabilities', label: '3. Key Features & Capabilities' },
  { id: 'enterprise-use-cases', label: '4. Real-World Examples' },
  { id: 'quickstart-guide', label: '5. How to Get Started' },
  { id: 'benchmarks-evaluation', label: '6. Speed & Accuracy Scores' },
  { id: 'pricing-economics', label: '7. Pricing & Value Guide' },
  { id: 'strengths-and-pitfalls', label: '8. Honest Pros & Cons' },
  { id: 'competitor-comparison', label: '9. Best Alternatives Compared' },
  { id: 'developer-faqs', label: '10. Common Questions (FAQ)' },
  { id: 'final-verdict', label: '11. Final Verdict & Rating' },
];

export default function TableOfContents() {
  const [activeSection, setActiveSection] = useState('executive-summary');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;

      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.offsetTop - 90;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <nav className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm space-y-1">
      <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5 px-2">
        Table of Contents (2k+ Words)
      </div>
      {SECTIONS.map((sec) => {
        const isActive = activeSection === sec.id;
        return (
          <button
            key={sec.id}
            onClick={() => scrollTo(sec.id)}
            className={`w-full text-left text-xs py-1.5 px-2.5 rounded-lg transition-colors truncate block ${
              isActive
                ? 'bg-gray-900 text-white font-bold'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            {sec.label}
          </button>
        );
      })}
    </nav>
  );
}
