import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/lib/middleware/error";
import { withAuth } from "@/lib/middleware/auth";
import { profileService } from "@/services/profile.service";

export const GET = withErrorHandler(async (req: NextRequest, context: unknown) => {
  const { params } = context as { params: Promise<{ id: string }> };
  const { id } = await params;
  const profile = await profileService.get();
  const members = await profileService.getMembers(profile.id);
  const member = members.find(m => m.id === id);
  
  if (!member) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }
  
  return NextResponse.json(member);
});

export const PUT = withAuth(
  withErrorHandler(async (req: NextRequest, context: unknown) => {
    const { params } = context as { params: Promise<{ id: string }> };
    const { id } = await params;
    const body = await req.json();
    const member = await profileService.updateMember(id, body);
    return NextResponse.json(member);
  }),
  ["ADMIN"]
);

export const DELETE = withAuth(
  withErrorHandler(async (req: NextRequest, context: unknown) => {
    const { params } = context as { params: Promise<{ id: string }> };
    const { id } = await params;
    await profileService.deleteMember(id);
    return NextResponse.json({ success: true });
  }),
  ["ADMIN"]
);
