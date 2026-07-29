import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email("Email tidak valid"),
  name: z.string().min(1, "Nama wajib diisi"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  role: z.enum(["ADMIN", "EDITOR"], {
    message: "Role harus ADMIN atau EDITOR",
  }),
});

export const updateUserSchema = z.object({
  email: z.string().email("Email tidak valid").optional(),
  name: z.string().min(1, "Nama wajib diisi").optional(),
  role: z.enum(["ADMIN", "EDITOR"], {
    message: "Role harus ADMIN atau EDITOR",
  }).optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
