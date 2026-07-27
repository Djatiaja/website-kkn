"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button, Card } from "@/components/ui";
import type { FinanceRecord, PaginatedResponse } from "@/types";

export default function AdminFinancePage() {
  const router = useRouter();
  const [records, setRecords] = useState<FinanceRecord[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [filterYear, setFilterYear] = useState<number | undefined>();
  const [loading, setLoading] = useState(true);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    const params = filterYear ? `?year=${filterYear}` : "";
    const res = await api.get<PaginatedResponse<FinanceRecord>>(`/finance${params}`);
    setRecords(res.data);
    setLoading(false);
  }, [filterYear]);

  useEffect(() => {
    api.get<number[]>("/finance/years").then(setYears);
  }, []);

  useEffect(() => {
    fetchRecords().catch(console.error);
  }, [fetchRecords]);

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus record ini?")) return;
    await api.delete(`/finance/${id}`);
    fetchRecords().catch(console.error);
  };

  const formatRupiah = (amount: number) =>
    `Rp ${amount.toLocaleString("id-ID")}`;

  const summary = useMemo(() => {
    const income = records.filter(r => r.type === "INCOME").reduce((s, r) => s + r.amount, 0);
    const expense = records.filter(r => r.type === "EXPENSE").reduce((s, r) => s + r.amount, 0);
    const budgetIncome = records.filter(r => r.type === "INCOME").reduce((s, r) => s + (r.budget || 0), 0);
    const budgetExpense = records.filter(r => r.type === "EXPENSE").reduce((s, r) => s + (r.budget || 0), 0);
    return { income, expense, balance: income - expense, budgetIncome, budgetExpense };
  }, [records]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-neutral-900">
          Kelola Keuangan
        </h1>
        <Button onClick={() => router.push("/admin/keuangan/form")}>+ Tambah Record</Button>
      </div>

      {/* Filter */}
      <div className="flex gap-3 mb-6">
        <select
          value={filterYear || ""}
          onChange={(e) => setFilterYear(e.target.value ? Number(e.target.value) : undefined)}
          className="px-3 py-2 border border-neutral-200 rounded-xl text-sm"
        >
          <option value="">Semua Tahun</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Summary Cards */}
      {!loading && <FinanceSummary records={records} summary={summary} formatRupiah={formatRupiah} />}

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-neutral-500">Tahun</th>
                  <th className="text-left py-3 px-4 font-medium text-neutral-500">Tipe</th>
                  <th className="text-left py-3 px-4 font-medium text-neutral-500">Kategori</th>
                  <th className="text-right py-3 px-4 font-medium text-neutral-500">Anggaran</th>
                  <th className="text-right py-3 px-4 font-medium text-neutral-500">Realisasi</th>
                  <th className="text-center py-3 px-4 font-medium text-neutral-500">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id} className="border-t border-neutral-100 hover:bg-neutral-50">
                    <td className="py-3 px-4">{record.year}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        record.type === "INCOME"
                          ? "bg-income/10 text-income"
                          : "bg-expense/10 text-expense"
                      }`}>
                        {record.type === "INCOME" ? "Pendapatan" : "Belanja"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-neutral-700">{record.categoryId}</td>
                    <td className="py-3 px-4 text-right text-neutral-600">
                      {record.budget ? formatRupiah(record.budget) : "-"}
                    </td>
                    <td className="py-3 px-4 text-right font-medium">{formatRupiah(record.amount)}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex gap-1 justify-center">
                        <button
                          onClick={() => router.push(`/admin/keuangan/form?id=${record.id}`)}
                          className="px-2 py-1 text-xs text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(record.id)}
                          className="px-2 py-1 text-xs text-expense hover:bg-expense/10 rounded-lg transition-colors"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {records.length === 0 && (
            <div className="text-center py-12 text-neutral-400">
              Tidak ada data keuangan
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Summary Component ────────────────────────────────────
function FinanceSummary({
  records,
  summary,
  formatRupiah,
}: {
  records: FinanceRecord[];
  summary: { income: number; expense: number; balance: number; budgetIncome: number; budgetExpense: number };
  formatRupiah: (n: number) => string;
}) {
  const categories = records.reduce((acc, r) => {
    const key = r.categoryId;
    if (!acc[key]) acc[key] = { name: key, type: r.type, amount: 0, budget: 0 };
    acc[key].amount += r.amount;
    acc[key].budget += r.budget || 0;
    return acc;
  }, {} as Record<string, { name: string; type: string; amount: number; budget: number }>);

  const topCategories = Object.values(categories).sort((a, b) => b.amount - a.amount).slice(0, 5);
  const maxAmount = Math.max(...topCategories.map(c => c.amount), 1);

  return (
    <div className="space-y-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="!p-4">
          <p className="text-xs text-neutral-500 mb-1">💰 Total Pendapatan</p>
          <p className="text-lg font-bold text-green-700">{formatRupiah(summary.income)}</p>
          {summary.budgetIncome > 0 && (
            <p className="text-xs text-neutral-400 mt-1">
              Anggaran: {formatRupiah(summary.budgetIncome)} ({Math.round((summary.income / summary.budgetIncome) * 100)}%)
            </p>
          )}
        </Card>
        <Card className="!p-4">
          <p className="text-xs text-neutral-500 mb-1">💸 Total Belanja</p>
          <p className="text-lg font-bold text-red-700">{formatRupiah(summary.expense)}</p>
          {summary.budgetExpense > 0 && (
            <p className="text-xs text-neutral-400 mt-1">
              Anggaran: {formatRupiah(summary.budgetExpense)} ({Math.round((summary.expense / summary.budgetExpense) * 100)}%)
            </p>
          )}
        </Card>
        <Card className="!p-4">
          <p className="text-xs text-neutral-500 mb-1">📊 Saldo</p>
          <p className={`text-lg font-bold ${summary.balance >= 0 ? "text-green-700" : "text-red-700"}`}>
            {formatRupiah(summary.balance)}
          </p>
          <p className="text-xs text-neutral-400 mt-1">
            {records.length} transaksi
          </p>
        </Card>
      </div>

      {topCategories.length > 0 && (
        <Card className="!p-4">
          <p className="text-xs font-medium text-neutral-500 mb-3">Top 5 Kategori (Realisasi)</p>
          <div className="space-y-2">
            {topCategories.map((cat) => (
              <div key={cat.name} className="flex items-center gap-2">
                <span className="text-xs text-neutral-600 w-40 truncate">{cat.name}</span>
                <div className="flex-1 h-5 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${cat.type === "INCOME" ? "bg-green-500" : "bg-red-400"}`}
                    style={{ width: `${(cat.amount / maxAmount) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-neutral-700 w-28 text-right">
                  {formatRupiah(cat.amount)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
