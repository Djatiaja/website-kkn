"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollReveal } from "./ScrollReveal";

interface StatItem {
  value: number;
  label: string;
  icon: string;
  suffix?: string;
}

interface VillageHighlightsProps {
  stats: StatItem[];
}

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  const formatted = count >= 1000
    ? new Intl.NumberFormat("id-ID").format(count)
    : count.toString();

  return (
    <div ref={ref}>
      <span className="text-3xl md:text-4xl font-heading font-extrabold text-neutral-900">
        {formatted}{suffix}
      </span>
    </div>
  );
}

export function VillageHighlights({ stats }: VillageHighlightsProps) {
  return (
    <section id="highlights" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-6 rounded-2xl bg-neutral-50 border border-neutral-200 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group"
            >
              <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </span>
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              <p className="text-sm text-neutral-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
