import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/lib/middleware/error";
import { withAuth } from "@/lib/middleware/auth";
import { productService } from "@/services/product.service";
import { updateProductSchema } from "@/lib/validations/product";

export const GET = withErrorHandler(
  async (_req: NextRequest, context: unknown) => {
    const { params } = context as { params: Promise<{ id: string }> };
    const { id } = await params;
    const product = await productService.getById(id);
    return NextResponse.json(product);
  }
);

export const PUT = withAuth(
  withErrorHandler(async (req: NextRequest, context: unknown) => {
    const { params } = context as { params: Promise<{ id: string }> };
    const { id } = await params;
    const body = await req.json();
    const validated = updateProductSchema.parse(body);
    const product = await productService.update(id, validated);
    return NextResponse.json(product);
  })
);

export const DELETE = withAuth(
  withErrorHandler(async (_req: NextRequest, context: unknown) => {
    const { params } = context as { params: Promise<{ id: string }> };
    const { id } = await params;
    await productService.delete(id);
    return NextResponse.json({ message: "Product deleted" });
  })
);
