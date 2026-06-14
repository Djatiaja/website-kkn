import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/lib/middleware/error";
import { withAuth } from "@/lib/middleware/auth";
import { productService } from "@/services/product.service";
import { createProductSchema } from "@/lib/validations/product";
import type { ProductCategory } from "@prisma/client";

export const GET = withErrorHandler(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);

  const filters = {
    category: searchParams.get("category") as ProductCategory | undefined,
    search: searchParams.get("search") || undefined,
    isActive: searchParams.has("isActive")
      ? searchParams.get("isActive") === "true"
      : undefined,
    featured: searchParams.has("featured")
      ? searchParams.get("featured") === "true"
      : undefined,
    page: searchParams.has("page") ? Number(searchParams.get("page")) : 1,
    pageSize: searchParams.has("pageSize")
      ? Number(searchParams.get("pageSize"))
      : searchParams.has("limit")
        ? Number(searchParams.get("limit"))
        : 12,
  };

  const result = await productService.getAll(filters);
  return NextResponse.json(result);
});

export const POST = withAuth(
  withErrorHandler(async (req: NextRequest) => {
    const body = await req.json();
    const validated = createProductSchema.parse(body);
    const product = await productService.create(validated);
    return NextResponse.json(product, { status: 201 });
  })
);
