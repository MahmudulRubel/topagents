import { BenchmarkMetric } from '@/lib/data/types';

interface BenchmarkTableProps {
  benchmarks: BenchmarkMetric[];
}

export default function BenchmarkTable({ benchmarks }: BenchmarkTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white my-6">
      <table className="w-full text-left border-collapse text-xs sm:text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[11px]">
            <th className="py-3 px-4">Evaluation Benchmark</th>
            <th className="py-3 px-4">Agent Score</th>
            <th className="py-3 px-4">Industry Baseline</th>
            <th className="py-3 px-4">Context & Methodology</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {benchmarks.map((b, idx) => (
            <tr key={idx} className="hover:bg-gray-50/60 transition-colors">
              <td className="py-3 px-4 font-bold text-gray-900">{b.name}</td>
              <td className="py-3 px-4 font-mono font-bold text-[#FF6154]">
                {b.score} {b.unit ? <span className="text-[11px] text-gray-500 font-normal">({b.unit})</span> : ''}
              </td>
              <td className="py-3 px-4 font-mono text-gray-500">
                {b.baseline || 'N/A'}
              </td>
              <td className="py-3 px-4 text-gray-600 leading-relaxed max-w-xs">
                {b.context}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
