"use client";

import { MaterialForm } from "@/components/material/MaterialForm";
import { useCreateMaterial } from "@/hooks/useMaterials";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function AddMaterialPage() {
  const router = useRouter();
  const createMaterial = useCreateMaterial();

  const handleSubmit = (data: FormData) => {
    createMaterial.mutate(data, {
      onSuccess: () => {
        toast.success("Materi berhasil ditambahkan");
        router.push("/admin/materi");
      },
      onError: () => {
        toast.error("Gagal menambahkan materi");
      },
    });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/materi">
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tambah Materi Digital</h2>
          <p className="text-muted-foreground">Unggah materi dokumen, gambar, atau video baru.</p>
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg border">
        <MaterialForm onSubmit={handleSubmit} isLoading={createMaterial.isPending} />
      </div>
    </div>
  );
}
