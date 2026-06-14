import { z } from "zod";

export const financeRecordSchema = z.object({
  year: z.number().int().min(2000).max(2100),
  type: z.enum(["INCOME", "EXPENSE"]),
  categoryId: z.string().min(1, "Kategori wajib diisi"),
  categoryEn: z.string().min(1, "Category is required"),
  subcategoryId: z.string().optional().nullable(),
  subcategoryEn: z.string().optional().nullable(),
  amount: z.number().min(0, "Jumlah harus >= 0"),
  budget: z.number().min(0).optional().nullable(),
  sourceId: z.string().optional().nullable(),
  sourceEn: z.string().optional().nullable(),
  descriptionId: z.string().optional().nullable(),
  descriptionEn: z.string().optional().nullable(),
});

export const createFinanceSchema = financeRecordSchema;
export const updateFinanceSchema = financeRecordSchema.partial();

export const financeFilterSchema = z.object({
  year: z.coerce.number().int().optional(),
  type: z.enum(["INCOME", "EXPENSE"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(50),
});

export type FinanceInput = z.infer<typeof financeRecordSchema>;
export type FinanceFilters = z.infer<typeof financeFilterSchema>;
