import { z } from "zod";

export const productSchema = z.object({
  nameId: z.string().min(1, "Nama produk wajib diisi"),
  nameEn: z.string().min(1, "Product name is required"),
  descriptionId: z.string().min(10, "Deskripsi minimal 10 karakter"),
  descriptionEn: z.string().min(10, "Description min 10 characters"),
  category: z.enum(["UMKM", "WISATA", "PERTANIAN", "KERAJINAN", "KULINER"]),
  price: z.number().min(0, "Harga harus >= 0").optional().nullable(),
  unit: z.string().optional().nullable(),
  contact: z.string().optional().nullable(),
  storeImageUrl: z.string().optional().nullable(),
  productionImageUrl: z.string().optional().nullable(),
  gallery: z.array(z.string()).optional().nullable(),
  locationUrl: z.string().optional().nullable(),
  specificationsId: z.string().optional().nullable(),
  specificationsEn: z.string().optional().nullable(),
  isPotential: z.boolean().default(false),
  investmentRequired: z.number().min(0, "Investasi harus >= 0").optional().nullable(),
  investmentDetailsId: z.string().optional().nullable(),
  investmentDetailsEn: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export const createProductSchema = productSchema;
export const updateProductSchema = productSchema.partial();

export const productFilterSchema = z.object({
  category: z.enum(["UMKM", "WISATA", "PERTANIAN", "KERAJINAN", "KULINER"]).optional(),
  search: z.string().optional(),
  isActive: z.coerce.boolean().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(12),
});

export type ProductInput = z.infer<typeof productSchema>;
export type ProductFilters = z.infer<typeof productFilterSchema>;
