'use client';

import { useState } from 'react';
import { getAgentLogoUrl } from '@/lib/utils';

interface AgentAvatarProps {
  agent: {
    name: string;
    monogram?: string;
    avatarBg?: string;
    logoUrl?: string;
    websiteUrl?: string;
  };
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function AgentAvatar({ agent, size = 'md', className = '' }: AgentAvatarProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const logo = getAgentLogoUrl(agent);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs rounded-lg',
    md: 'w-10 h-10 text-sm rounded-xl',
    lg: 'w-12 h-12 text-base rounded-xl',
    xl: 'w-16 h-16 sm:w-20 sm:h-20 text-2xl rounded-2xl',
  };

  const monogram =
    agent.monogram ||
    agent.name
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase() ||
    'AI';

  if (logo && !imageFailed) {
    return (
      <div
        className={`${sizeClasses[size]} shrink-0 bg-white border border-slate-200/90 shadow-2xs overflow-hidden flex items-center justify-center p-1 relative transition-transform ${className}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logo}
          alt={`${agent.name} logo`}
          className="w-full h-full object-contain rounded-md"
          loading="lazy"
          onError={() => setImageFailed(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} shrink-0 flex items-center justify-center font-black text-white shadow-xs select-none transition-transform ${className}`}
      style={{ backgroundColor: agent.avatarBg || '#111827' }}
    >
      {monogram}
    </div>
  );
}
