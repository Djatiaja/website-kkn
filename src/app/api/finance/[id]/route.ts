import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/lib/middleware/error";
import { withAuth } from "@/lib/middleware/auth";
import { financeService } from "@/services/finance.service";

export const PUT = withAuth(
  withErrorHandler(async (req: NextRequest, context: unknown) => {
    const { id } = (context as { params: Promise<{ id: string }> }).params
      ? await (context as { params: Promise<{ id: string }> }).params
      : { id: "" };
    const body = await req.json();
    const record = await financeService.update(id, body);
    return NextResponse.json(record);
  }),
  ["ADMIN"]
);

export const DELETE = withAuth(
  withErrorHandler(async (_req: NextRequest, context: unknown) => {
    const { id } = (context as { params: Promise<{ id: string }> }).params
      ? await (context as { params: Promise<{ id: string }> }).params
      : { id: "" };
    await financeService.delete(id);
    return NextResponse.json({ message: "Deleted" });
  }),
  ["ADMIN"]
);
