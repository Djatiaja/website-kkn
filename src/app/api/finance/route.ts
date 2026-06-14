import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/lib/middleware/error";
import { withAuth } from "@/lib/middleware/auth";
import { financeService } from "@/services/finance.service";
import type { FinanceType } from "@prisma/client";

export const GET = withErrorHandler(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);

  const filters = {
    year: searchParams.has("year") ? Number(searchParams.get("year")) : undefined,
    type: searchParams.get("type") as FinanceType | undefined,
    page: searchParams.has("page") ? Number(searchParams.get("page")) : 1,
    pageSize: searchParams.has("pageSize") ? Number(searchParams.get("pageSize")) : 50,
  };

  const result = await financeService.getAll(filters);
  return NextResponse.json(result);
});

export const POST = withAuth(
  withErrorHandler(async (req: NextRequest) => {
    const body = await req.json();
    const record = await financeService.create(body);
    return NextResponse.json(record, { status: 201 });
  }),
  ["ADMIN"]
);
