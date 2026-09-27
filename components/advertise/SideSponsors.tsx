'use client';

import { useState } from 'react';
import Link from 'next/link';
import AdvertiseModal from './AdvertiseModal';

interface SideSponsorsProps {
  position: 'left' | 'right' | 'mobile';
}

export default function SideSponsors({ position }: SideSponsorsProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSlotName, setActiveSlotName] = useState('Side Sponsor Slot');

  const openModalFor = (slotName: string) => {
    setActiveSlotName(slotName);
    setModalOpen(true);
  };

  // Slot 1: BooklierAI (The user requested BooklierAI in 1 slot)
  const booklierCard = (
    <div className="relative group bg-white rounded-2xl border-2 border-orange-200/80 hover:border-[#FF6154] shadow-xs hover:shadow-md transition-all p-4.5 flex flex-col justify-between overflow-hidden">
      {/* Top Tag & Sparkle */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-xs">
          ⭐ Featured Sponsor
        </span>
        <span className="text-[10px] text-gray-400 font-semibold">Ad #1</span>
      </div>

      <div>
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white font-black text-sm flex items-center justify-center shadow-xs shrink-0">
            📖
          </div>
          <div className="min-w-0">
            <h4 className="font-black text-gray-950 text-sm tracking-tight truncate group-hover:text-[#FF6154] transition-colors">
              BooklierAI
            </h4>
            <span className="text-[10px] font-bold text-indigo-600 block uppercase">
              AI Book &amp; eBook Writer
            </span>
          </div>
        </div>

        <p className="text-[11px] text-gray-600 leading-relaxed mb-3 line-clamp-3 font-normal">
          Tell BooklierAI what you know. It writes every chapter, designs the cover, and formats complete paperback &amp; Kindle eBooks.
        </p>
      </div>

      <div className="pt-2 border-t border-gray-100 flex flex-col gap-1.5">
        <a
          href="https://www.booklierai.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2 px-3 rounded-xl bg-[#FF6154] hover:bg-[#E55347] text-white text-[11px] font-bold text-center transition-colors shadow-xs flex items-center justify-center gap-1"
        >
          <span>Launch BooklierAI</span>
          <span className="text-[10px]">↗</span>
        </a>
        <Link
          href="/agents/booklierai"
          className="text-[10px] text-center text-gray-500 hover:text-gray-900 font-semibold transition-colors"
        >
          Read Technical Review →
        </Link>
      </div>
    </div>
  );

  // Available Ad Slot Template
  const availableSlot = (slotNumber: number, title: string, subtitle: string) => (
    <div className="relative group bg-gradient-to-b from-white to-gray-50/70 rounded-2xl border border-dashed border-gray-300 hover:border-[#FF6154] shadow-xs hover:shadow-md transition-all p-4.5 flex flex-col justify-between">
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
          Slot #{slotNumber} Available
        </span>
        <span className="text-[10px] font-mono font-bold text-[#FF6154]">$49/wk</span>
      </div>

      <div>
        <h4 className="font-black text-gray-950 text-xs tracking-tight mb-1 group-hover:text-[#FF6154] transition-colors">
          {title}
        </h4>
        <p className="text-[11px] text-gray-500 leading-relaxed mb-3">
          {subtitle}
        </p>
      </div>

      <div className="pt-2 border-t border-gray-100/80">
        <button
          onClick={() => openModalFor(`Side Slot #${slotNumber}`)}
          className="w-full py-2 px-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-900 hover:text-white text-gray-800 text-[11px] font-bold text-center transition-all shadow-xs flex items-center justify-center gap-1"
        >
          <span>Advertise Here</span>
          <span className="text-[10px]">→</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {position === 'left' && (
        <aside className="w-60 shrink-0 hidden xl:flex flex-col gap-4 sticky top-24 self-start">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Featured Sponsors
            </span>
            <button
              onClick={() => openModalFor('Left Rail')}
              className="text-[10px] text-[#FF6154] hover:underline font-bold"
            >
              Advertise
            </button>
          </div>

          {/* Slot 1: BooklierAI */}
          {booklierCard}

          {/* Slot 2: Available */}
          {availableSlot(
            2,
            'Advertise Your AI Agent',
            'Put your product directly in front of 50,000+ AI developers and technical decision makers.'
          )}
        </aside>
      )}

      {position === 'right' && (
        <aside className="w-60 shrink-0 hidden xl:flex flex-col gap-4 sticky top-24 self-start">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Community Sponsors
            </span>
            <button
              onClick={() => openModalFor('Right Rail')}
              className="text-[10px] text-[#FF6154] hover:underline font-bold"
            >
              Advertise
            </button>
          </div>

          {/* Slot 3: Available */}
          {availableSlot(
            3,
            'Scale Your AI Tool',
            'Target engineers actively searching for autonomous tools, APIs, and workflows.'
          )}

          {/* Slot 4: Available */}
          {availableSlot(
            4,
            'Reserve Spotlight Slot',
            'Includes high-impact sidebar placement, live link, and instant directory exposure.'
          )}
        </aside>
      )}

      {position === 'mobile' && (
        <section className="xl:hidden w-full mb-8">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <span>⚡ Featured Community Sponsors</span>
            </span>
            <button
              onClick={() => openModalFor('Mobile Grid')}
              className="text-xs text-[#FF6154] hover:underline font-bold"
            >
              Advertise Here ($49/wk) →
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {booklierCard}
            {availableSlot(
              2,
              'Advertise Your AI Agent',
              'Get seen by 50,000+ AI builders and engineers weekly.'
            )}
            {availableSlot(
              3,
              'Scale Your AI Tool',
              'Target developers looking for autonomous agent solutions.'
            )}
            {availableSlot(
              4,
              'Reserve Spotlight Slot',
              'High-impact placement with instant directory reach.'
            )}
          </div>
        </section>
      )}

      {/* Booking Modal */}
      <AdvertiseModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultSlot={activeSlotName}
      />
    </>
  );
}
