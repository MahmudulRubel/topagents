'use client';

import { useState } from 'react';
import { FaqItem } from '@/lib/data/types';

interface FaqAccordionProps {
  faqs: FaqItem[];
}

export default function FaqAccordion({ faqs }: FaqAccordionProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx((curr) => (curr === idx ? null : idx));
  };

  return (
    <div className="space-y-2.5 my-6">
      {faqs.map((faq, idx) => {
        const isOpen = openIdx === idx;
        return (
          <div
            key={idx}
            className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm transition-colors"
          >
            <button
              onClick={() => toggle(idx)}
              className="w-full text-left px-5 py-3.5 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
            >
              <span className="font-bold text-sm sm:text-base text-gray-900 leading-snug">
                {faq.question}
              </span>
              <span className="text-gray-400 font-bold text-lg shrink-0">
                {isOpen ? '−' : '+'}
              </span>
            </button>

            {isOpen && (
              <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/50">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
