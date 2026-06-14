"use client";

import { ScrollReveal } from "@/components/home/ScrollReveal";

interface HistoryProps {
  title: string;
  content: string;
}

interface TimelineEvent {
  year: string;
  text: string;
}

function parseHistory(content: string): TimelineEvent[] {
  // Try to extract year-based events from the text
  const yearRegex = /(?:pada\s+)?(?:tahun\s+)?(\d{4})[,.]?\s*([^.]+\.)/gi;
  const events: TimelineEvent[] = [];
  let match;

  while ((match = yearRegex.exec(content)) !== null) {
    events.push({ year: match[1], text: match[2].trim() });
  }

  // If no year-based events found, just show as paragraphs
  if (events.length === 0) {
    return [{ year: "", text: content }];
  }

  return events;
}

export function History({ title, content }: HistoryProps) {
  const events = parseHistory(content);
  const hasTimeline = events.length > 1 && events[0].year !== "";

  return (
    <section className="py-16 bg-neutral-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <ScrollReveal>
          <h2 className="text-2xl font-heading font-bold text-neutral-900 mb-2 text-center">
            📜 {title}
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto rounded-full mb-10" />
        </ScrollReveal>

        {hasTimeline ? (
          /* Timeline View */
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-primary/20" />

            <div className="space-y-8">
              {events.map((event, idx) => (
                <ScrollReveal key={idx} delay={idx * 100}>
                  <div className={`relative flex items-start gap-6 md:gap-0 ${idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                    {/* Dot */}
                    <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-white shadow-sm z-10" />

                    {/* Content */}
                    <div className={`ml-12 md:ml-0 md:w-1/2 ${idx % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                      <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-bold rounded-full mb-2">
                        {event.year}
                      </span>
                      <p className="text-sm text-neutral-600 leading-relaxed">
                        {event.text}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        ) : (
          /* Simple text */
          <ScrollReveal>
            <div className="prose prose-neutral max-w-none">
              <p className="text-neutral-700 leading-relaxed">{content}</p>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
