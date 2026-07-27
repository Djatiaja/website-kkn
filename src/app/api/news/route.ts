import { NextRequest, NextResponse } from "next/server";
import { withErrorHandler } from "@/lib/middleware/error";
import { withAuth } from "@/lib/middleware/auth";
import { newsService } from "@/services/news.service";
import { auth } from "@/lib/auth";

export const GET = withErrorHandler(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);

  const filters = {
    category: searchParams.get("category") as string | undefined,
    search: searchParams.get("search") || undefined,
    isPublished: searchParams.has("published")
      ? searchParams.get("published") === "true"
      : searchParams.has("isPublished")
        ? searchParams.get("isPublished") === "true"
        : undefined,
    page: searchParams.has("page") ? Number(searchParams.get("page")) : 1,
    pageSize: searchParams.has("pageSize")
      ? Number(searchParams.get("pageSize"))
      : searchParams.has("limit")
        ? Number(searchParams.get("limit"))
        : 10,
  };

  const result = await newsService.getAll(filters);
  return NextResponse.json(result);
});

export const POST = withAuth(
  withErrorHandler(async (req: NextRequest) => {
    const session = await auth();
    const body = await req.json();
    const news = await newsService.create({ ...body, authorId: session!.user.id });
    return NextResponse.json(news, { status: 201 });
  }),
  ["ADMIN"]
);
