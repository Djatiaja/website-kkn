"use client";

import { useTransition } from "react";
import { useUpdateMaterial } from "@/hooks/useMaterials";
import { toast } from "sonner";

interface PublishToggleProps {
  materialId: string;
  isPublished: boolean;
}

export function PublishToggle({ materialId, isPublished }: PublishToggleProps) {
  const [isPending, startTransition] = useTransition();
  const updateMaterial = useUpdateMaterial();

  const handleToggle = () => {
    startTransition(() => {
      const formData = new FormData();
      formData.append("isPublished", String(!isPublished));
      updateMaterial.mutate({ id: materialId, data: formData }, {
        onSuccess: () => toast.success("Status berhasil diubah"),
        onError: () => toast.error("Gagal mengubah status")
      });
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`px-3 py-1 rounded-full text-xs font-medium border ${isPublished ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}
    >
      {isPending ? "Loading..." : (isPublished ? "Published" : "Draft")}
    </button>
  );
}
