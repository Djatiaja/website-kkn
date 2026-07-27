import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/lib/middleware/error";
import { withAuth } from "@/lib/middleware/auth";
import { profileService } from "@/services/profile.service";

export const POST = withAuth(
  withErrorHandler(async (req: NextRequest) => {
    const body = await req.json();
    const { profileId, textId, textEn, order } = body;
    const item = await profileService.createMissionItem({
      profileId,
      textId: textId || "",
      textEn: textEn || "",
      order: order ?? 0,
    });
    return NextResponse.json(item);
  }),
  ["ADMIN"]
);
