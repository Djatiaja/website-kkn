import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { News, PaginatedResponse } from "@/types";
import type { NewsInput } from "@/lib/validations/news";

interface NewsFilters {
  category?: "PENGUMUMAN" | "KEGIATAN" | "PEMBANGUNAN" | "UMUM";
  isPublished?: boolean;
  search?: string;
  page?: number;
  pageSize?: number;
}

export const newsKeys = {
  all: ["news"] as const,
  lists: () => [...newsKeys.all, "list"] as const,
  list: (filters: NewsFilters) => [...newsKeys.lists(), filters] as const,
  details: () => [...newsKeys.all, "detail"] as const,
  detail: (id: string) => [...newsKeys.details(), id] as const,
};

export function useNewsList(filters: NewsFilters = {}) {
  const params = new URLSearchParams();
  if (filters.category) params.set("category", filters.category);
  if (filters.isPublished !== undefined) params.set("isPublished", String(filters.isPublished));
  if (filters.search) params.set("search", filters.search);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.pageSize) params.set("pageSize", String(filters.pageSize));

  const query = params.toString();

  return useQuery({
    queryKey: newsKeys.list(filters),
    queryFn: () => api.get<PaginatedResponse<News>>(`/news${query ? `?${query}` : ""}`),
    staleTime: 5 * 60 * 1000,
  });
}

export function useNewsDetail(id: string) {
  return useQuery({
    queryKey: newsKeys.detail(id),
    queryFn: () => api.get<News>(`/news/${id}`),
    enabled: !!id,
  });
}

export function useCreateNews() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: NewsInput) => api.post<News>("/news", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsKeys.lists() });
    },
  });
}

export function useUpdateNews() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<NewsInput> }) =>
      api.put<News>(`/news/${id}`, data),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: newsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: newsKeys.detail(id) });
    },
  });
}

export function useDeleteNews() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<void>(`/news/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsKeys.lists() });
    },
  });
}
