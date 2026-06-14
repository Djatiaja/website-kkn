import { productRepository, type ProductFilters } from "@/repositories/product.repository";
import { NotFoundError } from "@/lib/errors";
import type { Prisma } from "@prisma/client";

export const productService = {
  async getAll(filters: ProductFilters) {
    return productRepository.findMany(filters);
  },

  async getById(id: string) {
    const product = await productRepository.findById(id);
    if (!product) throw new NotFoundError("Product");
    return product;
  },

  async create(data: Prisma.ProductCreateInput) {
    return productRepository.create(data);
  },

  async update(id: string, data: Prisma.ProductUpdateInput) {
    const existing = await productRepository.findById(id);
    if (!existing) throw new NotFoundError("Product");
    return productRepository.update(id, data);
  },

  async delete(id: string) {
    const existing = await productRepository.findById(id);
    if (!existing) throw new NotFoundError("Product");
    return productRepository.delete(id);
  },
};
