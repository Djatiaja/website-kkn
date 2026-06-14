import { NextResponse } from "next/server";
import { withErrorHandler } from "@/lib/middleware/error";
import { financeService } from "@/services/finance.service";

export const GET = withErrorHandler(async () => {
  const years = await financeService.getYears();
  return NextResponse.json(years);
});
