interface ProsConsCardProps {
  strengths: string[];
  limitations: string[];
}

export default function ProsConsCard({ strengths, limitations }: ProsConsCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
      {/* Strengths / Pros */}
      <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-3">
        <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
          <span className="text-base">✓</span>
          <span>Core Engineering Strengths</span>
        </div>
        <ul className="space-y-2.5 text-xs sm:text-sm text-gray-700">
          {strengths.map((str, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold mt-0.5">▪</span>
              <span className="leading-relaxed">{str}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Limitations / Failure Modes */}
      <div className="p-5 rounded-xl border border-amber-200 bg-amber-50/40 space-y-3">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
          <span className="text-base">⚠</span>
          <span>Known Limitations & Failure Modes</span>
        </div>
        <ul className="space-y-2.5 text-xs sm:text-sm text-gray-700">
          {limitations.map((lim, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-amber-600 font-bold mt-0.5">▪</span>
              <span className="leading-relaxed">{lim}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
