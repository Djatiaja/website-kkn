import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/lib/middleware/error";
import { withAuth } from "@/lib/middleware/auth";
import { mapService } from "@/services/map.service";
import type { MapFeatureType } from "@prisma/client";

export const GET = withErrorHandler(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);

  const filters = {
    type: searchParams.get("type") as MapFeatureType | undefined,
    isVisible: searchParams.has("isVisible")
      ? searchParams.get("isVisible") === "true"
      : undefined,
  };

  const features = await mapService.getAll(filters);
  return NextResponse.json(features);
});

export const POST = withAuth(
  withErrorHandler(async (req: NextRequest) => {
    const body = await req.json();
    const feature = await mapService.create(body);
    return NextResponse.json(feature, { status: 201 });
  }),
  ["ADMIN"]
);
