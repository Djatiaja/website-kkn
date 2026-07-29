import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/lib/middleware/error";
import { withAuth } from "@/lib/middleware/auth";
import { userService } from "@/services/user.service";
import { updateUserSchema } from "@/lib/validations/user";

export const GET = withAuth(
  withErrorHandler(async (
    req: NextRequest,
    context: unknown
  ) => {
    const { id } = await (context as { params: Promise<{ id: string }> }).params;
    const user = await userService.findById(id);
    return NextResponse.json(user);
  }),
  ["ADMIN"]
);

export const PUT = withAuth(
  withErrorHandler(async (
    req: NextRequest,
    context: unknown
  ) => {
    const { id } = await (context as { params: Promise<{ id: string }> }).params;
    const body = await req.json();
    const validated = updateUserSchema.parse(body);
    const user = await userService.update(id, validated);
    return NextResponse.json(user);
  }),
  ["ADMIN"]
);

export const DELETE = withAuth(
  withErrorHandler(async (
    req: NextRequest,
    context: unknown
  ) => {
    const { id } = await (context as { params: Promise<{ id: string }> }).params;
    await userService.delete(id);
    return new NextResponse(null, { status: 204 });
  }),
  ["ADMIN"]
);
