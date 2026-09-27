import { CompetitorComparison } from '@/lib/data/types';

interface CompetitorsMatrixProps {
  agentName: string;
  competitors: CompetitorComparison[];
}

export default function CompetitorsMatrix({
  agentName,
  competitors,
}: CompetitorsMatrixProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white my-6">
      <table className="w-full text-left border-collapse text-xs sm:text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[11px]">
            <th className="py-3 px-4">Alternative Agent</th>
            <th className="py-3 px-4">Category</th>
            <th className="py-3 px-4 text-emerald-800">Why Choose {agentName}</th>
            <th className="py-3 px-4 text-gray-600">When to Consider Competitor</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {competitors.map((comp, idx) => (
            <tr key={idx} className="hover:bg-gray-50/60 transition-colors">
              <td className="py-3.5 px-4 font-bold text-gray-900">
                {comp.competitorName}
              </td>
              <td className="py-3.5 px-4 text-gray-500 font-medium">
                {comp.category}
              </td>
              <td className="py-3.5 px-4 text-gray-800 leading-relaxed max-w-xs">
                {comp.advantages}
              </td>
              <td className="py-3.5 px-4 text-gray-600 leading-relaxed max-w-xs">
                {comp.drawbacks}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
