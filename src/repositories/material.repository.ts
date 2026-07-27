import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export interface MaterialFilters {
  category?: string;
  fileType?: string;
  search?: string;
  isPublished?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: "createdAt" | "downloadCount" | "title";
  sortOrder?: "asc" | "desc";
}

export const materialRepository = {
  async findMany(filters: MaterialFilters = {}) {
    const {
      category,
      fileType,
      search,
      isPublished,
      page = 1,
      pageSize = 12,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = filters;

    const where: Prisma.DigitalMaterialWhereInput = {
      ...(category && { category: category as Prisma.EnumMaterialCategoryFilter }),
      ...(fileType && { fileType: fileType as Prisma.EnumMaterialFileTypeFilter }),
      ...(isPublished !== undefined && { isPublished }),
      ...(search && {
        OR: [
          { titleId: { contains: search, mode: "insensitive" as const } },
          { titleEn: { contains: search, mode: "insensitive" as const } },
          { descriptionId: { contains: search, mode: "insensitive" as const } },
          { descriptionEn: { contains: search, mode: "insensitive" as const } },
        ],
      }),
    };

    const orderBy: Prisma.DigitalMaterialOrderByWithRelationInput =
      sortBy === "title"
        ? { titleId: sortOrder }
        : { [sortBy]: sortOrder };

    const [data, total] = await Promise.all([
      prisma.digitalMaterial.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy,
      }),
      prisma.digitalMaterial.count({ where }),
    ]);

    return { data, total, page, pageSize };
  },

  async findById(id: string) {
    return prisma.digitalMaterial.findUnique({ where: { id } });
  },

  async create(data: Prisma.DigitalMaterialCreateInput) {
    return prisma.digitalMaterial.create({ data });
  },

  async update(id: string, data: Prisma.DigitalMaterialUpdateInput) {
    return prisma.digitalMaterial.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.digitalMaterial.delete({ where: { id } });
  },

  async incrementDownload(id: string) {
    return prisma.digitalMaterial.update({
      where: { id },
      data: { downloadCount: { increment: 1 } },
    });
  },
};
