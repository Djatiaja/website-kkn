import { NextRequest, NextResponse } from "next/server";
import { AppError } from "@/lib/errors";
import { Prisma } from "@prisma/client";

type RouteHandler = (
  req: NextRequest,
  context?: unknown
) => Promise<NextResponse>;

export function withErrorHandler(handler: RouteHandler): RouteHandler {
  return async (req, context) => {
    try {
      return await handler(req, context);
    } catch (error) {
      // Zod validation error (v4 uses issues)
      if (error instanceof Error && "issues" in error) {
        const zodError = error as Error & { issues: Array<{ path: (string | number)[]; message: string }> };
        return NextResponse.json(
          {
            error: "Validation Error",
            details: zodError.issues.map((e) => ({
              field: e.path.join("."),
              message: e.message,
            })),
          },
          { status: 400 }
        );
      }

      // Custom app error
      if (error instanceof AppError) {
        return NextResponse.json(
          { error: error.message, details: error.details },
          { status: error.statusCode }
        );
      }

      // Prisma known errors
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return NextResponse.json(
            { error: "Record not found" },
            { status: 404 }
          );
        }
        if (error.code === "P2002") {
          return NextResponse.json(
            { error: "Data sudah ada (duplicate)" },
            { status: 409 }
          );
        }
      }

      // Unknown error
      console.error("Unhandled error:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  };
}
