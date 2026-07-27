import { FileText, FileDown, File, FileAudio, FileVideo, FileImage, FileSpreadsheet } from "lucide-react";
import type { MaterialFileType } from "@/types";

interface FileTypeIconProps {
  type: MaterialFileType;
  className?: string;
}

export function FileTypeIcon({ type, className = "h-6 w-6" }: FileTypeIconProps) {
  switch (type) {
    case "PDF":
      return <FileText className={className} />;
    case "DOC":
      return <File className={className} />;
    case "VIDEO":
      return <FileVideo className={className} />;
    case "IMAGE":
      return <FileImage className={className} />;
    default:
      return <FileDown className={className} />;
  }
}
