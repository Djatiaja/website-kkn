import { NextRequest, NextResponse } from "next/server";
import { materialService } from "@/services/material.service";
import { withAuth } from "@/lib/middleware/auth";
import { withErrorHandler } from "@/lib/middleware/error";

export const GET = withErrorHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);

  const filters = {
    search: searchParams.get("search") || undefined,
    category: searchParams.get("category") as any,
    fileType: searchParams.get("fileType") as any,
    isPublished: true, // Publik hanya bisa lihat yang published
    page: searchParams.has("page") ? parseInt(searchParams.get("page")!) : undefined,
    pageSize: searchParams.has("limit") ? parseInt(searchParams.get("limit")!) : undefined,
    sortBy: (searchParams.get("sortBy") as any) || undefined,
    sortOrder: (searchParams.get("sortOrder") as any) || undefined,
  };

  const result = await materialService.getAll(filters);
  return NextResponse.json(result);
});

export const POST = withAuth(
  withErrorHandler(async (request: NextRequest) => {
    const formData = await request.formData();
    const material = await materialService.create(formData);
    return NextResponse.json(material, { status: 201 });
  }),
  ["ADMIN"]
);
