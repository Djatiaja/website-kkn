import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/lib/middleware/error";
import { withAuth } from "@/lib/middleware/auth";
import { profileService } from "@/services/profile.service";

export const PUT = withAuth(
  withErrorHandler(async (req: NextRequest, context: any) => {
    const { id } = await context.params;
    const body = await req.json();
    const item = await profileService.updateMissionItem(id, body);
    return NextResponse.json(item);
  }),
  ["ADMIN"]
);

export const DELETE = withAuth(
  withErrorHandler(async (req: NextRequest, context: any) => {
    const { id } = await context.params;
    await profileService.deleteMissionItem(id);
    return NextResponse.json({ success: true });
  }),
  ["ADMIN"]
);
