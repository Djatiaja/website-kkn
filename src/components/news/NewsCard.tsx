"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import type { News } from "@/types";

const categoryColors: Record<string, string> = {
  PENGUMUMAN: "bg-red-100 text-red-700",
  KEGIATAN: "bg-blue-100 text-blue-700",
  PEMBANGUNAN: "bg-green-100 text-green-700",
  UMUM: "bg-neutral-100 text-neutral-700",
};

interface NewsCardProps {
  news: News;
  locale: "id" | "en";
}

export function NewsCard({ news, locale }: NewsCardProps) {
  const title = locale === "id" ? news.titleId : news.titleEn;
  const excerpt = locale === "id" ? news.excerptId : news.excerptEn;
  const currentLocale = useLocale();

  return (
    <Link
      href={`/${currentLocale}/berita/${news.id}`}
      className="group block rounded-2xl border border-neutral-200 bg-white overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      {/* Cover Image */}
      <div className="relative h-48 bg-neutral-100 overflow-hidden">
        {news.coverImageUrl ? (
          <Image
            src={news.coverImageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-4xl">📰</div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColors[news.category]}`}>
            {news.category}
          </span>
          {news.publishedAt && (
            <span className="text-xs text-neutral-400">
              {new Date(news.publishedAt).toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          )}
        </div>

        <h3 className="font-heading font-bold text-neutral-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>

        {excerpt && (
          <p className="text-sm text-neutral-500 line-clamp-3">{excerpt}</p>
        )}
      </div>
    </Link>
  );
}
