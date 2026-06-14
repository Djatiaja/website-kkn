import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/lib/middleware/error";
import { withAuth } from "@/lib/middleware/auth";
import { newsService } from "@/services/news.service";

export const GET = withErrorHandler(async (_req: NextRequest, context: unknown) => {
  const { id } = await (context as { params: Promise<{ id: string }> }).params;
  const news = await newsService.getById(id);
  return NextResponse.json(news);
});

export const PUT = withAuth(
  withErrorHandler(async (req: NextRequest, context: unknown) => {
    const { id } = await (context as { params: Promise<{ id: string }> }).params;
    const body = await req.json();
    const news = await newsService.update(id, body);
    return NextResponse.json(news);
  }),
  ["ADMIN"]
);

export const DELETE = withAuth(
  withErrorHandler(async (_req: NextRequest, context: unknown) => {
    const { id } = await (context as { params: Promise<{ id: string }> }).params;
    await newsService.delete(id);
    return NextResponse.json({ message: "Deleted" });
  }),
  ["ADMIN"]
);
