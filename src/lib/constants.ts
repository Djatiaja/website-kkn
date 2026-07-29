// Konfigurasi data desa - Edit file ini untuk mengganti informasi desa
// Semua data di sini akan digunakan di seed dan aplikasi
// Data berdasarkan riset dari Wikipedia & website resmi Desa Tanjungsari (Windusari, Magelang)

export const VILLAGE_CONFIG = {
  // Informasi dasar desa
  name: "Desa Tanjungsari",
  email: "tanjungsaripemdes08@gmail.com",
  domain: "tanjungsari.desa.id",
  
  // Lokasi dan kontak
  address: "Jl. Grogol Indah No.2, Desa Tanjungsari, Kec. Windusari, Kab. Magelang, Jawa Tengah 56152",
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
    "Desa Tanjungsari terletak di lembah Gunung Sumbing, Kecamatan Windusari, Kabupaten Magelang, Jawa Tengah. Desa ini berada di ketinggian 900–1100 mdpl dengan suhu rata-rata 27–30°C dan curah hujan 2000–3000 mm per tahun. Terdiri dari 6 dusun yaitu Grogol, Pendekan, Ngabean, Sudimoro Krajan/Pasar, Sudimoro Dukuh, dan Sudimoro Jurang. Seluruh warga masyarakat beragama Islam dan merupakan masyarakat yang religius, dengan terdapat 2 pondok pesantren di Dusun Sudimoro.",
  
  visionId:
    "Mewujudkan Desa Tanjungsari yang mandiri, sejahtera, dan religius berbasis pertanian dan kearifan lokal di lereng Gunung Sumbing.",
  
  missionId:
    "1. Meningkatkan kualitas pelayanan publik yang transparan dan akuntabel\n2. Mengembangkan potensi pertanian dan ekonomi lokal melalui UMKM dan BUMDes\n3. Membangun infrastruktur yang merata dan berkelanjutan\n4. Melestarikan budaya, tradisi, dan nilai-nilai religius masyarakat\n5. Meningkatkan kualitas sumber daya manusia melalui pendidikan dan pelatihan",
  
  historyId:
    "Desa Tanjungsari berada di lembah Gunung Sumbing. Nama 'Tanjungsari' berasal dari kata 'tanjung' yang berarti sebuah tanjung atau gumuk (bukit kecil), dan 'sari' yang diartikan makmur/sejahtera, yang konon dahulu masyarakatnya menjunjung tinggi nilai adat istiadat dan budayanya sehingga kehidupannya sangat makmur. Awalnya Desa Tanjungsari hanya terdiri dari 4 dusun yaitu Dusun Grogol, Pendekan, Ngabean, dan Sudimoro. Dengan berkembangnya penduduk, maka Dusun Sudimoro dipecah menjadi 3 yaitu Sudimoro Krajan/Pasar, Sudimoro Dukuh, dan Sudimoro Jurang, sehingga sampai sekarang Desa Tanjungsari terdiri dari 6 dusun. Dusun Grogol pertama kali dihuni oleh seorang kyai bernama Kyai Gragi yang membuka lahan dari hutan belantara. Dusun Pendekan pertama kali dihuni oleh Kyai Pendek. Dusun Ngabean pertama kali dibuka oleh Kyai Ahmadi Salim. Desa ini juga dilalui jalan kabupaten yang menghubungkan antar kecamatan di Kabupaten Magelang, yaitu Windusari–Kaliangkrik–Kajoran–Salaman–Borobudur.",
  
  // Deskripsi dalam Bahasa Inggris
  descriptionEn:
    "Tanjungsari Village is located in the valley of Mount Sumbing, Windusari District, Magelang Regency, Central Java. The village sits at an altitude of 900–1,100 meters above sea level with an average temperature of 27–30°C and annual rainfall of 2,000–3,000 mm. It consists of 6 hamlets: Grogol, Pendekan, Ngabean, Sudimoro Krajan/Pasar, Sudimoro Dukuh, and Sudimoro Jurang. The entire community practices Islam and is deeply religious, with 2 Islamic boarding schools (pondok pesantren) in Sudimoro Hamlet.",
  
  visionEn:
    "To realize Tanjungsari Village as an independent, prosperous, and religious village based on agriculture and local wisdom on the slopes of Mount Sumbing.",
  
  missionEn:
    "1. Improve the quality of transparent and accountable public services\n2. Develop agricultural and local economic potential through SMEs and Village-Owned Enterprises\n3. Build equitable and sustainable infrastructure\n4. Preserve culture, traditions, and religious values of the community\n5. Improve human resource quality through education and training",
  
  historyEn:
    "Tanjungsari Village is located in the valley of Mount Sumbing. The name 'Tanjungsari' comes from 'tanjung' meaning a cape or small hill, and 'sari' meaning prosperous, referring to a community that once upheld traditional customs and culture, leading to a prosperous life. Initially, the village consisted of only 4 hamlets: Grogol, Pendekan, Ngabean, and Sudimoro. As the population grew, Sudimoro was split into 3: Sudimoro Krajan/Pasar, Sudimoro Dukuh, and Sudimoro Jurang, making a total of 6 hamlets today. Grogol Hamlet was first settled by a religious leader named Kyai Gragi who cleared the land from wilderness. Pendekan Hamlet was first settled by Kyai Pendek. Ngabean Hamlet was first opened by Kyai Ahmadi Salim. The village is also traversed by a district road connecting Windusari–Kaliangkrik–Kajoran–Salaman–Borobudur.",

  // Tagline & SEO
  tagline: "Mandiri, Sejahtera, dan Religius",
  taglineEn: "Independent, Prosperous, and Religious",
  seoDescription:
    "Website resmi Desa Tanjungsari, Kecamatan Windusari, Kabupaten Magelang, Jawa Tengah. Informasi profil desa, produk unggulan, transparansi keuangan, dan berita terbaru.",
  seoKeywords: [
    "Desa Tanjungsari",
    "Tanjungsari",
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
