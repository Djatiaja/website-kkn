import { mapRepository, type MapFilters } from "@/repositories/map.repository";
import { NotFoundError } from "@/lib/errors";
import type { Prisma } from "@prisma/client";

export const mapService = {
  async getAll(filters: MapFilters) {
    return mapRepository.findMany(filters);
  },

  async getById(id: string) {
    const feature = await mapRepository.findById(id);
    if (!feature) throw new NotFoundError("Map feature");
    return feature;
  },

  async create(data: Prisma.MapFeatureCreateInput) {
    return mapRepository.create(data);
  },

  async update(id: string, data: Prisma.MapFeatureUpdateInput) {
    const existing = await mapRepository.findById(id);
    if (!existing) throw new NotFoundError("Map feature");
    return mapRepository.update(id, data);
  },

  async delete(id: string) {
    const existing = await mapRepository.findById(id);
    if (!existing) throw new NotFoundError("Map feature");
    return mapRepository.delete(id);
  },
};
