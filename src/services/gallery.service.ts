import { galleryRepository, type GalleryFilters } from "@/repositories/gallery.repository";
import { NotFoundError } from "@/lib/errors";
import type { Prisma } from "@prisma/client";

export const galleryService = {
  async getAll(filters: GalleryFilters) {
    return galleryRepository.findMany(filters);
  },

  async getById(id: string) {
    const item = await galleryRepository.findById(id);
    if (!item) throw new NotFoundError("Gallery item");
    return item;
  },

  async create(data: Prisma.GalleryItemCreateInput) {
    return galleryRepository.create(data);
  },

  async update(id: string, data: Prisma.GalleryItemUpdateInput) {
    const existing = await galleryRepository.findById(id);
    if (!existing) throw new NotFoundError("Gallery item");
    return galleryRepository.update(id, data);
  },

  async delete(id: string) {
    const existing = await galleryRepository.findById(id);
    if (!existing) throw new NotFoundError("Gallery item");
    return galleryRepository.delete(id);
  },
};
