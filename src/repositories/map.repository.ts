import { prisma } from "@/lib/prisma";
import type { Prisma, MapFeatureType } from "@prisma/client";

export interface MapFilters {
  type?: MapFeatureType;
  isVisible?: boolean;
}

export const mapRepository = {
  async findMany(filters: MapFilters = {}) {
    const { type, isVisible } = filters;

    const where: Prisma.MapFeatureWhereInput = {
      ...(type && { type }),
      ...(isVisible !== undefined && { isVisible }),
    };

    return prisma.mapFeature.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  },

  async findById(id: string) {
    return prisma.mapFeature.findUnique({ where: { id } });
  },

  async create(data: Prisma.MapFeatureCreateInput) {
    return prisma.mapFeature.create({ data });
  },

  async update(id: string, data: Prisma.MapFeatureUpdateInput) {
    return prisma.mapFeature.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.mapFeature.delete({ where: { id } });
  },
};
