"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui";
import { api } from "@/lib/api";

interface DashboardStats {
  products: number;
  news: number;
  gallery: number;
  mapFeatures: number;
  totalIncome: number;
}

function formatRupiah(n: number) {
  if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(1)} M`;
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)} Jt`;
  return `Rp ${n.toLocaleString("id-ID")}`;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    api.get<DashboardStats>("/dashboard").then(setStats).catch(() => {});
  }, []);

  const cards = [
    { label: "Total Produk", value: stats?.products ?? "-", icon: "🛍️", color: "bg-primary/10 text-primary" },
    { label: "Total Berita", value: stats?.news ?? "-", icon: "📰", color: "bg-secondary/10 text-secondary" },
    { label: "Total Galeri", value: stats?.gallery ?? "-", icon: "📸", color: "bg-accent/10 text-accent" },
    { label: "Pendapatan " + new Date().getFullYear(), value: stats ? formatRupiah(stats.totalIncome) : "-", icon: "💰", color: "bg-income/10 text-income" },
    { label: "Lokasi Peta", value: stats?.mapFeatures ?? "-", icon: "🗺️", color: "bg-primary/10 text-primary" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-neutral-900">
          Dashboard
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          Selamat datang di Admin Panel Desa Sukamakmur
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {cards.map((stat) => (
          <Card key={stat.label} className="relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500 mb-1">{stat.label}</p>
                <p className="text-2xl font-heading font-bold text-neutral-900">
                  {stat.value}
                </p>
              </div>
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${stat.color}`}
              >
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <h2 className="text-lg font-heading font-semibold mb-4">
          Aksi Cepat
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Tambah Produk", icon: "🛍️", href: "/admin/produk" },
            { label: "Tulis Berita", icon: "📝", href: "/admin/berita" },
            { label: "Upload Galeri", icon: "📸", href: "/admin/galeri" },
            { label: "Kelola Peta", icon: "🗺️", href: "/admin/peta" },
            { label: "Keuangan", icon: "💰", href: "/admin/keuangan" },
            { label: "Edit Profil", icon: "📋", href: "/admin/profil" },
          ].map((action) => (
            <a
              key={action.label}
              href={action.href}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-neutral-50 hover:bg-primary/5 hover:border-primary/20 border border-transparent transition-all duration-200 text-center"
            >
              <span className="text-2xl">{action.icon}</span>
              <span className="text-xs font-medium text-neutral-700">
                {action.label}
              </span>
            </a>
          ))}
        </div>
      </Card>
    </div>
  );
}
