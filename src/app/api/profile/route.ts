import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/lib/middleware/error";
import { withAuth } from "@/lib/middleware/auth";
import { profileService } from "@/services/profile.service";

export const GET = withErrorHandler(async () => {
  const profile = await profileService.get();
  return NextResponse.json(profile);
});

export const PUT = withAuth(
  withErrorHandler(async (req: NextRequest) => {
    const body = await req.json();
    const profile = await profileService.get();
    const updated = await profileService.update(profile.id, body);
    return NextResponse.json(updated);
  }),
  ["ADMIN"]
);
