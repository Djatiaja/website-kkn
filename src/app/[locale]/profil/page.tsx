import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { ProfileHero } from "@/components/profile/ProfileHero";
import { VisionMission } from "@/components/profile/VisionMission";
import { History } from "@/components/profile/History";
import { OrganizationChart } from "@/components/profile/OrganizationChart";
import { Demographics } from "@/components/profile/Demographics";

async function getProfileData() {
  const profile = await prisma.villageProfile.findFirst({
    include: { members: { orderBy: { order: "asc" } } },
  });
  return profile;
}

export default async function ProfilPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("profile");
  const profile = await getProfileData();

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-neutral-500">Data profil belum tersedia.</p>
      </div>
    );
  }

  const description = locale === "id" ? profile.descriptionId : profile.descriptionEn;
  const vision = locale === "id" ? profile.visionId : profile.visionEn;
  const mission = locale === "id" ? profile.missionId : profile.missionEn;
  const history = locale === "id" ? profile.historyId : profile.historyEn;

  const members = profile.members.map((m) => ({
    id: m.id,
    name: m.name,
    positionId: m.positionId,
    positionEn: m.positionEn,
    photoUrl: m.photoUrl,
    order: m.order,
  }));

  return (
    <>
      <ProfileHero
        title={t("title")}
        description={description}
      />

      <VisionMission
        visionTitle={t("vision.title")}
        missionTitle={t("mission.title")}
        vision={vision}
        mission={mission}
      />

      <History
        title={t("history.title")}
        content={history}
      />

      <OrganizationChart
        title={t("org.title")}
        members={members}
        locale={locale as "id" | "en"}
      />

      <Demographics
        title={t("demographics.title")}
        population={profile.population || 5247}
        area={profile.area || 1200}
        labels={{
          total: t("demographics.total"),
          male: t("demographics.male"),
          female: t("demographics.female"),
          households: t("demographics.households"),
        }}
      />
    </>
  );
}
