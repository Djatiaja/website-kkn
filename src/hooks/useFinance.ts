import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { FinanceRecord, PaginatedResponse } from "@/types";
import type { FinanceInput } from "@/lib/validations/finance";

interface FinanceFilters {
  year?: number;
  type?: "INCOME" | "EXPENSE";
  page?: number;
  pageSize?: number;
}

interface FinanceSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export const financeKeys = {
  all: ["finance"] as const,
  lists: () => [...financeKeys.all, "list"] as const,
  list: (filters: FinanceFilters) => [...financeKeys.lists(), filters] as const,
  summary: (year: number) => [...financeKeys.all, "summary", year] as const,
  years: () => [...financeKeys.all, "years"] as const,
};

export function useFinanceRecords(filters: FinanceFilters = {}) {
  const params = new URLSearchParams();
  if (filters.year) params.set("year", String(filters.year));
  if (filters.type) params.set("type", filters.type);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.pageSize) params.set("pageSize", String(filters.pageSize));

  const query = params.toString();

  return useQuery({
    queryKey: financeKeys.list(filters),
    queryFn: () => api.get<PaginatedResponse<FinanceRecord>>(`/finance${query ? `?${query}` : ""}`),
    staleTime: 5 * 60 * 1000,
  });
}

export function useFinanceSummary(year: number) {
  return useQuery({
    queryKey: financeKeys.summary(year),
    queryFn: () => api.get<FinanceSummary>(`/finance/summary?year=${year}`),
    enabled: !!year,
  });
}

export function useFinanceYears() {
  return useQuery({
    queryKey: financeKeys.years(),
    queryFn: () => api.get<number[]>("/finance/years"),
    staleTime: 30 * 60 * 1000,
  });
}

export function useCreateFinance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FinanceInput) => api.post<FinanceRecord>("/finance", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financeKeys.all });
    },
  });
}

export function useUpdateFinance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FinanceInput> }) =>
      api.put<FinanceRecord>(`/finance/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financeKeys.all });
    },
  });
}

export function useDeleteFinance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<void>(`/finance/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financeKeys.all });
    },
  });
}
