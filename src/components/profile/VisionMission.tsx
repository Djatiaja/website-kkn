"use client";

import { ScrollReveal } from "@/components/home/ScrollReveal";

interface VisionMissionProps {
  visionTitle: string;
  missionTitle: string;
  vision: string;
  mission: string;
}

export function VisionMission({ visionTitle, missionTitle, vision, mission }: VisionMissionProps) {
  const missionItems = mission.split("\n").filter((line) => line.trim());

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Vision */}
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-2xl font-heading font-bold text-neutral-900 mb-2">
              🎯 {visionTitle}
            </h2>
            <div className="w-16 h-1 bg-primary mx-auto rounded-full mb-6" />
            <blockquote className="text-lg md:text-xl text-neutral-700 italic leading-relaxed bg-primary/5 p-6 rounded-2xl border-l-4 border-primary">
              &ldquo;{vision}&rdquo;
            </blockquote>
          </div>
        </ScrollReveal>

        {/* Mission */}
        <ScrollReveal delay={200}>
          <div>
            <h2 className="text-2xl font-heading font-bold text-neutral-900 mb-6 text-center">
              📌 {missionTitle}
            </h2>
            <div className="space-y-3">
              {missionItems.map((item, idx) => {
                const text = item.replace(/^\d+\.\s*/, "");
                return (
                  <div
                    key={idx}
                    className="flex items-start gap-4 p-4 rounded-xl bg-neutral-50 border border-neutral-100 hover:border-primary/20 hover:bg-primary/5 transition-colors duration-300"
                  >
                    <span className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {idx + 1}
                    </span>
                    <p className="text-neutral-700 text-sm md:text-base pt-1">
                      {text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
