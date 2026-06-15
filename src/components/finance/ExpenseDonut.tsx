"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import type { FinanceRecord } from "@/types";

interface ExpenseDonutProps {
  records: FinanceRecord[];
  locale: "id" | "en";
  title: string;
}

const COLORS = ["#2D6A4F", "#4A90A4", "#DDA15E", "#7F5539", "#BC4749", "#40916C"];

export function ExpenseDonut({ records, locale, title }: ExpenseDonutProps) {
  const expenseRecords = records.filter((r) => r.type === "EXPENSE");
  const totalExpense = expenseRecords.reduce((sum, r) => sum + r.amount, 0);

  const grouped = expenseRecords.reduce((acc, r) => {
    const name = locale === "id" ? r.categoryId : r.categoryEn;
    if (!acc[name]) acc[name] = 0;
    acc[name] += r.amount;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(grouped).map(([name, value]) => ({
    name,
    value,
    percentage: ((value / totalExpense) * 100).toFixed(1),
  }));

  const formatRupiah = (value: number) => {
    if (value >= 1_000_000_000) return `Rp ${(value / 1_000_000_000).toFixed(1)} M`;
    if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(0)} Jt`;
    return `Rp ${value.toLocaleString("id-ID")}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6">
      <h3 className="text-lg font-heading font-bold text-neutral-900 mb-6">{title}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
              label={false}
              labelLine={false}
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [formatRupiah(Number(value)), name]}
              contentStyle={{ borderRadius: 12, border: "1px solid #E5E7EB" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Legend manual */}
      <div className="flex flex-wrap gap-3 mt-4 justify-center">
        {chartData.map((item, i) => (
          <div key={item.name} className="flex items-center gap-1.5 text-xs">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[i % COLORS.length] }}
            />
            <span className="text-neutral-600">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
