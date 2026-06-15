"use client";

import Image from "next/image";
import { Building2, User } from "lucide-react";
import { ScrollReveal } from "@/components/home/ScrollReveal";

interface Member {
  id: string;
  name: string;
  positionId: string;
  positionEn: string;
  photoUrl: string | null;
  order: number;
}

interface OrganizationChartProps {
  title: string;
  members: Member[];
  locale: "id" | "en";
}

export function OrganizationChart({ title, members, locale }: OrganizationChartProps) {
  const head = members[0];
  const rest = members.slice(1);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-5xl">
        <ScrollReveal>
          <h2 className="flex justify-center items-center gap-2 text-2xl font-heading font-bold text-neutral-900 mb-6">
            <Building2 className="w-6 h-6 text-primary" /> {title}
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto rounded-full mb-12" />
        </ScrollReveal>

        {/* Head / Leader */}
        {head && (
          <ScrollReveal delay={100}>
            <div className="flex justify-center mb-8">
              <MemberCard member={head} locale={locale} isHead />
            </div>
            {/* Connector line */}
            <div className="flex justify-center mb-8">
              <div className="w-0.5 h-8 bg-primary/30" />
            </div>
          </ScrollReveal>
        )}

        {/* Other members */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
          {rest.map((member, idx) => (
            <ScrollReveal key={member.id} delay={150 + idx * 50}>
              <MemberCard member={member} locale={locale} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function MemberCard({
  member,
  locale,
  isHead = false,
}: {
  member: Member;
  locale: "id" | "en";
  isHead?: boolean;
}) {
  const position = locale === "id" ? member.positionId : member.positionEn;

  return (
    <div
      className={`text-center p-4 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
        isHead
          ? "bg-primary/5 border-primary/20 shadow-sm max-w-xs"
          : "bg-neutral-50 border-neutral-200"
      }`}
    >
      {/* Photo */}
      <div
        className={`mx-auto mb-3 rounded-full overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center ${
          isHead ? "w-24 h-24" : "w-16 h-16"
        }`}
      >
        {member.photoUrl ? (
          <img
            src={member.photoUrl}
            alt={member.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-neutral-100 flex items-center justify-center text-neutral-400">
            <User className={isHead ? "w-10 h-10" : "w-8 h-8"} />
          </div>
        )}
      </div>

      {/* Name & Position */}
      <h3 className={`font-heading font-semibold text-neutral-900 ${isHead ? "text-base" : "text-sm"}`}>
        {member.name}
      </h3>
      <p className={`text-neutral-500 mt-0.5 ${isHead ? "text-sm" : "text-xs"}`}>
        {position}
      </p>
    </div>
  );
}
