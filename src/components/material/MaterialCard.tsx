import { DigitalMaterial } from "@/types";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Download } from "lucide-react";
import Image from "next/image";
import { FileTypeIcon } from "./FileTypeIcon";
import { FileSizeBadge } from "./FileSizeBadge";
import { format } from "date-fns";
import { id as idLocale, enUS as enLocale } from "date-fns/locale";
import { Button } from "@/components/ui/Button";

interface MaterialCardProps {
  material: DigitalMaterial;
  locale: "id" | "en";
}

export function MaterialCard({ material, locale }: MaterialCardProps) {
  const t = useTranslations("materials");
  const title = locale === "id" ? material.titleId : material.titleEn;
  const description = locale === "id" ? material.descriptionId : material.descriptionEn;

  return (
    <Link href={`/${locale}/materi/${material.id}`} className="block h-full">
    <Card className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="p-0 relative aspect-video bg-muted border-b">
        {material.thumbnailUrl ? (
          <Image
            src={material.thumbnailUrl}
            alt={title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-neutral-100 text-neutral-400">
            <FileTypeIcon type={material.fileType} className="h-16 w-16 opacity-50" />
          </div>
        )}
        <div className="absolute left-2 top-2 flex gap-2">
          <Badge variant="neutral" className="bg-background/80 backdrop-blur-sm">
            {t(`categories.${material.category}`)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-grow p-4">
        <h3 className="font-semibold line-clamp-2 mb-2" title={title}>{title}</h3>
        {description && (
          <div className="rich-text-excerpt text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: description }} />
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex flex-col gap-3">
        <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <FileTypeIcon type={material.fileType} className="h-3 w-3" />
            <FileSizeBadge size={material.fileSize} />
          </span>
          <span className="flex items-center gap-1">
            <Download className="h-3 w-3" />
            {material.downloadCount}
          </span>
        </div>
        <Button variant="outline" size="sm" className="w-full">
          {t("detail")}
        </Button>
      </CardFooter>
    </Card>
    </Link>
  );
}
