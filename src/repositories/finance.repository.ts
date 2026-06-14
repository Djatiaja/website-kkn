import { prisma } from "@/lib/prisma";
import type { Prisma, FinanceType } from "@prisma/client";

export interface FinanceFilters {
  year?: number;
  type?: FinanceType;
  page?: number;
  pageSize?: number;
}

export const financeRepository = {
  async findMany(filters: FinanceFilters = {}) {
    const { year, type, page = 1, pageSize = 50 } = filters;

    const where: Prisma.FinanceRecordWhereInput = {
      ...(year && { year }),
      ...(type && { type }),
    };

    const [data, total] = await Promise.all([
      prisma.financeRecord.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: [{ year: "desc" }, { type: "asc" }],
      }),
      prisma.financeRecord.count({ where }),
    ]);

    return { data, total, page, pageSize };
  },

  async findById(id: string) {
    return prisma.financeRecord.findUnique({ where: { id } });
  },

  async getYears() {
    const records = await prisma.financeRecord.findMany({
      select: { year: true },
      distinct: ["year"],
      orderBy: { year: "desc" },
    });
    return records.map((r) => r.year);
  },

  async getSummary(year: number) {
    const records = await prisma.financeRecord.findMany({
      where: { year },
    });

    const totalIncome = records
      .filter((r) => r.type === "INCOME")
      .reduce((sum, r) => sum + r.amount, 0);

    const totalExpense = records
      .filter((r) => r.type === "EXPENSE")
      .reduce((sum, r) => sum + r.amount, 0);

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    };
  },

  async create(data: Prisma.FinanceRecordCreateInput) {
    return prisma.financeRecord.create({ data });
  },

  async update(id: string, data: Prisma.FinanceRecordUpdateInput) {
    return prisma.financeRecord.update({ where: { id }, data });
  },

  async delete(id: string) {
    return prisma.financeRecord.delete({ where: { id } });
  },
};
