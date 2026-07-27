"use client";

import { MaterialForm } from "@/components/material/MaterialForm";
import { useMaterial, useUpdateMaterial } from "@/hooks/useMaterials";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function EditMaterialPage() {
  const router = useRouter();
  const { id } = useParams();
  const { data: material, isLoading } = useMaterial(id as string);
  const updateMaterial = useUpdateMaterial();

  const handleSubmit = (data: FormData) => {
    updateMaterial.mutate(
      { id: id as string, data },
      {
        onSuccess: () => {
          toast.success("Materi berhasil diperbarui");
          router.push("/admin/materi");
        },
        onError: () => {
          toast.error("Gagal memperbarui materi");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!material) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-4">Materi tidak ditemukan</h2>
        <Link href="/admin/materi">
          <Button>Kembali</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/materi">
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Edit Materi Digital</h2>
          <p className="text-muted-foreground">Perbarui informasi materi digital.</p>
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg border">
        <MaterialForm 
          initialData={material} 
          onSubmit={handleSubmit}
          isLoading={updateMaterial.isPending} 
        />
      </div>
    </div>
  );
}
