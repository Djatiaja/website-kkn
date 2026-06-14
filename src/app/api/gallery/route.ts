import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/lib/middleware/error";
import { withAuth } from "@/lib/middleware/auth";
import { galleryService } from "@/services/gallery.service";
import type { GalleryType } from "@prisma/client";

export const GET = withErrorHandler(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);

  const filters = {
    type: searchParams.get("type") as GalleryType | undefined,
    category: searchParams.get("category") || undefined,
    page: searchParams.has("page") ? Number(searchParams.get("page")) : 1,
    pageSize: searchParams.has("pageSize") ? Number(searchParams.get("pageSize")) : 12,
  };

  const result = await galleryService.getAll(filters);
  return NextResponse.json(result);
});

export const POST = withAuth(
  withErrorHandler(async (req: NextRequest) => {
    const body = await req.json();
    const item = await galleryService.create(body);
    return NextResponse.json(item, { status: 201 });
  }),
  ["ADMIN"]
);
