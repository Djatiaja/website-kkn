import { newsRepository, type NewsFilters } from "@/repositories/news.repository";
import { NotFoundError } from "@/lib/errors";
import type { Prisma } from "@prisma/client";

export const newsService = {
  async getAll(filters: NewsFilters) {
    return newsRepository.findMany(filters);
  },

  async getById(id: string) {
    const news = await newsRepository.findById(id);
    if (!news) throw new NotFoundError("News");
    return news;
  },

  async getBySlug(slug: string) {
    const news = await newsRepository.findBySlug(slug);
    if (!news) throw new NotFoundError("News");
    return news;
  },

  async create(data: Prisma.NewsUncheckedCreateInput) {
    return newsRepository.create(data);
  },

  async update(id: string, data: Prisma.NewsUncheckedUpdateInput) {
    const existing = await newsRepository.findById(id);
    if (!existing) throw new NotFoundError("News");
    return newsRepository.update(id, data);
  },

  async delete(id: string) {
    const existing = await newsRepository.findById(id);
    if (!existing) throw new NotFoundError("News");
    return newsRepository.delete(id);
  },
};
