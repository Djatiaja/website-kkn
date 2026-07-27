import { z } from "zod";

export const materialSchema = z.object({
  titleId: z.string().min(3, "Judul minimal 3 karakter"),
  titleEn: z.string().min(3, "Title min 3 characters"),
  descriptionId: z.string().max(1000).optional().nullable(),
  descriptionEn: z.string().max(1000).optional().nullable(),
  category: z.enum(["PENDIDIKAN", "KESEHATAN", "PERTANIAN", "TEKNOLOGI", "UMUM"]),
  isPublished: z.boolean(),
});

export const createMaterialSchema = materialSchema;
export const updateMaterialSchema = materialSchema.partial();

export const materialFilterSchema = z.object({
  category: z.enum(["PENDIDIKAN", "KESEHATAN", "PERTANIAN", "TEKNOLOGI", "UMUM"]).optional(),
  fileType: z.enum(["PDF", "DOC", "VIDEO", "IMAGE", "OTHER"]).optional(),
  isPublished: z.coerce.boolean().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(12),
  sortBy: z.enum(["createdAt", "downloadCount", "title"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type MaterialInput = z.infer<typeof materialSchema>;
export type MaterialFilters = z.infer<typeof materialFilterSchema>;
