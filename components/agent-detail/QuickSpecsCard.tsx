import { Agent } from '@/lib/data/types';

interface QuickSpecsCardProps {
  agent: Agent;
}

export default function QuickSpecsCard({ agent }: QuickSpecsCardProps) {
  return (
    <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm space-y-4">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
        Technical Specifications
      </h3>

      <div className="divide-y divide-gray-100 text-xs">
        <div className="py-2 flex items-center justify-between">
          <span className="text-gray-500">Developer</span>
          <span className="font-semibold text-gray-900">{agent.developer}</span>
        </div>

        <div className="py-2 flex items-center justify-between">
          <span className="text-gray-500">Release Year</span>
          <span className="font-semibold text-gray-900">{agent.releaseYear}</span>
        </div>

        <div className="py-2 flex items-center justify-between">
          <span className="text-gray-500">Category</span>
          <span className="font-semibold text-gray-900">{agent.categoryLabel}</span>
        </div>

        <div className="py-2 flex items-center justify-between">
          <span className="text-gray-500">Pricing Model</span>
          <span className="font-semibold text-gray-900">{agent.pricingLabel}</span>
        </div>

        <div className="py-2 flex items-center justify-between">
          <span className="text-gray-500">License</span>
          <span className="font-semibold text-gray-900">{agent.license}</span>
        </div>

        <div className="py-2 flex flex-col gap-1">
          <span className="text-gray-500">Core Model Backend</span>
          <span className="font-medium text-gray-800 break-words">
            {agent.primaryModel}
          </span>
        </div>
      </div>

      {/* Outbound Links */}
      <div className="pt-2 flex flex-col gap-2">
        <a
          href={agent.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2 px-3 text-center text-xs font-bold rounded-lg bg-gray-900 hover:bg-black text-white transition-colors"
        >
          Visit Official Website ↗
        </a>

        {agent.githubUrl && (
          <a
            href={agent.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 px-3 text-center text-xs font-semibold rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 transition-colors"
          >
            View GitHub Repository ↗
          </a>
        )}
      </div>
    </div>
  );
}
