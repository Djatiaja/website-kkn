"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { YearSelector } from "@/components/finance/YearSelector";
import { BudgetOverview } from "@/components/finance/BudgetOverview";
import { Wallet } from "lucide-react";
import { IncomeExpenseChart } from "@/components/finance/IncomeExpenseChart";
import { ExpenseDonut } from "@/components/finance/ExpenseDonut";
import { YearlyTrend } from "@/components/finance/YearlyTrend";
import { BudgetTable } from "@/components/finance/BudgetTable";
import { ScrollReveal } from "@/components/home/ScrollReveal";
import { api } from "@/lib/api";
import type { FinanceRecord, PaginatedResponse } from "@/types";

interface TrendData {
  year: number;
  income: number;
  expense: number;
}

interface FinanceSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export function FinancePageClient({ locale }: { locale: "id" | "en" }) {
  const t = useTranslations("finance");
  const [years, setYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [records, setRecords] = useState<FinanceRecord[]>([]);
  const [summary, setSummary] = useState<FinanceSummary>({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [trend, setTrend] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<number[]>("/finance/years").then((yrs) => {
      setYears(yrs);
      if (yrs.length > 0) setSelectedYear(yrs[0]);
    });
    api.get<TrendData[]>("/finance/trend").then(setTrend);
  }, []);

  useEffect(() => {
    if (!selectedYear) return;
    setLoading(true);
    Promise.all([
      api.get<PaginatedResponse<FinanceRecord>>(`/finance?year=${selectedYear}`),
      api.get<FinanceSummary>(`/finance/summary?year=${selectedYear}`),
    ]).then(([recordsRes, summaryRes]) => {
      setRecords(recordsRes.data);
      setSummary(summaryRes);
      setLoading(false);
    });
  }, [selectedYear]);

  return (
    <div className="pt-28 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-10">
            <h1 className="flex items-center justify-center gap-3 text-3xl md:text-4xl font-heading font-bold text-neutral-900 mb-2">
              <Wallet className="w-8 h-8 text-primary" /> {t("title")}
            </h1>
            <p className="text-neutral-500">{t("subtitle")}</p>
          </div>
        </ScrollReveal>

        {/* Year Selector */}
        <ScrollReveal delay={100}>
          <div className="mb-10">
            <p className="text-center text-sm text-neutral-500 mb-3">{t("year")}</p>
            <YearSelector years={years} selected={selectedYear} onChange={setSelectedYear} />
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Summary Cards */}
            <ScrollReveal delay={150}>
              <BudgetOverview
                totalIncome={summary.totalIncome}
                totalExpense={summary.totalExpense}
                balance={summary.balance}
                labels={{
                  income: t("income"),
                  expense: t("expense"),
                  balance: t("balance"),
                }}
              />
            </ScrollReveal>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ScrollReveal delay={200}>
                <IncomeExpenseChart
                  records={records}
                  locale={locale}
                  title={t("chart_bar.title")}
                  labels={{
                    budget: t("table.budget"),
                    actual: t("table.actual"),
                  }}
                />
              </ScrollReveal>
              <ScrollReveal delay={250}>
                <ExpenseDonut
                  records={records}
                  locale={locale}
                  title={t("chart_donut.title")}
                />
              </ScrollReveal>
            </div>

            {/* Trend Chart */}
            {trend.length > 1 && (
              <ScrollReveal delay={300}>
                <YearlyTrend
                  data={trend}
                  title={t("chart_line.title")}
                  labels={{
                    income: t("income"),
                    expense: t("expense"),
                  }}
                />
              </ScrollReveal>
            )}

            {/* Detail Table */}
            <ScrollReveal delay={350}>
              <BudgetTable
                records={records}
                locale={locale}
                labels={{
                  title: t("table.title"),
                  category: t("table.category"),
                  budget: t("table.budget"),
                  actual: t("table.actual"),
                  percentage: t("table.percentage"),
                  incomeSection: t("income_section"),
                  expenseSection: t("expense_section"),
                }}
              />
            </ScrollReveal>
          </div>
        )}
      </div>
    </div>
  );
}
