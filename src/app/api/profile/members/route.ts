import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/lib/middleware/error";
import { withAuth } from "@/lib/middleware/auth";
import { profileService } from "@/services/profile.service";

export const GET = withErrorHandler(async () => {
  const profile = await profileService.get();
  const members = await profileService.getMembers(profile.id);
  return NextResponse.json(members);
});

export const POST = withAuth(
  withErrorHandler(async (req: NextRequest) => {
    const body = await req.json();
    const profile = await profileService.get();
    const member = await profileService.createMember({
      ...body,
      profileId: profile.id,
    });
    return NextResponse.json(member);
  }),
  ["ADMIN"]
);
