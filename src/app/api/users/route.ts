import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/lib/middleware/error";
import { withAuth } from "@/lib/middleware/auth";
import { userService } from "@/services/user.service";
import { createUserSchema } from "@/lib/validations/user";

export const GET = withAuth(
  withErrorHandler(async () => {
    const users = await userService.findAll();
    return NextResponse.json(users);
  }),
  ["ADMIN"]
);

export const POST = withAuth(
  withErrorHandler(async (req: NextRequest) => {
    const body = await req.json();
    const validated = createUserSchema.parse(body);
    const user = await userService.create(validated);
    return NextResponse.json(user, { status: 201 });
  }),
  ["ADMIN"]
);
