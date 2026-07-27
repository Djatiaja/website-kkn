"use client";

import { DigitalMaterial } from "@/types";
import { formatBytes } from "@/lib/utils";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Table, type Column } from "@/components/ui/Table";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { PublishToggle } from "./PublishToggle";
import { useDeleteMaterial } from "@/hooks/useMaterials";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";

interface MaterialTableProps {
  materials: DigitalMaterial[];
}

export function MaterialTable({ materials }: MaterialTableProps) {
  const deleteMaterial = useDeleteMaterial();

  const handleDelete = (id: string) => {
    if (confirm("Yakin ingin menghapus materi ini? File terkait juga akan terhapus.")) {
      deleteMaterial.mutate(id, {
        onSuccess: () => toast.success("Materi berhasil dihapus"),
        onError: () => toast.error("Gagal menghapus materi"),
      });
    }
  };

  const columns: Column<DigitalMaterial>[] = [
    {
      key: "titleId",
      header: "Judul",
      render: (item) => (
        <div className="font-medium text-neutral-900">
          <p className="line-clamp-1" title={item.titleId}>{item.titleId}</p>
          <p className="text-xs text-muted-foreground line-clamp-1" title={item.titleEn}>{item.titleEn}</p>
        </div>
      )
    },
    {
      key: "category",
      header: "Kategori",
      render: (item) => <span className="text-sm">{item.category}</span>
    },
    {
      key: "fileInfo",
      header: "Info File",
      render: (item) => (
        <div className="text-sm">
          <p>{item.fileType}</p>
          <p className="text-xs text-muted-foreground">{formatBytes(item.fileSize)}</p>
        </div>
      )
    },
    {
      key: "downloadCount",
      header: "Unduhan",
      render: (item) => <span className="text-sm">{item.downloadCount}</span>
    },
    {
      key: "status",
      header: "Status",
      render: (item) => <PublishToggle materialId={item.id} isPublished={item.isPublished} />
    },
    {
      key: "actions",
      header: "Aksi",
      render: (item) => (
        <div className="flex items-center gap-2">
          <Link href={`/admin/materi/${item.id}/edit`}>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Pencil className="h-4 w-4" />
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => handleDelete(item.id)}
            disabled={deleteMaterial.isPending}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return <Table columns={columns as any} data={materials as any} emptyMessage="Tidak ada materi digital" />
}
