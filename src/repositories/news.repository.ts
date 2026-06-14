import { prisma } from "@/lib/prisma";
import type { Prisma, NewsCategory } from "@prisma/client";

export interface NewsFilters {
  category?: NewsCategory;
  isPublished?: boolean;
  search?: string;
  page?: number;
  pageSize?: number;
}

export const newsRepository = {
  async findMany(filters: NewsFilters = {}) {
    const { category, isPublished, search, page = 1, pageSize = 10 } = filters;

    const where: Prisma.NewsWhereInput = {
      ...(category && { category }),
      ...(isPublished !== undefined && { isPublished }),
      ...(search && {
        OR: [
          { titleId: { contains: search } },
          { titleEn: { contains: search } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      prisma.news.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { publishedAt: "desc" },
        include: { author: { select: { id: true, name: true } } },
      }),
      prisma.news.count({ where }),
    ]);

    return { data, total, page, pageSize };
  },

  async findById(id: string) {
    return prisma.news.findUnique({
      where: { id },
      include: { author: { select: { id: true, name: true } } },
    });
  },

  async findBySlug(slug: string) {
    return prisma.news.findUnique({
      where: { slug },
      include: { author: { select: { id: true, name: true } } },
    });
  },

  async create(data: Prisma.NewsUncheckedCreateInput) {
    return prisma.news.create({
      data,
      include: { author: { select: { id: true, name: true } } },
    });
  },

  async update(id: string, data: Prisma.NewsUncheckedUpdateInput) {
    return prisma.news.update({
      where: { id },
      data,
      include: { author: { select: { id: true, name: true } } },
    });
  },

  async delete(id: string) {
    return prisma.news.delete({ where: { id } });
  },
};
