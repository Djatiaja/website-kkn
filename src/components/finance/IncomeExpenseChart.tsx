"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { FinanceRecord } from "@/types";

interface IncomeExpenseChartProps {
  records: FinanceRecord[];
  locale: "id" | "en";
  title: string;
}

export function IncomeExpenseChart({ records, locale, title }: IncomeExpenseChartProps) {
  // Group by category, show budget vs actual
  const expenseRecords = records.filter((r) => r.type === "EXPENSE");

  const chartData = expenseRecords.map((r) => ({
    category: locale === "id" ? r.categoryId : r.categoryEn,
    anggaran: r.budget || 0,
    realisasi: r.amount,
  }));

  const formatRupiah = (value: number) => {
    if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}M`;
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)}Jt`;
    return value.toLocaleString("id-ID");
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6">
      <h3 className="text-lg font-heading font-bold text-neutral-900 mb-6">{title}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="category"
              tick={{ fontSize: 11, fill: "#6B7280" }}
              angle={-30}
              textAnchor="end"
              height={70}
            />
            <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} tickFormatter={formatRupiah} />
            <Tooltip
              formatter={(value) => [`Rp ${Number(value).toLocaleString("id-ID")}`, ""]}
              contentStyle={{ borderRadius: 12, border: "1px solid #E5E7EB" }}
            />
            <Legend wrapperStyle={{ paddingTop: 10 }} />
            <Bar dataKey="anggaran" name="Anggaran" fill="#B7C4B1" radius={[4, 4, 0, 0]} />
            <Bar dataKey="realisasi" name="Realisasi" fill="#2D6A4F" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
