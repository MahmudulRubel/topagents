'use client';

import React from 'react';
import { Category } from '@/lib/types';

export type CategoryFilter = 'all' | Category;

interface CategoryTabsProps {
  activeCategory: CategoryFilter;
  onSelectCategory: (category: CategoryFilter) => void;
}

const CATEGORIES: { label: string; value: CategoryFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Coding', value: 'coding' },
  { label: 'Voice', value: 'voice' },
  { label: 'Browser', value: 'browser' },
  { label: 'Support', value: 'support' },
  { label: 'Sales', value: 'sales' },
  { label: 'Research', value: 'research' },
  { label: 'Workflow', value: 'workflow' },
  { label: 'Other', value: 'other' },
];

export default function CategoryTabs({
  activeCategory,
  onSelectCategory,
}: CategoryTabsProps) {
  return (
    <nav className="flex flex-wrap items-center gap-x-4 gap-y-2">
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat.value;
        return (
          <button
            key={cat.value}
            onClick={() => onSelectCategory(cat.value)}
            className={`font-body-sm text-body-sm transition-colors rounded-none bg-transparent p-0 border-none cursor-pointer ${
              isActive
                ? 'text-[#4F46E5] font-semibold underline underline-offset-4 decoration-2'
                : 'text-[#5E5E5E] hover:text-[#1A1C1C]'
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </nav>
  );
}
