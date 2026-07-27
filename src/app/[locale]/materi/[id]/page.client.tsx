"use client";

import { useMaterial } from "@/hooks/useMaterials";
import { MaterialDetail } from "@/components/material/MaterialDetail";
import { MaterialPreview } from "@/components/material/MaterialPreview";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export function MaterialDetailClient({
  id,
  locale,
}: {
  id: string;
  locale: "id" | "en";
}) {
  const { data: material, isLoading } = useMaterial(id);
  const t = useTranslations("materials");

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24 space-y-8">
        <Skeleton className="h-10 w-32" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-9 w-3/4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
          <div className="md:col-span-1">
            <div className="bg-card rounded-xl border p-6 shadow-sm">
              <Skeleton className="aspect-video rounded-lg mb-6" />
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
                <Skeleton className="h-10 w-full mt-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!material) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">{t("noResults")}</h2>
        <Link href="/materi">
          <Button>Kembali ke Daftar Materi</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24 space-y-8">
      <div className="mb-4 -ml-4">
        <Link href={`/${locale}/materi`}>
          <Button variant="ghost" className="text-muted-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
        </Link>
      </div>

      <MaterialDetail material={material} locale={locale} />
      
      {(material.fileType === "PDF" || material.fileType === "IMAGE" || material.fileType === "VIDEO") && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">{t("preview")}</h2>
          <MaterialPreview material={material} />
        </div>
      )}
    </div>
  );
}
