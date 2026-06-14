import { z } from "zod";

export const newsSchema = z.object({
  titleId: z.string().min(1, "Judul wajib diisi"),
  titleEn: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug wajib diisi").regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan dash"),
  contentId: z.string().min(10, "Konten minimal 10 karakter"),
  contentEn: z.string().min(10, "Content min 10 characters"),
  excerptId: z.string().optional().nullable(),
  excerptEn: z.string().optional().nullable(),
  coverImageUrl: z.string().optional().nullable(),
  category: z.enum(["PENGUMUMAN", "KEGIATAN", "PEMBANGUNAN", "UMUM"]),
  isPublished: z.boolean().default(false),
});

export const createNewsSchema = newsSchema;
export const updateNewsSchema = newsSchema.partial();

export const newsFilterSchema = z.object({
  category: z.enum(["PENGUMUMAN", "KEGIATAN", "PEMBANGUNAN", "UMUM"]).optional(),
  isPublished: z.coerce.boolean().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
});

export type NewsInput = z.infer<typeof newsSchema>;
export type NewsFilters = z.infer<typeof newsFilterSchema>;
