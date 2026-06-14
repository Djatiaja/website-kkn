import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { MapFeature } from "@/types";

interface MapFilters {
  type?: "BOUNDARY" | "POI" | "ROAD" | "FACILITY";
  isVisible?: boolean;
}

interface MapFeatureInput {
  nameId: string;
  nameEn: string;
  type: "BOUNDARY" | "POI" | "ROAD" | "FACILITY";
  icon?: string | null;
  geometry: object;
  properties?: Record<string, unknown> | null;
  descriptionId?: string | null;
  descriptionEn?: string | null;
  isVisible?: boolean;
}

export const mapKeys = {
  all: ["map"] as const,
  lists: () => [...mapKeys.all, "list"] as const,
  list: (filters: MapFilters) => [...mapKeys.lists(), filters] as const,
  details: () => [...mapKeys.all, "detail"] as const,
  detail: (id: string) => [...mapKeys.details(), id] as const,
};

export function useMapFeatures(filters: MapFilters = {}) {
  const params = new URLSearchParams();
  if (filters.type) params.set("type", filters.type);
  if (filters.isVisible !== undefined) params.set("isVisible", String(filters.isVisible));

  const query = params.toString();

  return useQuery({
    queryKey: mapKeys.list(filters),
    queryFn: () => api.get<MapFeature[]>(`/map${query ? `?${query}` : ""}`),
    staleTime: 10 * 60 * 1000,
  });
}

export function useCreateMapFeature() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: MapFeatureInput) => api.post<MapFeature>("/map", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mapKeys.lists() });
    },
  });
}

export function useUpdateMapFeature() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<MapFeatureInput> }) =>
      api.put<MapFeature>(`/map/${id}`, data),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: mapKeys.lists() });
      queryClient.invalidateQueries({ queryKey: mapKeys.detail(id) });
    },
  });
}

export function useDeleteMapFeature() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<void>(`/map/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mapKeys.lists() });
    },
  });
}
