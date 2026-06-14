"use client";

import { ScrollReveal } from "@/components/home/ScrollReveal";

interface DemographicsProps {
  title: string;
  population: number;
  area: number;
  labels: {
    total: string;
    male: string;
    female: string;
    households: string;
  };
}

export function Demographics({ title, population, area, labels }: DemographicsProps) {
  // Estimated demographics based on population
  const male = Math.round(population * 0.49);
  const female = population - male;
  const households = Math.round(population / 4.2);

  const stats = [
    { value: population, label: labels.total, icon: "👥" },
    { value: male, label: labels.male, icon: "👨" },
    { value: female, label: labels.female, icon: "👩" },
    { value: households, label: labels.households, icon: "🏠" },
  ];

  return (
    <section className="py-16 bg-neutral-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <ScrollReveal>
          <h2 className="text-2xl font-heading font-bold text-neutral-900 mb-2 text-center">
            📊 {title}
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto rounded-full mb-10" />
        </ScrollReveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <ScrollReveal key={stat.label} delay={idx * 100}>
              <div className="text-center p-6 rounded-2xl bg-white border border-neutral-200 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                <span className="text-3xl mb-2 block">{stat.icon}</span>
                <p className="text-2xl md:text-3xl font-heading font-extrabold text-neutral-900">
                  {stat.value.toLocaleString("id-ID")}
                </p>
                <p className="text-sm text-neutral-500 mt-1">{stat.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Area info */}
        <ScrollReveal delay={400}>
          <div className="mt-6 text-center">
            <p className="text-neutral-500 text-sm">
              Luas Wilayah: <span className="font-semibold text-neutral-700">{area.toLocaleString("id-ID")} Ha</span>
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
