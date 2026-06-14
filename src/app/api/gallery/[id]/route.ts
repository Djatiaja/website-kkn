import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/lib/middleware/error";
import { withAuth } from "@/lib/middleware/auth";
import { galleryService } from "@/services/gallery.service";

export const PUT = withAuth(
  withErrorHandler(async (req: NextRequest, context: unknown) => {
    const { id } = await (context as { params: Promise<{ id: string }> }).params;
    const body = await req.json();
    const item = await galleryService.update(id, body);
    return NextResponse.json(item);
  }),
  ["ADMIN"]
);

export const DELETE = withAuth(
  withErrorHandler(async (_req: NextRequest, context: unknown) => {
    const { id } = await (context as { params: Promise<{ id: string }> }).params;
    await galleryService.delete(id);
    return NextResponse.json({ message: "Deleted" });
  }),
  ["ADMIN"]
);
