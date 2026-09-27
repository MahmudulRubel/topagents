'use client';

import { CATEGORIES_CONFIG } from '@/lib/data/agents';

interface CategoryFilterProps {
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
}

export default function CategoryFilter({
  activeCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
      {CATEGORIES_CONFIG.map((cat) => {
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 border ${
              isActive
                ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                : 'bg-white text-gray-600 hover:text-gray-900 border-gray-200 hover:border-gray-300'
            }`}
          >
            <span>{cat.label}</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
              }`}
            >
              {cat.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
