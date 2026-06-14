import { NextResponse } from "next/server";
import { withErrorHandler } from "@/lib/middleware/error";
import { withAuth } from "@/lib/middleware/auth";
import { prisma } from "@/lib/prisma";

export const GET = withAuth(
  withErrorHandler(async () => {
    const [products, news, gallery, mapFeatures, financeRecords] =
      await Promise.all([
        prisma.product.count(),
        prisma.news.count(),
        prisma.galleryItem.count(),
        prisma.mapFeature.count({ where: { isVisible: true } }),
        prisma.financeRecord.aggregate({
          _sum: { amount: true },
          where: { type: "INCOME", year: new Date().getFullYear() },
        }),
      ]);

    const totalIncome = financeRecords._sum.amount ?? 0;

    return NextResponse.json({
      products,
      news,
      gallery,
      mapFeatures,
      totalIncome,
    });
  }),
  ["ADMIN", "EDITOR"]
);
