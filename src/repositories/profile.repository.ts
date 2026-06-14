import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const profileRepository = {
  async get() {
    return prisma.villageProfile.findFirst({
      include: {
        members: { orderBy: { order: "asc" } },
      },
    });
  },

  async update(id: string, data: Prisma.VillageProfileUpdateInput) {
    return prisma.villageProfile.update({
      where: { id },
      data,
      include: {
        members: { orderBy: { order: "asc" } },
      },
    });
  },

  async getMember(id: string) {
    return prisma.organizationMember.findUnique({ where: { id } });
  },

  async getMembers(profileId: string) {
    return prisma.organizationMember.findMany({
      where: { profileId },
      orderBy: { order: "asc" },
    });
  },

  async createMember(data: Prisma.OrganizationMemberUncheckedCreateInput) {
    return prisma.organizationMember.create({ data });
  },

  async updateMember(id: string, data: Prisma.OrganizationMemberUpdateInput) {
    return prisma.organizationMember.update({ where: { id }, data });
  },

  async deleteMember(id: string) {
    return prisma.organizationMember.delete({ where: { id } });
  },
};
