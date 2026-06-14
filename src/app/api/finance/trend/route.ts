import { NextResponse } from "next/server";
import { withErrorHandler } from "@/lib/middleware/error";
import { prisma } from "@/lib/prisma";

export const GET = withErrorHandler(async () => {
  const records = await prisma.financeRecord.findMany({
    orderBy: { year: "asc" },
  });

  const yearMap = new Map<number, { income: number; expense: number }>();

  for (const r of records) {
    const existing = yearMap.get(r.year) || { income: 0, expense: 0 };
    if (r.type === "INCOME") existing.income += r.amount;
    else existing.expense += r.amount;
    yearMap.set(r.year, existing);
  }

  const trend = Array.from(yearMap.entries())
    .map(([year, data]) => ({ year, ...data }))
    .sort((a, b) => a.year - b.year);

  return NextResponse.json(trend);
});
