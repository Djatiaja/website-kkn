import { NextRequest, NextResponse } from "next/server";
import { materialService } from "@/services/material.service";
import { withErrorHandler } from "@/lib/middleware/error";
import { extname } from "path";

export const GET = withErrorHandler(
  async (request: NextRequest, { params }: any) => {
    const { id } = await params;
    const result = await materialService.download(id);

    // Mime type fallback
    let contentType = "application/octet-stream";
    if (result.fileType === "PDF") contentType = "application/pdf";
    else if (result.fileType === "DOC") {
      if (result.fileName.endsWith(".docx")) {
        contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      } else {
        contentType = "application/msword";
      }
    } else if (result.fileType === "VIDEO") {
        contentType = result.fileName.endsWith(".webm") ? "video/webm" : "video/mp4";
    } else if (result.fileType === "IMAGE") {
        const ext = extname(result.fileName).toLowerCase();
        if (ext === ".png") contentType = "image/png";
        else if (ext === ".webp") contentType = "image/webp";
        else contentType = "image/jpeg";
    }

    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set("Content-Disposition", `attachment; filename="${result.fileName}"`);

    return new NextResponse(result.buffer, {
      status: 200,
      headers,
    });
  }
);
