import { NextResponse } from "next/server";
import { withErrorHandler } from "@/lib/middleware/error";
import { withAuth } from "@/lib/middleware/auth";
import { prisma } from "@/lib/prisma";

export const GET = withAuth(
  withErrorHandler(async () => {
    const [products, news, gallery] =
      await Promise.all([
        prisma.product.count(),
        prisma.news.count(),
        prisma.galleryItem.count(),
      ]);

    return NextResponse.json({
      products,
      news,
      gallery,
    });
  }),
  ["ADMIN", "EDITOR"]
);
