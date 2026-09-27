import Link from 'next/link';
import { CATEGORIES } from '@/lib/data/agents';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-12 text-sm text-gray-500 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-[#FF6154] flex items-center justify-center text-white font-black text-sm">
                ▲
              </div>
              <span className="font-extrabold text-gray-900 tracking-tight text-base">
                topagents<span className="text-[#FF6154]">.lol</span>
              </span>
            </Link>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              The authoritative, community-curated directory of leading autonomous AI agents. In-depth technical architecture breakdowns, real SWE-bench metrics, and zero promotional fluff.
            </p>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-gray-600">100+ Verified Agents · 100% Free Submissions</span>
            </div>
          </div>

          {/* Categories 1 */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
              Agent Categories
            </h4>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/category/${cat.id}`}
                    className="hover:text-gray-900 transition-colors flex items-center gap-1.5"
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories 2 */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
              More Workflows
            </h4>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.slice(5).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/category/${cat.id}`}
                    className="hover:text-gray-900 transition-colors flex items-center gap-1.5"
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community & Legal */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
              AI Resources &amp; Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/submit" className="hover:text-[#FF6154] font-semibold text-gray-800 transition-colors flex items-center gap-1">
                  <span>+ Submit Your Agent</span>
                  <span className="px-1.5 py-0.2 text-[9px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                    Free
                  </span>
                </Link>
              </li>
              <li>
                <a href="/llms.txt" target="_blank" className="hover:text-gray-900 transition-colors flex items-center gap-1">
                  <span>🤖 llms.txt</span>
                  <span className="px-1.5 py-0.2 text-[9px] font-mono text-indigo-700 bg-indigo-50 rounded">
                    Spec
                  </span>
                </a>
              </li>
              <li>
                <a href="/llms-full.txt" target="_blank" className="hover:text-gray-900 transition-colors">
                  Full Catalog (llms-full.txt)
                </a>
              </li>
              <li>
                <a href="/pricing.md" target="_blank" className="hover:text-gray-900 transition-colors">
                  Pricing Policy (pricing.md)
                </a>
              </li>
              <li>
                <Link href="/advertise" className="hover:text-[#FF6154] font-medium text-gray-700 transition-colors flex items-center gap-1.5">
                  <span>📢 Sponsor topagents.lol</span>
                  <span className="px-1.5 py-0.2 text-[9px] font-mono text-slate-500 bg-slate-100 rounded">
                    $49/mo
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/sitemap.xml" className="hover:text-gray-900 transition-colors">
                  XML Sitemap
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} topagents.lol. Built for AI engineers, researchers, and builders.</p>
          <div className="flex items-center gap-6">
            <span>Human-reviewed editorial standards</span>
            <span>Zero AI-slop guarantee</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
