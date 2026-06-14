"use client";

import { ScrollReveal } from "@/components/home/ScrollReveal";

interface ProfileHeroProps {
  title: string;
  description: string;
  imageUrl?: string;
}

export function ProfileHero({ title, description, imageUrl }: ProfileHeroProps) {
  return (
    <section className="relative h-[40vh] min-h-[320px] flex items-center justify-center overflow-hidden">
      {/* Background */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transform: "translateZ(0)" }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary to-secondary" />
      )}

      {/* Parallax overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <ScrollReveal>
          <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-white mb-3 drop-shadow-lg">
            {title}
          </h1>
          <p className="text-white/80 text-sm md:text-base max-w-xl mx-auto">
            {description}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
