import { prisma } from "@/lib/prisma";
import type { Prisma, GalleryType } from "@prisma/client";

export interface GalleryFilters {
  type?: GalleryType;
  category?: string;
  page?: number;
  pageSize?: number;
}

export const galleryRepository = {
  async findMany(filters: GalleryFilters = {}) {
    const { type, category, page = 1, pageSize = 12 } = filters;

    const where: Prisma.GalleryItemWhereInput = {
      ...(type && { type }),
      ...(category && { category }),
    };

    const [data, total] = await Promise.all([
      prisma.galleryItem.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.galleryItem.count({ where }),
    ]);

    return { data, total, page, pageSize };
  },

  async findById(id: string) {
    return prisma.galleryItem.findUnique({ where: { id } });
  },

  async create(data: Prisma.GalleryItemCreateInput) {
    return prisma.galleryItem.create({ data });
  },

  async update(id: string, data: Prisma.GalleryItemUpdateInput) {
    return prisma.galleryItem.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.galleryItem.delete({ where: { id } });
  },
};
