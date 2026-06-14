import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { GalleryItem, PaginatedResponse } from "@/types";

interface GalleryFilters {
  type?: "PHOTO" | "VIDEO";
  category?: string;
  page?: number;
  pageSize?: number;
}

interface GalleryInput {
  titleId: string;
  titleEn: string;
  descriptionId?: string | null;
  descriptionEn?: string | null;
  type: "PHOTO" | "VIDEO";
  url: string;
  thumbnailUrl?: string | null;
  category?: string | null;
}

export const galleryKeys = {
  all: ["gallery"] as const,
  lists: () => [...galleryKeys.all, "list"] as const,
  list: (filters: GalleryFilters) => [...galleryKeys.lists(), filters] as const,
  details: () => [...galleryKeys.all, "detail"] as const,
  detail: (id: string) => [...galleryKeys.details(), id] as const,
};

export function useGallery(filters: GalleryFilters = {}) {
  const params = new URLSearchParams();
  if (filters.type) params.set("type", filters.type);
  if (filters.category) params.set("category", filters.category);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.pageSize) params.set("pageSize", String(filters.pageSize));

  const query = params.toString();

  return useQuery({
    queryKey: galleryKeys.list(filters),
    queryFn: () => api.get<PaginatedResponse<GalleryItem>>(`/gallery${query ? `?${query}` : ""}`),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateGalleryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: GalleryInput) => api.post<GalleryItem>("/gallery", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: galleryKeys.lists() });
    },
  });
}

export function useDeleteGalleryItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<void>(`/gallery/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: galleryKeys.lists() });
    },
  });
}
