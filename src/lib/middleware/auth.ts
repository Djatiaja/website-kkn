import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import type { UserRole } from "@prisma/client";

type RouteHandler = (
  req: NextRequest,
  context?: unknown
) => Promise<NextResponse>;

export function withAuth(
  handler: RouteHandler,
  roles?: UserRole[]
): RouteHandler {
  return async (req, context) => {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized — login required" },
        { status: 401 }
      );
    }

    if (roles && !roles.includes(session.user.role as UserRole)) {
      return NextResponse.json(
        { error: "Forbidden — insufficient permissions" },
        { status: 403 }
      );
    }

    return handler(req, context);
  };
}
