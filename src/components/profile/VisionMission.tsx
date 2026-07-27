"use client";

import { Target, Flag } from "lucide-react";
import { ScrollReveal } from "@/components/home/ScrollReveal";

interface VisionMissionProps {
  visionTitle: string;
  missionTitle: string;
  vision: string;
  missionItems: { id: string; textId: string; textEn: string; order: number }[];
  locale: "id" | "en";
}

/**
 * Convert Quill HTML to inline-only text (strip <p> wrappers but keep bold/italic).
 * This prevents the <p> from creating block breaks inside the blockquote.
 */
function flattenQuillHtml(html: string): string {
  // Remove <p> and </p> tags, keep their content and inline formatting
  return html
    .replace(/<p[^>]*>/gi, "")
    .replace(/<\/p>/gi, "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/&nbsp;/g, " ")
    .trim();
}

export function VisionMission({ visionTitle, missionTitle, vision, missionItems, locale }: VisionMissionProps) {
  const sorted = [...missionItems].sort((a, b) => a.order - b.order);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Vision */}
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="flex justify-center items-center gap-2 text-2xl font-heading font-bold text-neutral-900 mb-2">
              <Target className="w-6 h-6 text-primary" /> {visionTitle}
            </h2>
            <div className="w-16 h-1 bg-primary mx-auto rounded-full mb-6" />
            <blockquote className="text-lg md:text-xl text-neutral-700 italic leading-relaxed bg-primary/5 p-6 rounded-2xl border-l-4 border-primary text-center">
              <span
                className="rich-text [&_p]:inline [&_p]:m-0 [&_strong]:font-semibold [&_em]:italic"
                dangerouslySetInnerHTML={{ __html: `&ldquo;${flattenQuillHtml(vision)}&rdquo;` }}
              />
            </blockquote>
          </div>
        </ScrollReveal>

        {/* Mission */}
        <ScrollReveal delay={200}>
          <div>
            <h2 className="flex items-center justify-center gap-2 text-2xl font-heading font-bold text-neutral-900 mb-6">
              <Flag className="w-6 h-6 text-primary" /> {missionTitle}
            </h2>
            <div className="space-y-3">
              {sorted.map((item, idx) => {
                const text = locale === "id" ? item.textId : item.textEn;
                return (
                  <div
                    key={item.id}
                    className="flex items-start gap-4 p-4 rounded-xl bg-neutral-50 border border-neutral-100 hover:border-primary/20 hover:bg-primary/5 transition-colors duration-300"
                  >
                    <span className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {idx + 1}
                    </span>
                    <div
                      className="rich-text text-neutral-700 text-sm md:text-base pt-1 [&_p]:inline [&_p]:m-0"
                      dangerouslySetInnerHTML={{ __html: text }}
                    />
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
