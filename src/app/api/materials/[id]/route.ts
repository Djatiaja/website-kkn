import { NextRequest, NextResponse } from "next/server";
import { materialService } from "@/services/material.service";
import { withAuth } from "@/lib/middleware/auth";
import { withErrorHandler } from "@/lib/middleware/error";

export const GET = withErrorHandler(
  async (request: NextRequest, { params }: any) => {
    const { id } = await params;
    const material = await materialService.getById(id);
    return NextResponse.json(material);
  }
);

export const PUT = withAuth(
  withErrorHandler(async (request: NextRequest, { params }: any) => {
    const { id } = await params;
    const formData = await request.formData();
    const material = await materialService.update(id, formData);
    return NextResponse.json(material);
  }),
  ["ADMIN"]
);

export const DELETE = withAuth(
  withErrorHandler(async (request: NextRequest, { params }: any) => {
    const { id } = await params;
    await materialService.delete(id);
    return new NextResponse(null, { status: 204 });
  }),
  ["ADMIN"]
);
