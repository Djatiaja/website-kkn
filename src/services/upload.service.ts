import { writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";
import { v4 as uuid } from "uuid";
import { AppError } from "@/lib/errors";

const UPLOAD_DIR = join(process.cwd(), "public", "uploads");

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm"];
const MAX_IMAGE_SIZE = 10_000_000; // 10MB
const MAX_VIDEO_SIZE = 100_000_000; // 100MB

export const uploadService = {
  async saveFile(file: File, folder: string): Promise<string> {
    const isVideo = file.type.startsWith("video/");
    const allowedTypes = isVideo ? ALLOWED_VIDEO_TYPES : ALLOWED_IMAGE_TYPES;
    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;

    if (!allowedTypes.includes(file.type)) {
      throw new AppError(400, `Tipe file tidak diizinkan: ${file.type}`);
    }

    if (file.size > maxSize) {
      throw new AppError(400, `File terlalu besar (maks ${maxSize / 1_000_000}MB)`);
    }

    const dir = join(UPLOAD_DIR, folder);
    await mkdir(dir, { recursive: true });

    const ext = file.name.split(".").pop();
    const filename = `${uuid()}.${ext}`;
    const filepath = join(dir, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filepath, buffer);

    return `/uploads/${folder}/${filename}`;
  },

  async deleteFile(url: string): Promise<void> {
    const filepath = join(process.cwd(), "public", url);
    await unlink(filepath).catch(() => {});
  },
};
