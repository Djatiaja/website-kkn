// Konfigurasi data desa - Edit file ini untuk mengganti informasi desa
// Semua data di sini akan digunakan di seed dan aplikasi
// Data berdasarkan riset dari Wikipedia & website resmi Desa Pasangsari (Windusari, Magelang)

export const VILLAGE_CONFIG = {
  // Informasi dasar desa
  name: "Desa Pasangsari",
  email: "pasangsaripemdes08@gmail.com",
  domain: "pasangsari.desa.id",

  // Lokasi dan kontak
  address: "Desa Pasangsari, Kec. Windusari, Kab. Magelang, Jawa Tengah",
  phone: null, // belum diketahui secara pasti

  // Demografi
  population: 3978,
  area: 158.566, // dalam hektar

  // Media sosial — belum diketahui, dikosongkan
  socialMedia: {
    facebook: null,
    instagram: null,
    youtube: null,
  },

  // Deskripsi dalam Bahasa Indonesia
  descriptionId:
    "Desa Pasangsari terletak di Kecamatan Windusari, Kabupaten Magelang, Jawa Tengah. Desa ini berada di kaki Gunung Sumbing dengan udara sejuk dan pemandangan alam yang indah.",

  visionId:
    "Mewujudkan Desa Pasangsari yang mandiri, sejahtera, dan religius berbasis pertanian dan kearifan lokal di lereng Gunung Sumbing.",

  missionId:
    "1. Meningkatkan kualitas pelayanan publik yang transparan dan akuntabel\n2. Mengembangkan potensi pertanian dan ekonomi lokal melalui UMKM dan BUMDes\n3. Membangun infrastruktur yang merata dan berkelanjutan\n4. Melestarikan budaya, tradisi, dan nilai-nilai religius masyarakat\n5. Meningkatkan kualitas sumber daya manusia melalui pendidikan dan pelatihan",

  historyId:
    "Desa Pasangsari berada di Kecamatan Windusari, Kabupaten Magelang, di lereng Gunung Sumbing. Desa ini memiliki sejarah panjang sebagai permukiman agraris dengan masyarakat yang religius dan menjunjung tinggi gotong royong.",

  // Deskripsi dalam Bahasa Inggris
  descriptionEn:
    "Pasangsari Village is located in Windusari District, Magelang Regency, Central Java. The village sits at the foot of Mount Sumbing with cool weather and beautiful natural scenery.",

  visionEn:
    "To realize Pasangsari Village as an independent, prosperous, and religious village based on agriculture and local wisdom on the slopes of Mount Sumbing.",

  missionEn:
    "1. Improve the quality of transparent and accountable public services\n2. Develop agricultural and local economic potential through SMEs and Village-Owned Enterprises\n3. Build equitable and sustainable infrastructure\n4. Preserve culture, traditions, and religious values of the community\n5. Improve human resource quality through education and training",

  historyEn:
    "Pasangsari Village is located in Windusari District, Magelang Regency, on the slopes of Mount Sumbing. The village has a long history as an agrarian settlement with a religious community that upholds mutual cooperation.",

  // Tagline & SEO
  tagline: "Mandiri, Sejahtera, dan Religius",
  taglineEn: "Independent, Prosperous, and Religious",
  seoDescription:
    "Website resmi Desa Pasangsari, Kecamatan Windusari, Kabupaten Magelang, Jawa Tengah. Informasi profil desa, produk unggulan, dan berita terbaru.",
  seoKeywords: [
    "Desa Pasangsari",
    "Pasangsari",
    "Windusari",
    "Magelang",
    "website desa",
    "profil desa",
    "produk desa",
    "Jawa Tengah",
  ],
} as const;

// Mission items (parsed from missionId/missionEn)
export const MISSION_ITEMS = [
  {
    textId: "Meningkatkan kualitas pelayanan publik yang transparan dan akuntabel",
    textEn: "Improve the quality of transparent and accountable public services",
  },
  {
    textId: "Mengembangkan potensi pertanian dan ekonomi lokal melalui UMKM dan BUMDes",
    textEn: "Develop agricultural and local economic potential through SMEs and Village-Owned Enterprises",
  },
  {
    textId: "Membangun infrastruktur yang merata dan berkelanjutan",
    textEn: "Build equitable and sustainable infrastructure",
  },
  {
    textId: "Melestarikan budaya, tradisi, dan nilai-nilai religius masyarakat",
    textEn: "Preserve culture, traditions, and religious values of the community",
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
