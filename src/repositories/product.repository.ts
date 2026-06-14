import { prisma } from "@/lib/prisma";
import type { Prisma, ProductCategory } from "@prisma/client";

export interface ProductFilters {
  category?: ProductCategory;
  search?: string;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
}

export const productRepository = {
  async findMany(filters: ProductFilters = {}) {
    const { category, search, isActive, page = 1, pageSize = 12 } = filters;

    const where: Prisma.ProductWhereInput = {
      ...(category && { category }),
      ...(isActive !== undefined && { isActive }),
      ...(search && {
        OR: [
          { nameId: { contains: search } },
          { nameEn: { contains: search } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ]);

    return { data, total, page, pageSize };
  },

  async findById(id: string) {
    return prisma.product.findUnique({ where: { id } });
  },

  async create(data: Prisma.ProductCreateInput) {
    return prisma.product.create({ data });
  },

  async update(id: string, data: Prisma.ProductUpdateInput) {
    return prisma.product.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.product.delete({ where: { id } });
  },
};
