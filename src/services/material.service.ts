import {
  materialRepository,
  type MaterialFilters,
} from "@/repositories/material.repository";
import { uploadService } from "@/services/upload.service";
import { NotFoundError, AppError } from "@/lib/errors";
import type { MaterialFileType } from "@/types";
import { createMaterialSchema, updateMaterialSchema } from "@/lib/validations/material";
import { join } from "path";
import { readFile } from "fs/promises";

// ─── Constants ──────────────────────────────────────────

const UPLOAD_FOLDER = "materials";
const THUMBNAIL_FOLDER = "materials/thumbnails";
const MAX_FILE_SIZE = 50_000_000; // 50MB
const MAX_THUMBNAIL_SIZE = 2_000_000; // 2MB

const MIME_TO_FILE_TYPE: Record<string, MaterialFileType> = {
  "application/pdf": "PDF",
  "application/msword": "DOC",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOC",
  "video/mp4": "VIDEO",
  "video/webm": "VIDEO",
  "image/jpeg": "IMAGE",
  "image/png": "IMAGE",
  "image/webp": "IMAGE",
};

const ALLOWED_MIME_TYPES = Object.keys(MIME_TO_FILE_TYPE);

// ─── Helpers ────────────────────────────────────────────

function resolveFileType(mimeType: string): MaterialFileType {
  return MIME_TO_FILE_TYPE[mimeType] ?? "OTHER";
}

function validateFile(file: File) {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new AppError(400, `Tipe file tidak diizinkan: ${file.type}`);
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new AppError(400, `File terlalu besar (maks ${MAX_FILE_SIZE / 1_000_000}MB)`);
  }
}

function validateThumbnail(file: File) {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    throw new AppError(400, `Thumbnail harus berupa gambar (JPG/PNG/WebP)`);
  }
  if (file.size > MAX_THUMBNAIL_SIZE) {
    throw new AppError(400, `Thumbnail terlalu besar (maks ${MAX_THUMBNAIL_SIZE / 1_000_000}MB)`);
  }
}

// ─── Service ────────────────────────────────────────────

export const materialService = {
  async getAll(filters: MaterialFilters) {
    return materialRepository.findMany(filters);
  },

  async getById(id: string) {
    const material = await materialRepository.findById(id);
    if (!material) throw new NotFoundError("Material");
    return material;
  },

  async create(formData: FormData) {
    // Parse text fields
    const raw = {
      titleId: formData.get("titleId") as string,
      titleEn: formData.get("titleEn") as string,
      descriptionId: formData.get("descriptionId") as string | null,
      descriptionEn: formData.get("descriptionEn") as string | null,
      category: formData.get("category") as string,
      isPublished: formData.get("isPublished") === "true",
    };

    const validated = createMaterialSchema.parse(raw);

    // File validation
    const file = formData.get("file") as File | null;
    if (!file || !(file instanceof File) || file.size === 0) {
      throw new AppError(400, "File wajib diupload");
    }
    validateFile(file);

    const fileType = resolveFileType(file.type);
    const fileUrl = await uploadService.saveFile(file, UPLOAD_FOLDER);

    // Thumbnail (optional)
    let thumbnailUrl: string | null = null;
    const thumbnail = formData.get("thumbnail") as File | null;
    if (thumbnail && thumbnail instanceof File && thumbnail.size > 0) {
      validateThumbnail(thumbnail);
      thumbnailUrl = await uploadService.saveFile(thumbnail, THUMBNAIL_FOLDER);
    }

    return materialRepository.create({
      ...validated,
      fileUrl,
      fileType,
      fileSize: file.size,
      fileName: file.name,
      thumbnailUrl,
    });
  },

  async update(id: string, formData: FormData) {
    const existing = await materialRepository.findById(id);
    if (!existing) throw new NotFoundError("Material");

    // Parse text fields
    const raw: Record<string, unknown> = {};
    for (const key of ["titleId", "titleEn", "descriptionId", "descriptionEn", "category"]) {
      const val = formData.get(key);
      if (val !== null) raw[key] = val;
    }
    const isPublished = formData.get("isPublished");
    if (isPublished !== null) raw.isPublished = isPublished === "true";

    const validated = updateMaterialSchema.parse(raw);

    // File replacement (optional)
    const updateData: Record<string, unknown> = { ...validated };

    const file = formData.get("file") as File | null;
    if (file && file instanceof File && file.size > 0) {
      validateFile(file);
      // Delete old file
      await uploadService.deleteFile(existing.fileUrl);
      // Upload new
      updateData.fileUrl = await uploadService.saveFile(file, UPLOAD_FOLDER);
      updateData.fileType = resolveFileType(file.type);
      updateData.fileSize = file.size;
      updateData.fileName = file.name;
    }

    // Thumbnail replacement (optional)
    const removeThumbnail = formData.get("removeThumbnail") === "true";
    const thumbnail = formData.get("thumbnail") as File | null;
    if (thumbnail && thumbnail instanceof File && thumbnail.size > 0) {
      validateThumbnail(thumbnail);
      if (existing.thumbnailUrl) {
        await uploadService.deleteFile(existing.thumbnailUrl);
      }
      updateData.thumbnailUrl = await uploadService.saveFile(thumbnail, THUMBNAIL_FOLDER);
    } else if (removeThumbnail && existing.thumbnailUrl) {
      await uploadService.deleteFile(existing.thumbnailUrl);
      updateData.thumbnailUrl = null;
    }

    return materialRepository.update(id, updateData);
  },

  async delete(id: string) {
    const existing = await materialRepository.findById(id);
    if (!existing) throw new NotFoundError("Material");

    // Clean up files
    await uploadService.deleteFile(existing.fileUrl);
    if (existing.thumbnailUrl) {
      await uploadService.deleteFile(existing.thumbnailUrl);
    }

    return materialRepository.delete(id);
  },

  async download(id: string) {
    const material = await materialRepository.findById(id);
    if (!material) throw new NotFoundError("Material");
    if (!material.isPublished) throw new NotFoundError("Material");

    // Increment download count
    await materialRepository.incrementDownload(id);

    const filePath = join(process.cwd(), "public", material.fileUrl);
    const buffer = await readFile(filePath);

    return {
      buffer,
      fileName: material.fileName,
      fileType: material.fileType,
      fileUrl: material.fileUrl,
    };
  },
};
