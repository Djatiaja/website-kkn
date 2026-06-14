import { profileRepository } from "@/repositories/profile.repository";
import { NotFoundError } from "@/lib/errors";
import type { Prisma } from "@prisma/client";

export const profileService = {
  async get() {
    const profile = await profileRepository.get();
    if (!profile) throw new NotFoundError("Village profile");
    return profile;
  },

  async update(id: string, data: Prisma.VillageProfileUpdateInput) {
    return profileRepository.update(id, data);
  },

  async getMembers(profileId: string) {
    return profileRepository.getMembers(profileId);
  },

  async createMember(data: Prisma.OrganizationMemberUncheckedCreateInput) {
    return profileRepository.createMember(data);
  },

  async updateMember(id: string, data: Prisma.OrganizationMemberUpdateInput) {
    const existing = await profileRepository.getMember(id);
    if (!existing) throw new NotFoundError("Organization member");
    return profileRepository.updateMember(id, data);
  },

  async deleteMember(id: string) {
    const existing = await profileRepository.getMember(id);
    if (!existing) throw new NotFoundError("Organization member");
    return profileRepository.deleteMember(id);
  },
};
