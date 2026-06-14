import { financeRepository, type FinanceFilters } from "@/repositories/finance.repository";
import { NotFoundError } from "@/lib/errors";
import type { Prisma } from "@prisma/client";

export const financeService = {
  async getAll(filters: FinanceFilters) {
    return financeRepository.findMany(filters);
  },

  async getById(id: string) {
    const record = await financeRepository.findById(id);
    if (!record) throw new NotFoundError("Finance record");
    return record;
  },

  async getYears() {
    return financeRepository.getYears();
  },

  async getSummary(year: number) {
    return financeRepository.getSummary(year);
  },

  async create(data: Prisma.FinanceRecordCreateInput) {
    return financeRepository.create(data);
  },

  async update(id: string, data: Prisma.FinanceRecordUpdateInput) {
    const existing = await financeRepository.findById(id);
    if (!existing) throw new NotFoundError("Finance record");
    return financeRepository.update(id, data);
  },

  async delete(id: string) {
    const existing = await financeRepository.findById(id);
    if (!existing) throw new NotFoundError("Finance record");
    return financeRepository.delete(id);
  },
};
