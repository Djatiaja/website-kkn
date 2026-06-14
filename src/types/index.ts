// ─── Locale ──────────────────────────────────────────────
export type Locale = "id" | "en";

// ─── API Response ────────────────────────────────────────
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// ─── Product ─────────────────────────────────────────────
export type ProductCategory =
  | "UMKM"
  | "WISATA"
  | "PERTANIAN"
  | "KERAJINAN"
  | "KULINER";

export interface Product {
  id: string;
  nameId: string;
  nameEn: string;
  descriptionId: string;
  descriptionEn: string;
  category: ProductCategory;
  price: number | null;
  unit: string | null;
  imageUrl: string | null;
  gallery: string[];
  contact: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Finance ─────────────────────────────────────────────
export interface FinanceRecord {
  id: string;
  year: number;
  type: "INCOME" | "EXPENSE";
  categoryId: string;
  categoryEn: string;
  subcategoryId: string | null;
  subcategoryEn: string | null;
  amount: number;
  budget: number | null;
  sourceId: string | null;
  sourceEn: string | null;
}

export interface FinanceSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  incomeChange: number;
  expenseChange: number;
}

// ─── News ────────────────────────────────────────────────
export interface News {
  id: string;
  titleId: string;
  titleEn: string;
  slug: string;
  contentId: string;
  contentEn: string;
  excerptId: string | null;
  excerptEn: string | null;
  coverImageUrl: string | null;
  category: "PENGUMUMAN" | "KEGIATAN" | "PEMBANGUNAN" | "UMUM";
  isPublished: boolean;
  authorId: string;
  publishedAt: string | null;
  createdAt: string;
}

// ─── Map ─────────────────────────────────────────────────
export interface MapFeature {
  id: string;
  nameId: string;
  nameEn: string;
  type: "BOUNDARY" | "POI" | "ROAD" | "FACILITY";
  icon: string | null;
  geometry: object;
  properties: Record<string, unknown> | null;
  descriptionId: string | null;
  descriptionEn: string | null;
  isVisible: boolean;
}

// ─── Gallery ─────────────────────────────────────────────
export interface GalleryItem {
  id: string;
  titleId: string;
  titleEn: string;
  descriptionId: string | null;
  descriptionEn: string | null;
  type: "PHOTO" | "VIDEO";
  url: string;
  thumbnailUrl: string | null;
  category: string | null;
  createdAt: string;
}

// ─── Village Profile ─────────────────────────────────────
export interface VillageProfile {
  id: string;
  name: string;
  descriptionId: string;
  descriptionEn: string;
  visionId: string;
  visionEn: string;
  missionId: string;
  missionEn: string;
  historyId: string;
  historyEn: string;
  heroVideoUrl: string | null;
  address: string;
  phone: string | null;
  email: string | null;
  population: number | null;
  area: number | null;
  socialMedia: Record<string, string> | null;
  members: OrganizationMember[];
}

export interface OrganizationMember {
  id: string;
  name: string;
  positionId: string;
  positionEn: string;
  photoUrl: string | null;
  order: number;
}

// ─── Auth ────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "EDITOR";
}
