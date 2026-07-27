// Konfigurasi data desa - Edit file ini untuk mengganti informasi desa
// Semua data di sini akan digunakan di seed dan aplikasi

export const VILLAGE_CONFIG = {
  // Informasi dasar desa
  name: "Desa Tanjungsari",
  email: "desa@Tanjungsari.desa.id",
  domain: "Tanjungsari.desa.id",
  
  // Lokasi dan kontak
  address: "Jl. Raya Tanjungsari No. 1, Kec. Tanjungsari, Kab. Bogor, Jawa Barat 16830",
  phone: "0251-8000123",
  
  // Demografi
  population: 5247,
  area: 1200.5, // dalam hektar
  
  // Media sosial
  socialMedia: {
    facebook: "https://facebook.com/desaTanjungsari",
    instagram: "https://instagram.com/desasukmakur",
    youtube: "https://youtube.com/@desaTanjungsari",
  },
  
  // Deskripsi dalam Bahasa Indonesia
  descriptionId:
    "Desa Tanjungsari terletak di kaki Gunung Salak, Kabupaten Bogor, Jawa Barat. Desa ini dikenal dengan keindahan alam, hasil pertanian yang melimpah, dan keramahan penduduknya. Dengan luas wilayah 1.200 hektar, desa ini menjadi rumah bagi lebih dari 5.200 jiwa yang hidup harmonis dalam keberagaman.",
  
  visionId:
    "Mewujudkan Desa Tanjungsari yang mandiri, sejahtera, dan berbudaya berbasis potensi lokal.",
  
  missionId:
    "1. Meningkatkan kualitas pelayanan publik yang transparan dan akuntabel\n2. Mengembangkan potensi ekonomi lokal melalui UMKM dan wisata desa\n3. Membangun infrastruktur yang merata dan berkelanjutan\n4. Melestarikan budaya dan kearifan lokal\n5. Meningkatkan kualitas sumber daya manusia melalui pendidikan dan pelatihan",
  
  historyId:
    "Desa Tanjungsari berdiri pada tahun 1945 setelah kemerdekaan Indonesia. Awalnya merupakan bagian dari Desa Ciapus sebelum dimekarkan pada tahun 1970. Nama 'Tanjungsari' berasal dari bahasa Sunda yang berarti 'senang dan makmur', mencerminkan harapan para pendiri desa akan kehidupan yang sejahtera bagi seluruh warganya. Pada tahun 2015, desa ini mulai mengembangkan sektor wisata dan berhasil meraih penghargaan Desa Wisata Terbaik tingkat kabupaten pada tahun 2022.",
  
  // Deskripsi dalam Bahasa Inggris
  descriptionEn:
    "Tanjungsari Village is located at the foot of Mount Salak, Bogor Regency, West Java. The village is known for its natural beauty, abundant agricultural products, and the hospitality of its residents. With an area of 1,200 hectares, this village is home to more than 5,200 people living in harmony.",
  
  visionEn:
    "To realize Tanjungsari Village as an independent, prosperous, and cultured village based on local potential.",
  
  missionEn:
    "1. Improve the quality of transparent and accountable public services\n2. Develop local economic potential through SMEs and village tourism\n3. Build equitable and sustainable infrastructure\n4. Preserve culture and local wisdom\n5. Improve human resource quality through education and training",
  
  historyEn:
    "Tanjungsari Village was established in 1945 after Indonesian independence. It was originally part of Ciapus Village before being divided in 1970. The name 'Tanjungsari' comes from Sundanese meaning 'happy and prosperous', reflecting the founders' hopes for a prosperous life for all residents. In 2015, the village began developing its tourism sector and won the Best Tourism Village award at the district level in 2022.",

  // Tagline & SEO
  tagline: "Mandiri, Sejahtera, dan Berbudaya",
  taglineEn: "Independent, Prosperous, and Cultured",
  seoDescription:
    "Website resmi Desa Tanjungsari, Kecamatan Tanjungsari, Kabupaten Bogor, Jawa Barat. Informasi profil desa, produk unggulan, transparansi keuangan, dan berita terbaru.",
  seoKeywords: [
    "Desa Tanjungsari",
    "desa",
    "Bogor",
    "website desa",
    "profil desa",
    "produk desa",
  ],
} as const;

// Mission items (parsed from missionId/missionEn)
export const MISSION_ITEMS = [
  {
    textId: "Meningkatkan kualitas pelayanan publik yang transparan dan akuntabel",
    textEn: "Improve the quality of transparent and accountable public services",
  },
  {
    textId: "Mengembangkan potensi ekonomi lokal melalui UMKM dan wisata desa",
    textEn: "Develop local economic potential through SMEs and village tourism",
  },
  {
    textId: "Membangun infrastruktur yang merata dan berkelanjutan",
    textEn: "Build equitable and sustainable infrastructure",
  },
  {
    textId: "Melestarikan budaya dan kearifan lokal",
    textEn: "Preserve culture and local wisdom",
  },
  {
    textId: "Meningkatkan kualitas sumber daya manusia melalui pendidikan dan pelatihan",
    textEn: "Improve human resource quality through education and training",
  },
] as const;

// Konfigurasi admin default
export const ADMIN_CONFIG = {
  email: `admin@${VILLAGE_CONFIG.domain}`,
  name: "Administrator",
  password: "Admin@Desa2024",
  role: "ADMIN" as const,
} as const;

// Konfigurasi struktur organisasi
export const ORGANIZATION_MEMBERS = [
  {
    name: "H. Ahmad Sudirman, S.Sos",
    positionId: "Kepala Desa",
    positionEn: "Village Head",
    photoUrl: "/images/org/kepala-desa.jpg",
    order: 1,
  },
  {
    name: "Siti Nurhaliza, S.AP",
    positionId: "Sekretaris Desa",
    positionEn: "Village Secretary",
    photoUrl: "/images/org/sekretaris.jpg",
    order: 2,
  },
  {
    name: "Budi Santoso",
    positionId: "Kaur Keuangan",
    positionEn: "Head of Finance",
    photoUrl: "/images/org/kaur-keuangan.jpg",
    order: 3,
  },
  {
    name: "Dewi Anggraeni, S.Pd",
    positionId: "Kaur Perencanaan",
    positionEn: "Head of Planning",
    photoUrl: "/images/org/kaur-perencanaan.jpg",
    order: 4,
  },
  {
    name: "Ridwan Kamil",
    positionId: "Kasi Pemerintahan",
    positionEn: "Head of Governance",
    photoUrl: "/images/org/kasi-pemerintahan.jpg",
    order: 5,
  },
  {
    name: "Rina Wulandari",
    positionId: "Kasi Kesejahteraan",
    positionEn: "Head of Welfare",
    photoUrl: "/images/org/kasi-kesejahteraan.jpg",
    order: 6,
  },
  {
    name: "Joko Prasetyo",
    positionId: "Kasi Pelayanan",
    positionEn: "Head of Services",
    photoUrl: "/images/org/kasi-pelayanan.jpg",
    order: 7,
  },
] as const;

// Export semua konfigurasi
export const SITE_CONFIG = {
  title: VILLAGE_CONFIG.name,
  description: VILLAGE_CONFIG.descriptionId,
  url: `https://${VILLAGE_CONFIG.domain}`,
} as const;
