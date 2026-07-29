import { userRepository } from "@/repositories/user.repository";
import { NotFoundError, AppError } from "@/lib/errors";
import { hash } from "bcryptjs";

export const userService = {
  async findAll() {
    return userRepository.findAll();
  },

  async findById(id: string) {
    const user = await userRepository.findById(id);
    if (!user) throw new NotFoundError("User");
    return user;
  },

  async create(data: { email: string; name: string; password: string; role: "ADMIN" | "EDITOR" }) {
    // Check if email already exists
    const existing = await userRepository.findByEmail(data.email);
    if (existing) {
      throw new AppError(409, "Email sudah terdaftar");
    }

    const hashedPassword = await hash(data.password, 12);
    return userRepository.create({
      email: data.email,
      name: data.name,
      password: hashedPassword,
      role: data.role,
    });
  },

  async update(id: string, data: { email?: string; name?: string; role?: "ADMIN" | "EDITOR" }) {
    const existing = await userRepository.findById(id);
    if (!existing) throw new NotFoundError("User");

    // If email is being updated, check uniqueness
    if (data.email && data.email !== existing.email) {
      const emailExists = await userRepository.findByEmail(data.email);
      if (emailExists) {
        throw new AppError(409, "Email sudah digunakan");
      }
    }

    return userRepository.update(id, data);
  },

  async delete(id: string) {
    const existing = await userRepository.findById(id);
    if (!existing) throw new NotFoundError("User");

    // Prevent deleting the last admin
    if (existing.role === "ADMIN") {
      const adminCount = await userRepository.count();
      const admins = await userRepository.findAll();
      const adminUsers = admins.filter(u => u.role === "ADMIN");
      if (adminUsers.length <= 1) {
        throw new AppError(400, "Tidak dapat menghapus admin terakhir");
      }
    }

    return userRepository.delete(id);
  },
};
