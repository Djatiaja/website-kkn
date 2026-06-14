"use client";

interface YearSelectorProps {
  years: number[];
  selected: number;
  onChange: (year: number) => void;
}

export function YearSelector({ years, selected, onChange }: YearSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {years.map((year) => (
        <button
          key={year}
          onClick={() => onChange(year)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
            selected === year
              ? "bg-primary text-white shadow-md"
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
          }`}
        >
          {year}
        </button>
      ))}
    </div>
  );
}
