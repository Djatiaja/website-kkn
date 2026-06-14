"use client";

import { AnimatedCounter } from "@/components/home/AnimatedCounter";

interface BudgetOverviewProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  labels: {
    income: string;
    expense: string;
    balance: string;
  };
}

function formatRupiah(amount: number): string {
  if (amount >= 1_000_000_000) return `Rp ${(amount / 1_000_000_000).toFixed(1)} M`;
  if (amount >= 1_000_000) return `Rp ${(amount / 1_000_000).toFixed(0)} Jt`;
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

export function BudgetOverview({ totalIncome, totalExpense, balance, labels }: BudgetOverviewProps) {
  const cards = [
    {
      label: labels.income,
      value: totalIncome,
      icon: "📈",
      color: "border-income/30 bg-income/5",
      textColor: "text-income",
    },
    {
      label: labels.expense,
      value: totalExpense,
      icon: "📉",
      color: "border-expense/30 bg-expense/5",
      textColor: "text-expense",
    },
    {
      label: labels.balance,
      value: balance,
      icon: "💵",
      color: "border-info/30 bg-info/5",
      textColor: "text-info",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`p-6 rounded-2xl border ${card.color} transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{card.icon}</span>
            <p className="text-sm font-medium text-neutral-500">{card.label}</p>
          </div>
          <p className={`text-2xl font-heading font-bold ${card.textColor}`}>
            {formatRupiah(card.value)}
          </p>
        </div>
      ))}
    </div>
  );
}
