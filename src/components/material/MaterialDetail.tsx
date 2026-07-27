import { DigitalMaterial } from "@/types";
import { formatBytes } from "@/lib/utils";
import { format } from "date-fns";
import { id as idLocale, enUS as enLocale } from "date-fns/locale";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Download, Calendar, HardDrive, FileType } from "lucide-react";
import Image from "next/image";
import { FileTypeIcon } from "./FileTypeIcon";
import { useTranslations } from "next-intl";

interface MaterialDetailProps {
  material: DigitalMaterial;
  locale: "id" | "en";
}

export function MaterialDetail({ material, locale }: MaterialDetailProps) {
  const t = useTranslations("materials");
  const title = locale === "id" ? material.titleId : material.titleEn;
  const description = locale === "id" ? material.descriptionId : material.descriptionEn;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-6">
        <div>
          <Badge variant="neutral" className="mb-4">
            {t(`categories.${material.category}`)}
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight mb-4">{title}</h1>
          <div className="rich-text prose max-w-none text-muted-foreground overflow-hidden" dangerouslySetInnerHTML={{ __html: description || (locale === "id" ? "Tidak ada deskripsi." : "No description available.") }} />
        </div>
      </div>

      <div className="md:col-span-1">
        <div className="bg-card rounded-xl border p-6 sticky top-24 shadow-sm">
          <div className="aspect-video relative rounded-lg overflow-hidden bg-muted mb-6 flex items-center justify-center">
            {material.thumbnailUrl ? (
              <Image
                src={material.thumbnailUrl}
                alt={title}
                fill
                className="object-cover"
              />
            ) : (
              <FileTypeIcon type={material.fileType} className="h-16 w-16 opacity-50 text-neutral-400" />
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center text-muted-foreground">
                <FileType className="mr-2 h-4 w-4" />
                {t("fileType")}
              </span>
              <span className="font-medium">{material.fileType}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center text-muted-foreground">
                <HardDrive className="mr-2 h-4 w-4" />
                {t("fileSize")}
              </span>
              <span className="font-medium">{formatBytes(material.fileSize)}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" />
                {t("uploadDate")}
              </span>
              <span className="font-medium">
                {format(new Date(material.createdAt), "dd MMM yyyy", {
                  locale: locale === "id" ? idLocale : enLocale,
                })}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center text-muted-foreground">
                <Download className="mr-2 h-4 w-4" />
                {t("downloadCount")}
              </span>
              <span className="font-medium">{material.downloadCount}</span>
            </div>

            <div className="pt-4">
              <a href={`/api/materials/${material.id}/download`} download className="w-full block">
                <Button className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  {t("download")}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
