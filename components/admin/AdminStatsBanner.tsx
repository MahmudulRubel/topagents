'use client';

interface AdminStats {
  total: number;
  published: number;
  flagged: number;
  pending: number;
  rejected: number;
  averageWordCount: number;
  deepseekModel: string;
  hasApiKey: boolean;
}

interface AdminStatsBannerProps {
  stats: AdminStats | null;
}

export default function AdminStatsBanner({ stats }: AdminStatsBannerProps) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
      {/* Total Submissions */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-xs">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
          Total Submissions
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black text-gray-950">
            {stats.total}
          </span>
          <span className="text-xs text-gray-500">agents</span>
        </div>
      </div>

      {/* Published Live */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-xs">
        <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">
          Published Live
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black text-emerald-600">
            {stats.published}
          </span>
          <span className="text-xs text-emerald-700/80">auto-approved</span>
        </div>
      </div>

      {/* Flagged / Review */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-xs">
        <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block mb-1">
          Flagged / Review
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black text-amber-600">
            {stats.flagged + stats.pending}
          </span>
          <span className="text-xs text-amber-700/80">needs triage</span>
        </div>
      </div>

      {/* Average Word Count */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-xs">
        <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider block mb-1">
          Avg Technical Words
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black text-indigo-600">
            {stats.averageWordCount.toLocaleString()}
          </span>
          <span className="text-xs text-indigo-700/80">words/page</span>
        </div>
      </div>

      {/* DeepSeek API Engine */}
      <div className="col-span-2 lg:col-span-1 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
            DeepSeek Engine
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className={`w-2 h-2 rounded-full ${
                stats.hasApiKey ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500'
              }`}
            />
            <span className="font-mono text-xs font-bold text-gray-800 truncate">
              {stats.deepseekModel}
            </span>
          </div>
        </div>
        <span className="text-[10px] text-gray-400 mt-2 block">
          {stats.hasApiKey ? 'Live API Key Connected' : 'Deterministic Engine Mode'}
        </span>
      </div>
    </div>
  );
}
