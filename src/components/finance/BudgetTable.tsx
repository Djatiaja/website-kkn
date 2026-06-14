"use client";

import type { FinanceRecord } from "@/types";

interface BudgetTableProps {
  records: FinanceRecord[];
  locale: "id" | "en";
  labels: {
    title: string;
    category: string;
    budget: string;
    actual: string;
    percentage: string;
    incomeSection: string;
    expenseSection: string;
  };
}

function formatRupiah(amount: number): string {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

function TableSection({
  title,
  records,
  locale,
  labels,
}: {
  title: string;
  records: FinanceRecord[];
  locale: "id" | "en";
  labels: BudgetTableProps["labels"];
}) {
  return (
    <div className="mb-6">
      <h4 className="font-heading font-semibold text-neutral-900 mb-3 flex items-center gap-2">
        <span className={records[0]?.type === "INCOME" ? "text-income" : "text-expense"}>●</span>
        {title}
      </h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200">
              <th className="text-left py-2 px-3 text-neutral-500 font-medium">{labels.category}</th>
              <th className="text-right py-2 px-3 text-neutral-500 font-medium">{labels.budget}</th>
              <th className="text-right py-2 px-3 text-neutral-500 font-medium">{labels.actual}</th>
              <th className="text-right py-2 px-3 text-neutral-500 font-medium">{labels.percentage}</th>
              <th className="py-2 px-3 w-32"></th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => {
              const category = locale === "id" ? r.categoryId : r.categoryEn;
              const budget = r.budget || 0;
              const pct = budget > 0 ? Math.round((r.amount / budget) * 100) : 100;
              const barColor = r.type === "INCOME" ? "bg-income" : "bg-expense";

              return (
                <tr key={r.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="py-3 px-3 text-neutral-700">{category}</td>
                  <td className="py-3 px-3 text-right text-neutral-600">{formatRupiah(budget)}</td>
                  <td className="py-3 px-3 text-right font-medium text-neutral-900">
                    {formatRupiah(r.amount)}
                  </td>
                  <td className="py-3 px-3 text-right font-medium">
                    <span className={pct >= 90 ? "text-income" : pct >= 70 ? "text-warning" : "text-expense"}>
                      {pct}%
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${barColor} rounded-full transition-all duration-500`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function BudgetTable({ records, locale, labels }: BudgetTableProps) {
  const incomeRecords = records.filter((r) => r.type === "INCOME");
  const expenseRecords = records.filter((r) => r.type === "EXPENSE");

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6">
      <h3 className="text-lg font-heading font-bold text-neutral-900 mb-6">{labels.title}</h3>

      {incomeRecords.length > 0 && (
        <TableSection
          title={labels.incomeSection}
          records={incomeRecords}
          locale={locale}
          labels={labels}
        />
      )}

      {expenseRecords.length > 0 && (
        <TableSection
          title={labels.expenseSection}
          records={expenseRecords}
          locale={locale}
          labels={labels}
        />
      )}
    </div>
  );
}
