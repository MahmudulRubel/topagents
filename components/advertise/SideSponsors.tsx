'use client';

import { useState } from 'react';
import Link from 'next/link';
import AdvertiseModal from './AdvertiseModal';

interface SideSponsorsProps {
  position: 'left' | 'right' | 'mobile';
}

interface SponsorSlotMeta {
  slotNumber: number;
  icon: string;
  title: string;
  tagline: string;
  perks: string[];
}

export default function SideSponsors({ position }: SideSponsorsProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSlotName, setActiveSlotName] = useState('Side Rail Slot');

  const openModalFor = (slotName: string) => {
    setActiveSlotName(slotName);
    setModalOpen(true);
  };

  // ── Slot 1: BooklierAI (Active Featured Sponsor) ──────────────────────────
  const booklierCard = (
    <div className="relative group bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-200 p-4 flex flex-col justify-between overflow-hidden">
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider rounded-full bg-amber-50 text-amber-700 border border-amber-200/70">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          Featured Sponsor
        </span>
        <span className="text-[10px] font-mono font-medium text-slate-400">#01</span>
      </div>

      <div>
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white font-bold text-sm flex items-center justify-center shadow-xs shrink-0 ring-1 ring-black/5">
            📖
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <h4 className="font-bold text-slate-900 text-sm tracking-tight truncate group-hover:text-[#FF6154] transition-colors">
                BooklierAI
              </h4>
              <span className="text-emerald-600 text-xs" title="Verified Sponsor">✓</span>
            </div>
            <span className="text-[10px] font-semibold text-indigo-600 block uppercase tracking-tight">
              AI Book &amp; eBook Writer
            </span>
          </div>
        </div>

        <p className="text-[11.5px] text-slate-600 leading-relaxed mb-3 line-clamp-3 font-normal">
          Tell BooklierAI what you know. It structures chapters, designs high-res covers, and formats complete paperback &amp; Kindle eBooks.
        </p>

        <div className="flex flex-wrap gap-1 mb-3.5">
          <span className="text-[9.5px] font-medium text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/60">Paperback &amp; Kindle</span>
          <span className="text-[9.5px] font-medium text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/60">Cover Studio</span>
          <span className="text-[9.5px] font-medium text-slate-600 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/60">Zero-Prompt</span>
        </div>
      </div>

      <div className="pt-2.5 border-t border-slate-100 flex flex-col gap-1.5">
        <a
          href="https://www.booklierai.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-[#FF6154] text-white text-[11px] font-bold text-center transition-all duration-200 shadow-xs flex items-center justify-center gap-1.5"
        >
          <span>Launch BooklierAI</span>
          <span className="text-xs">↗</span>
        </a>
        <Link
          href="/agents/booklierai"
          className="text-[10.5px] text-center text-slate-400 hover:text-slate-900 font-semibold transition-colors py-0.5"
        >
          Read Technical Review →
        </Link>
      </div>
    </div>
  );

  // ── Available Ad Slot Template ─────────────────────────────────────────────
  const availableSlot = ({ slotNumber, icon, title, tagline, perks }: SponsorSlotMeta) => (
    <div className="relative group bg-white hover:bg-slate-50/40 rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-200 p-4 flex flex-col justify-between overflow-hidden">
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider rounded-full bg-slate-100 text-slate-600 border border-slate-200/60">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Slot #{slotNumber}
        </span>
        <span className="text-[10.5px] font-mono font-bold text-[#FF6154] bg-orange-50/80 px-2 py-0.5 rounded-full border border-orange-200/50">
          $49/mo
        </span>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-base">{icon}</span>
          <h4 className="font-bold text-slate-900 text-xs tracking-tight group-hover:text-[#FF6154] transition-colors">
            {title}
          </h4>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed mb-3">{tagline}</p>
        <div className="flex flex-wrap gap-1 mb-3.5">
          {perks.map((perk, i) => (
            <span key={i} className="text-[9.5px] font-medium text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
              {perk}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-2.5 border-t border-slate-100">
        <button
          onClick={() => openModalFor(`Slot #${slotNumber}: ${title}`)}
          className="w-full py-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-900 hover:text-white text-slate-700 text-[11px] font-bold text-center transition-all duration-200 shadow-2xs flex items-center justify-center gap-1 group-hover:border-slate-900"
        >
          <span>Reserve Placement</span>
          <span className="text-xs">→</span>
        </button>
      </div>
    </div>
  );

  const slot2Data: SponsorSlotMeta = {
    slotNumber: 2,
    icon: '⚡',
    title: 'Promote Your AI Agent',
    tagline: 'Reach 50,000+ AI engineers, researchers, and technical founders discover daily.',
    perks: ['50K+ Monthly Reach', 'Dofollow SEO Link', 'Instant Activation'],
  };

  const slot3Data: SponsorSlotMeta = {
    slotNumber: 3,
    icon: '🎯',
    title: 'Scale Developer Growth',
    tagline: 'Put your framework, tool, or API in front of high-intent autonomous workflow builders.',
    perks: ['High CTR', 'Permanent Profile', 'Priority Review'],
  };

  const slot4Data: SponsorSlotMeta = {
    slotNumber: 4,
    icon: '🚀',
    title: 'Launch Spotlight',
    tagline: 'Drive authentic signups, benchmark evaluations, and developer adoption.',
    perks: ['Desktop & Mobile', 'Direct Backlink', 'Real-Time Stats'],
  };

  // ── Mobile sponsor pill strip data ────────────────────────────────────────
  // Matches reference image: horizontal row of [avatar] [Name] pills
  const mobileSponsors = [
    { key: 'booklierai', href: 'https://www.booklierai.com/', avatar: '📖', avatarBg: 'from-indigo-900 to-slate-900', avatarColor: 'text-white', name: 'BooklierAI', verified: true, cta: false },
    { key: 'slot2', href: null, avatar: '⚡', avatarBg: 'from-slate-100 to-slate-200', avatarColor: 'text-slate-400', name: 'Your Agent', verified: false, cta: true },
    { key: 'slot3', href: null, avatar: '🎯', avatarBg: 'from-slate-100 to-slate-200', avatarColor: 'text-slate-400', name: 'Advertise', verified: false, cta: true },
    { key: 'slot4', href: null, avatar: '🚀', avatarBg: 'from-slate-100 to-slate-200', avatarColor: 'text-slate-400', name: 'Grow Here', verified: false, cta: true },
  ];

  return (
    <>
      {/* ── Desktop Left Rail ── */}
      {position === 'left' && (
        <aside className="w-60 shrink-0 hidden xl:flex flex-col gap-3.5 sticky top-24 self-start">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Featured Sponsors</span>
            </div>
            <button onClick={() => openModalFor('Left Rail Sponsorship')} className="text-[10px] text-[#FF6154] hover:text-[#E55347] font-bold transition-colors">
              Advertise →
            </button>
          </div>
          {booklierCard}
          {availableSlot(slot2Data)}
        </aside>
      )}

      {/* ── Desktop Right Rail ── */}
      {position === 'right' && (
        <aside className="w-60 shrink-0 hidden xl:flex flex-col gap-3.5 sticky top-24 self-start">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Partner Spotlight</span>
            </div>
            <button onClick={() => openModalFor('Right Rail Sponsorship')} className="text-[10px] text-[#FF6154] hover:text-[#E55347] font-bold transition-colors">
              Advertise →
            </button>
          </div>
          {availableSlot(slot3Data)}
          {availableSlot(slot4Data)}
        </aside>
      )}

      {/* ── Mobile: Slim horizontal scrollable logo-pill strip ── */}
      {position === 'mobile' && (
        <section className="xl:hidden w-full mb-6">
          {/* Header row */}
          <div className="flex items-center justify-between mb-2 px-0.5">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sponsors</span>
            </div>
            <button
              onClick={() => openModalFor('Mobile Strip')}
              className="text-[10px] text-[#FF6154] hover:text-[#E55347] font-bold transition-colors"
            >
              Advertise ($49/mo) →
            </button>
          </div>

          {/* Pill row — no scrollbar, horizontal scroll on mobile */}
          <div
            className="flex items-center gap-2 overflow-x-auto py-1"
            style={{ scrollbarWidth: 'none' } as React.CSSProperties}
          >
            {mobileSponsors.map((s) =>
              !s.cta ? (
                // Active sponsor pill
                <a
                  key={s.key}
                  href={s.href!}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="flex items-center gap-2 shrink-0 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-2xs hover:border-slate-300 hover:shadow-sm transition-all group"
                >
                  <span className={`w-6 h-6 rounded-full bg-gradient-to-br ${s.avatarBg} ${s.avatarColor} text-[11px] flex items-center justify-center shrink-0`}>
                    {s.avatar}
                  </span>
                  <span className="text-[12px] font-bold text-slate-800 whitespace-nowrap group-hover:text-[#FF6154] transition-colors">
                    {s.name}
                  </span>
                  {s.verified && (
                    <span className="text-emerald-500 text-[10px]" title="Verified Sponsor">✓</span>
                  )}
                </a>
              ) : (
                // Available slot CTA pill
                <button
                  key={s.key}
                  onClick={() => openModalFor('Mobile Strip Slot')}
                  className="flex items-center gap-2 shrink-0 px-3 py-1.5 rounded-full bg-white/80 border border-dashed border-slate-300 hover:border-[#FF6154] hover:bg-orange-50/40 transition-all group"
                >
                  <span className={`w-6 h-6 rounded-full bg-gradient-to-br ${s.avatarBg} ${s.avatarColor} text-[11px] flex items-center justify-center shrink-0`}>
                    {s.avatar}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap group-hover:text-[#FF6154] transition-colors">
                    {s.name}
                  </span>
                  <span className="text-[9px] font-bold text-[#FF6154] bg-orange-50 px-1.5 py-0.5 rounded-full border border-orange-200/60 whitespace-nowrap">
                    $49/mo
                  </span>
                </button>
              )
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
