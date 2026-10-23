import { ChevronRight } from 'lucide-react';

// Luxury category labels matching the UI design
export const CATEGORIES = [
  { key: 'ALL',         label: 'ALL OFFERINGS' },
  { key: 'SPECIAL',     label: "CHEF'S TASTING" },
  { key: 'APPETIZER',   label: 'RAW BAR & CAVIAR' },
  { key: 'MAIN_COURSE', label: 'PRIME CUTS' },
  { key: 'DESSERT',     label: 'ARTISANAL MAINS' },
  { key: 'BEVERAGE',    label: 'CELLAR & PAIRINGS' },
];

export default function CategoryFilter({ active, onChange, categories = [] }) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
      {[{ key: 'ALL', label: 'All Offerings' }, ...categories.map(c => ({ key: c.code, label: c.name }))].map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`shrink-0 px-4 py-1.5 text-[10px] font-bold tracking-[0.15em]
                      uppercase whitespace-nowrap transition-all duration-200
                      ${active === key
                        ? 'bg-fuchsiusOrange text-white'
                        : 'text-gray-400 hover:text-fuchsiusWhite'
                      }`}
        >
          {label}
        </button>
      ))}
      {/* Scroll hint */}
      <ChevronRight className="w-4 h-4 text-gray-600 shrink-0 ml-1" />
    </div>
  );
}
