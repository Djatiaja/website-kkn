import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { DigitalMaterial } from "@/types";
import type { MaterialFilters } from "@/lib/validations/material";
import type { PaginatedResponse } from "@/types";

export const materialKeys = {
  all: ["materials"] as const,
  lists: () => [...materialKeys.all, "list"] as const,
  list: (filters: MaterialFilters) => [...materialKeys.lists(), filters] as const,
  details: () => [...materialKeys.all, "detail"] as const,
  detail: (id: string) => [...materialKeys.details(), id] as const,
};

export function useMaterials(filters: MaterialFilters) {
  return useQuery({
    queryKey: materialKeys.list(filters),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (filters.category) searchParams.set("category", filters.category);
      if (filters.fileType) searchParams.set("fileType", filters.fileType);
      if (filters.search) searchParams.set("search", filters.search);
      if (filters.page) searchParams.set("page", filters.page.toString());
      if (filters.pageSize) searchParams.set("limit", filters.pageSize.toString());
      if (filters.sortBy) searchParams.set("sortBy", filters.sortBy);
      if (filters.sortOrder) searchParams.set("sortOrder", filters.sortOrder);

      const queryString = searchParams.toString();
      const res = await api.get<PaginatedResponse<DigitalMaterial>>(
        `/materials${queryString ? `?${queryString}` : ""}`
      );
      return res;
    },
  });
}

export function useMaterial(id: string) {
  return useQuery({
    queryKey: materialKeys.detail(id),
    queryFn: async () => {
      const res = await api.get<DigitalMaterial>(`/materials/${id}`);
      return res;
    },
    enabled: !!id,
  });
}

export function useCreateMaterial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      // NOTE(djamgt): multipart form data shouldn't need a specific header, browser sets it.
      return api.post<DigitalMaterial>("/materials", formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: materialKeys.lists() });
    },
  });
}

export function useUpdateMaterial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FormData }) => {
      // NOTE(djamgt): multipart form data shouldn't need a specific header, browser sets it.
      return api.put<DigitalMaterial>(`/materials/${id}`, data);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: materialKeys.lists() });
      queryClient.invalidateQueries({ queryKey: materialKeys.detail(variables.id) });
    },
  });
}

export function useDeleteMaterial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/materials/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: materialKeys.lists() });
    },
  });
}
