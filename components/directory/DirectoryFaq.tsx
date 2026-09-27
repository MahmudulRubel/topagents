'use client';

import { useState } from 'react';
import { DIRECTORY_HOMEPAGE_FAQS } from '@/lib/data/directory-faqs';

export default function DirectoryFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="bg-white p-6 sm:p-10 rounded-2xl border border-gray-200 shadow-xs space-y-6 mt-12">
      <div className="border-b border-gray-100 pb-4">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-[11px] font-bold text-[#FF6154] mb-2 uppercase tracking-wider">
          AI Directory FAQ
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
          Frequently Asked Questions About Autonomous AI Agents
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Everything you need to know about autonomous agent architecture, benchmarks, and directory ranking.
        </p>
      </div>

      <div className="space-y-3">
        {DIRECTORY_HOMEPAGE_FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`rounded-xl border transition-all ${
                isOpen ? 'border-gray-300 bg-gray-50/50' : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full py-4 px-5 flex items-center justify-between text-left gap-4"
                aria-expanded={isOpen}
              >
                <span className="font-bold text-sm text-gray-900 leading-snug">
                  {faq.question}
                </span>
                <span className="text-gray-400 font-bold text-base shrink-0">
                  {isOpen ? '−' : '+'}
                </span>
              </button>

              {isOpen && (
                <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100/80">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
