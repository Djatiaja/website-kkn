"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { Newspaper, Inbox } from "lucide-react";
import { api } from "@/lib/api";
import { ScrollReveal } from "@/components/home/ScrollReveal";
import { Badge, Skeleton } from "@/components/ui";
import type { News } from "@/types";

interface NewsDetailClientProps {
  id: string;
  locale: "id" | "en";
}

export function NewsDetailClient({ id, locale }: NewsDetailClientProps) {
  const t = useTranslations("news");
  const currentLocale = useLocale();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<News>(`/news/${id}`).then((data) => {
      setNews(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="pt-28 pb-20 container mx-auto px-4 max-w-3xl">
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-64 w-full mb-6" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    );
  }

  if (!news) {
    return (
      <div className="pt-32 pb-20 text-center flex flex-col items-center">
        <Inbox className="w-16 h-16 mb-4 text-neutral-300" />
        <h1 className="text-2xl font-bold text-neutral-800">Berita tidak ditemukan</h1>
        <Link href="/berita" className="text-primary mt-4 hover:underline">
          Kembali ke daftar berita
        </Link>
      </div>
    );
  }

  const title = locale === "id" ? news.titleId : news.titleEn;
  const content = locale === "id" ? news.contentId : news.contentEn;

  return (
    <div className="pt-28 pb-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <ScrollReveal>
          <Link
            href={`/${currentLocale}/berita`}
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline mb-6"
          >
            ← {t("back")}
          </Link>

          <div className="flex items-center gap-2 mb-4">
            <Badge variant="info">{news.category}</Badge>
            {news.publishedAt && (
              <span className="text-sm text-neutral-400">
                {t("published")}{" "}
                {new Date(news.publishedAt).toLocaleDateString(
                  locale === "id" ? "id-ID" : "en-US",
                  { day: "numeric", month: "long", year: "numeric" }
                )}
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-heading font-bold text-neutral-900 mb-6">
            {title}
          </h1>
        </ScrollReveal>

        {news.coverImageUrl && (
          <ScrollReveal delay={100}>
            <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-8">
              <Image
                src={news.coverImageUrl}
                alt={title}
                fill
                className="object-cover"
              />
            </div>
          </ScrollReveal>
        )}

        <ScrollReveal delay={200}>
          <div
            className="prose prose-neutral max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </ScrollReveal>
      </div>
    </div>
  );
}
