import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Category } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCentsToDollars(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export const formatCurrency = formatCentsToDollars;

export function formatTimeAgo(isoString: string): string {
  const date = new Date(isoString);
  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) {
    const diffMins = Math.max(1, Math.floor(diffMs / (1000 * 60)));
    return `${diffMins}m ago`;
  }
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export function calculateOutbidAmount(currentBidCents: number): number {
  if (!currentBidCents || currentBidCents < 100) {
    return 100; // Minimum $1.00
  }
  return currentBidCents + 100; // +$1.00 outbid requirement
}

export function getAvatarInitials(name: string): string {
  if (!name) return 'AI';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function getCategoryLabel(category: Category): string {
  const labels: Record<Category, string> = {
    coding: 'Coding',
    voice: 'Voice',
    browser: 'Browser',
    support: 'Support',
    sales: 'Sales',
    research: 'Research',
    workflow: 'Workflow',
    other: 'Other',
  };
  return labels[category] || 'Other';
}
