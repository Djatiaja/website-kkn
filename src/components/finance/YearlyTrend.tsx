"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface TrendData {
  year: number;
  income: number;
  expense: number;
}

interface YearlyTrendProps {
  data: TrendData[];
  title: string;
}

export function YearlyTrend({ data, title }: YearlyTrendProps) {
  const formatRupiah = (value: number) => {
    if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}M`;
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)}Jt`;
    return value.toLocaleString("id-ID");
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6">
      <h3 className="text-lg font-heading font-bold text-neutral-900 mb-6">{title}</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="year" tick={{ fontSize: 12, fill: "#6B7280" }} />
            <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} tickFormatter={formatRupiah} />
            <Tooltip
              formatter={(value) => [`Rp ${Number(value).toLocaleString("id-ID")}`, ""]}
              contentStyle={{ borderRadius: 12, border: "1px solid #E5E7EB" }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="income"
              name="Pendapatan"
              stroke="#40916C"
              strokeWidth={3}
              dot={{ r: 5, fill: "#40916C" }}
              activeDot={{ r: 7 }}
            />
            <Line
              type="monotone"
              dataKey="expense"
              name="Belanja"
              stroke="#BC4749"
              strokeWidth={3}
              dot={{ r: 5, fill: "#BC4749" }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
