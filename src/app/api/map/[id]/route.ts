import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/lib/middleware/error";
import { withAuth } from "@/lib/middleware/auth";
import { mapService } from "@/services/map.service";

export const PUT = withAuth(
  withErrorHandler(async (req: NextRequest, context: unknown) => {
    const { id } = await (context as { params: Promise<{ id: string }> }).params;
    const body = await req.json();
    const feature = await mapService.update(id, body);
    return NextResponse.json(feature);
  }),
  ["ADMIN"]
);

export const DELETE = withAuth(
  withErrorHandler(async (_req: NextRequest, context: unknown) => {
    const { id } = await (context as { params: Promise<{ id: string }> }).params;
    await mapService.delete(id);
    return NextResponse.json({ message: "Deleted" });
  }),
  ["ADMIN"]
);
