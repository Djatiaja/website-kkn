import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(1, "Nama desa wajib diisi"),
  descriptionId: z.string().min(10, "Deskripsi minimal 10 karakter"),
  descriptionEn: z.string().min(10, "Description min 10 characters"),
  visionId: z.string().min(1, "Visi wajib diisi"),
  visionEn: z.string().min(1, "Vision is required"),
  missionId: z.string().min(1, "Misi wajib diisi"),
  missionEn: z.string().min(1, "Mission is required"),
  historyId: z.string().min(10, "Sejarah minimal 10 karakter"),
  historyEn: z.string().min(10, "History min 10 characters"),
  heroVideoUrl: z.string().optional().nullable(),
  address: z.string().min(1, "Alamat wajib diisi"),
  phone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  population: z.number().int().min(0).optional().nullable(),
  area: z.number().min(0).optional().nullable(),
  socialMedia: z.record(z.string(), z.string()).optional().nullable(),
});

export const updateProfileSchema = profileSchema.partial();

export const memberSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  positionId: z.string().min(1, "Jabatan wajib diisi"),
  positionEn: z.string().min(1, "Position is required"),
  photoUrl: z.string().optional().nullable(),
  order: z.number().int().min(0),
  profileId: z.string().min(1),
});

export const createMemberSchema = memberSchema;
export const updateMemberSchema = memberSchema.partial();

export type ProfileInput = z.infer<typeof profileSchema>;
export type MemberInput = z.infer<typeof memberSchema>;
