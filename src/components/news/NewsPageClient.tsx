"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useNewsList } from "@/hooks/useNews";
import { ScrollReveal } from "@/components/home/ScrollReveal";
import { NewsCard } from "@/components/news/NewsCard";
import { Pagination } from "@/components/ui";

const categories = ["all", "PENGUMUMAN", "KEGIATAN", "PEMBANGUNAN", "UMUM"] as const;

export function NewsPageClient({ locale }: { locale: "id" | "en" }) {
  const t = useTranslations("news");
  const [category, setCategory] = useState<string>("all");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useNewsList({
    category: category === "all" ? undefined : category as "PENGUMUMAN" | "KEGIATAN" | "PEMBANGUNAN" | "UMUM",
    isPublished: true,
    page,
    pageSize: 9,
  });

  const totalPages = data ? Math.ceil(data.total / data.pageSize) : 1;

  return (
    <div className="pt-28 pb-20">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-neutral-900 mb-2">
              📰 {t("title")}
            </h1>
          </div>
        </ScrollReveal>

        {/* Category Filter */}
        <ScrollReveal delay={100}>
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setCategory(cat); setPage(1); }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  category === cat
                    ? "bg-primary text-white shadow-sm"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {t(`filter.${cat.toLowerCase()}`)}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* News Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-80 bg-neutral-100 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : data && data.data.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.data.map((news, idx) => (
                <ScrollReveal key={news.id} delay={idx * 50}>
                  <NewsCard news={news} locale={locale} />
                </ScrollReveal>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="mt-10 flex justify-center">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 text-neutral-500">
            <p className="text-5xl mb-4">📭</p>
            <p>{t("empty")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
