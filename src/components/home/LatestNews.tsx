import Link from "next/link";
import type { News } from "@/types";
import { Newspaper } from "lucide-react";

interface LatestNewsProps {
  news: News[];
  locale: "id" | "en";
  title: string;
  viewAllText: string;
  readMoreText: string;
}

export function LatestNews({
  news,
  locale,
  title,
  viewAllText,
  readMoreText,
}: LatestNewsProps) {
  const categoryColors: Record<string, string> = {
    PENGUMUMAN: "bg-info/10 text-info",
    KEGIATAN: "bg-success/10 text-success",
    PEMBANGUNAN: "bg-warning/10 text-secondary",
    UMUM: "bg-neutral-100 text-neutral-700",
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold text-neutral-900 mb-2">
            {title}
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((article) => {
            const articleTitle = locale === "id" ? article.titleId : article.titleEn;
            const excerpt = locale === "id" ? article.excerptId : article.excerptEn;
            const colorClass = categoryColors[article.category] || "bg-neutral-100 text-neutral-700";
            const date = article.publishedAt
              ? new Date(article.publishedAt).toLocaleDateString(
                  locale === "id" ? "id-ID" : "en-US",
                  { year: "numeric", month: "long", day: "numeric" }
                )
              : "";

            return (
              <Link
                key={article.id}
                href={`/${locale}/berita/${article.slug}`}
                className="group bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              >
                {/* Cover */}
                <div className="relative h-44 bg-gradient-to-br from-secondary/5 to-accent/10 overflow-hidden">
                  {article.coverImageUrl ? (
                    <img
                      src={article.coverImageUrl}
                      alt={articleTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-50">
                      <Newspaper className="w-12 h-12" />
                    </div>
                  )}
                  <span className={`absolute top-3 left-3 px-2.5 py-1 text-xs font-medium rounded-full ${colorClass}`}>
                    {article.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <p className="text-xs text-neutral-400 mb-2">{date}</p>
                  <h3 className="font-heading font-semibold text-neutral-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {articleTitle}
                  </h3>
                  {excerpt && (
                    <p className="text-sm text-neutral-500 line-clamp-2 mb-3">
                      {excerpt}
                    </p>
                  )}
                  <span className="text-xs text-primary font-medium">
                    {readMoreText} →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            href={`/${locale}/berita`}
            className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all duration-300"
          >
            {viewAllText} →
          </Link>
        </div>
      </div>
    </section>
  );
}
