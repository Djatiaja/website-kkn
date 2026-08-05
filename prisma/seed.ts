import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { VILLAGE_CONFIG, ADMIN_CONFIG, ORGANIZATION_MEMBERS, MISSION_ITEMS } from "../src/lib/constants";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ─── 1. Admin User ──────────────────────────────────────
  const hashedPassword = await hash(ADMIN_CONFIG.password, 12);
  const admin = await prisma.user.upsert({
    where: { email: ADMIN_CONFIG.email },
    update: {},
    create: {
      email: ADMIN_CONFIG.email,
      name: ADMIN_CONFIG.name,
      password: hashedPassword,
      role: ADMIN_CONFIG.role,
    },
  });
  console.log("✅ Admin user created:", admin.email);

  // ─── 2. Village Profile (Singleton) ─────────────────────
  const profile = await prisma.villageProfile.upsert({
    where: { id: "village-profile-singleton" },
    update: {},
    create: {
      id: "village-profile-singleton",
      name: VILLAGE_CONFIG.name,
      descriptionId: VILLAGE_CONFIG.descriptionId,
      descriptionEn: VILLAGE_CONFIG.descriptionEn,
      visionId: VILLAGE_CONFIG.visionId,
      visionEn: VILLAGE_CONFIG.visionEn,
      missionId: VILLAGE_CONFIG.missionId,
      missionEn: VILLAGE_CONFIG.missionEn,
      historyId: VILLAGE_CONFIG.historyId,
      historyEn: VILLAGE_CONFIG.historyEn,
      heroVideoUrl: "/videos/hero-video.mp4",
      address: VILLAGE_CONFIG.address,
      phone: VILLAGE_CONFIG.phone,
      email: VILLAGE_CONFIG.email,
      population: VILLAGE_CONFIG.population,
      area: VILLAGE_CONFIG.area,
      socialMedia: VILLAGE_CONFIG.socialMedia,
      mapCenterLat: -7.400,
      mapCenterLng: 110.100,
    },
  });
  console.log("✅ Village profile created:", profile.name);

  // ─── 3. Organization Members ────────────────────────────
  for (const member of ORGANIZATION_MEMBERS) {
    await prisma.organizationMember.create({
      data: { ...member, profileId: profile.id },
    });
  }
  console.log("✅ Organization members created:", ORGANIZATION_MEMBERS.length);

  // ─── 3b. Mission Items ──────────────────────────────────
  for (let i = 0; i < MISSION_ITEMS.length; i++) {
    await prisma.missionItem.create({
      data: {
        textId: MISSION_ITEMS[i].textId,
        textEn: MISSION_ITEMS[i].textEn,
        order: i,
        profileId: profile.id,
      },
    });
  }
  console.log("✅ Mission items created:", MISSION_ITEMS.length);

  // ─── 4. Products ────────────────────────────────────────
  const products = [
    {
      nameId: "Kopi Robusta Sumbing", nameEn: "Mount Sumbing Robusta Coffee",
      descriptionId: "Kopi robusta premium yang ditanam di ketinggian 900–1.100 mdpl di lembah Gunung Sumbing, Windusari, Magelang. Diproses secara natural dengan rasa cokelat dan aroma earthy yang khas. Hasil panen petani lokal Desa Tanjungsari.",
      descriptionEn: "Premium robusta coffee grown at 900–1,100 meters above sea level in the valley of Mount Sumbing, Windusari, Magelang. Naturally processed with distinctive chocolate taste and earthy aroma. Harvested by local farmers of Tanjungsari Village.",
      category: "UMKM" as const, price: 75000, unit: "250g", contact: "08123456001", isActive: true,
      specificationsId: "- Ketinggian Tanam: 900–1.100 mdpl\n- Proses: Natural\n- Tingkat Sangrai: Medium-Dark\n- Varian: Biji Kopi / Bubuk",
      specificationsEn: "- Altitude: 900–1,100 masl\n- Process: Natural\n- Roast Level: Medium-Dark\n- Variant: Whole Bean / Ground",
      imageUrl: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=800",
      storeImageUrl: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800",
      productionImageUrl: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800",
    },
    {
      nameId: "Madu Hutan Asli", nameEn: "Pure Forest Honey",
      descriptionId: "Madu murni yang dipanen langsung dari hutan lindung sekitar desa. Kaya akan antioksidan dan memiliki rasa manis alami. Dikemas dalam botol kaca untuk menjaga kualitas.",
      descriptionEn: "Pure honey harvested directly from the protected forest around the village. Rich in antioxidants with natural sweetness. Packaged in glass bottles to maintain quality.",
      category: "UMKM" as const, price: 120000, unit: "500ml", contact: "08123456002", isActive: true,
      specificationsId: "- Jenis: Madu Hutan Liar\n- Isi Bersih: 500ml\n- Kemasan: Botol Kaca\n- Umur Simpan: 2 Tahun",
      specificationsEn: "- Type: Wild Forest Honey\n- Net Volume: 500ml\n- Packaging: Glass Bottle\n- Shelf Life: 2 Years",
      imageUrl: "https://images.unsplash.com/photo-1587049352847-81a56d773c1c?w=800",
      storeImageUrl: "https://images.unsplash.com/photo-1558234832-243ee7d488f2?w=800",
      productionImageUrl: "https://images.unsplash.com/photo-1621287661502-3c2cc0c7e2d9?w=800",
    },
    {
      nameId: "Wisata Alam Lembah Sumbing", nameEn: "Sumbing Valley Nature Tour",
      descriptionId: "Wisata alam di lembah Gunung Sumbing dengan pemandangan perbukitan hijau dan udara sejuk khas dataran tinggi Magelang. Cocok untuk hiking ringan, fotografi, dan menikmati sunrise di ketinggian 1.000 mdpl.",
      descriptionEn: "Nature tourism in the valley of Mount Sumbing with green hillside views and cool highland air typical of Magelang. Perfect for light hiking, photography, and enjoying sunrise at 1,000 meters above sea level.",
      category: "WISATA" as const, price: 10000, unit: "tiket masuk", contact: "08123456003", isActive: true,
      specificationsId: "- Ketinggian: 1.000 mdpl\n- Jarak Trekking: 1,5 Km\n- Fasilitas: Toilet, Mushola, Warung Makan\n- Jam Operasional: 05:00 - 17:00 WIB",
      specificationsEn: "- Altitude: 1,000 masl\n- Trekking Distance: 1.5 Km\n- Facilities: Restroom, Prayer Room, Food Stalls\n- Operating Hours: 05:00 AM - 05:00 PM",
      imageUrl: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800",
      storeImageUrl: "https://images.unsplash.com/photo-1518182170546-076616fdcefa?w=800",
      productionImageUrl: "https://images.unsplash.com/photo-1476611317561-60117649dd94?w=800",
    },
    {
      nameId: "Beras Organik Pandan Wangi", nameEn: "Organic Pandan Wangi Rice",
      descriptionId: "Beras organik varietas Pandan Wangi yang ditanam tanpa pestisida kimia. Memiliki aroma pandan alami dan tekstur pulen saat dimasak. Hasil panen langsung dari sawah desa.",
      descriptionEn: "Organic Pandan Wangi rice variety grown without chemical pesticides. Has a natural pandan aroma and fluffy texture when cooked. Freshly harvested from village rice fields.",
      category: "PERTANIAN" as const, price: 65000, unit: "5kg", contact: "08123456004", isActive: true,
      specificationsId: "- Varietas: Pandan Wangi Organik\n- Berat Bersih: 5 Kg\n- Metode Tanam: Tradisional Tanpa Pestisida\n- Aroma: Harum Pandan Alami",
      specificationsEn: "- Variety: Organic Pandan Wangi\n- Net Weight: 5 Kg\n- Farming Method: Traditional Pesticide-Free\n- Aroma: Natural Pandan Scent",
      imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800",
      storeImageUrl: "https://images.unsplash.com/photo-1595861966141-8f55da2db24c?w=800",
      productionImageUrl: "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=800",
    },
    {
      nameId: "Anyaman Bambu Tradisional", nameEn: "Traditional Bamboo Weaving",
      descriptionId: "Kerajinan anyaman bambu buatan tangan oleh pengrajin lokal desa. Tersedia dalam berbagai bentuk: keranjang, vas, dan dekorasi dinding. Setiap produk unik dan dibuat dengan teknik turun-temurun.",
      descriptionEn: "Handmade bamboo weaving crafted by local village artisans. Available in various forms: baskets, vases, and wall decorations. Each product is unique and made with traditional techniques.",
      category: "KERAJINAN" as const, price: 150000, unit: "pcs", contact: "08123456005", isActive: true,
      specificationsId: "- Bahan: Bambu Petung Pilihan\n- Warna: Natural\n- Ukuran: Bervariasi\n- Keunggulan: Ramah Lingkungan & Tahan Lama",
      specificationsEn: "- Material: Selected Petung Bamboo\n- Color: Natural\n- Size: Varies\n- Highlights: Eco-Friendly & Durable",
      imageUrl: "https://images.unsplash.com/photo-1596541602161-00109eb0d676?w=800",
      storeImageUrl: "https://images.unsplash.com/photo-1606502973842-f64bc2785fe5?w=800",
      productionImageUrl: "https://images.unsplash.com/photo-1618220179428-22790b46a0eb?w=800",
    },
    {
      nameId: "Getuk Goreng Khas Magelang", nameEn: "Magelang-style Fried Getuk",
      descriptionId: "Getuk goreng tradisional khas Magelang yang terbuat dari singkong pilihan dan gula merah. Digoreng hingga kecokelatan dengan tekstur renyah di luar dan lembut di dalam. Camilan khas Jawa Tengah yang cocok untuk oleh-oleh.",
      descriptionEn: "Traditional Magelang-style fried getuk made from selected cassava and palm sugar. Fried until golden brown with a crispy outside and soft inside texture. A classic Central Java snack perfect for souvenirs.",
      category: "KULINER" as const, price: 25000, unit: "box", contact: "08123456006", isActive: true,
      specificationsId: "- Komposisi: Singkong, Gula Merah, Kelapa Parut\n- Kemasan: Box Kertas Food Grade\n- Isi: 15 pcs / box\n- Masa Kedaluwarsa: 5 Hari",
      specificationsEn: "- Ingredients: Cassava, Palm Sugar, Grated Coconut\n- Packaging: Food Grade Paper Box\n- Content: 15 pcs / box\n- Expiry: 5 Days",
      imageUrl: "https://images.unsplash.com/photo-1616053424169-216973ba0a1d?w=800",
      storeImageUrl: "https://images.unsplash.com/photo-1589134720977-1647ebad4d71?w=800",
      productionImageUrl: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800",
    },
    {
      nameId: "Homestay Joglo Tanjungsari", nameEn: "Joglo Tanjungsari Homestay",
      descriptionId: "Penginapan tradisional bergaya joglo Jawa dengan pemandangan sawah terasering dan Gunung Sumbing. Dilengkapi fasilitas dasar dan sarapan tradisional Jawa. Kapasitas 2-4 orang per unit.",
      descriptionEn: "Traditional Javanese joglo-style accommodation with views of terraced rice fields and Mount Sumbing. Equipped with basic facilities and traditional Javanese breakfast. Capacity 2-4 people per unit.",
      category: "WISATA" as const, price: 300000, unit: "malam", contact: "08123456007", isActive: true,
      specificationsId: "- Kapasitas Maksimal: 4 Orang\n- Fasilitas: Kamar Mandi Dalam, Kipas Angin, Kasur Lesehan\n- View: Sawah Terasering dan Gunung Sumbing\n- Termasuk: Sarapan Pagi 2 Pax",
      specificationsEn: "- Maximum Capacity: 4 People\n- Facilities: En-suite Bathroom, Fan, Floor Mattress\n- View: Terraced Rice Fields and Mount Sumbing\n- Included: Breakfast for 2 Pax",
      imageUrl: "https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800",
      storeImageUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800",
      productionImageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
    },
    {
      nameId: "Potensi Wisata Bukit Grogol", nameEn: "Grogol Hill Tourism Potential",
      descriptionId: "Lahan seluas 2 hektar di puncak bukit Dusun Grogol dengan pemandangan 360 derajat ke lembah Gunung Sumbing dan perbukitan Windusari. Sangat cocok dikembangkan menjadi area glamping atau cafe dengan konsep alam.",
      descriptionEn: "A 2-hectare land at the hilltop of Grogol Hamlet with a 360-degree view of the Mount Sumbing valley and Windusari hills. Perfectly suited to be developed into a glamping area or nature-concept cafe.",
      category: "WISATA" as const, price: 0, unit: "Investasi", contact: "08123456099", isActive: true,
      specificationsId: "- Luas Lahan: 2 Hektar\n- Status Tanah: Tanah Kas Desa\n- Ketinggian: 1.100 mdpl\n- Akses: Jalan desa beraspal",
      specificationsEn: "- Land Area: 2 Hectares\n- Land Status: Village Owned\n- Altitude: 1,100 masl\n- Access: Paved village road",
      isPotential: true,
      investmentRequired: 500000000,
      investmentDetailsId: "- Pembangunan 5 unit tenda glamping eksklusif (Rp 250 Juta)\n- Pembangunan fasilitas umum, toilet, dan mushola (Rp 100 Juta)\n- Pembuatan cafe bambu semi-outdoor (Rp 100 Juta)\n- Pemasaran dan operasional awal (Rp 50 Juta)\n\nEstimasi Return of Investment (ROI): 2-3 Tahun dengan skema bagi hasil bersama BUMDes.",
      investmentDetailsEn: "- Construction of 5 exclusive glamping tents (Rp 250 Million)\n- Public facilities, restroom, and prayer room (Rp 100 Million)\n- Semi-outdoor bamboo cafe (Rp 100 Million)\n- Marketing and initial operations (Rp 50 Million)\n\nEstimated Return of Investment (ROI): 2-3 Years with a profit-sharing scheme with BUMDes.",
      imageUrl: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800",
      storeImageUrl: "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?w=800",
      productionImageUrl: "https://images.unsplash.com/photo-1498307833015-e7b400441eb8?w=800",
      locationUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63371.7!2d110.05!3d-7.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sWindusari%2C+Magelang!5e0!3m2!1sen!2sid!4v1709405625447!5m2!1sen!2sid",
      gallery: [
        "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800",
        "https://images.unsplash.com/photo-1517823382902-f26f98118b1b?w=800",
        "https://images.unsplash.com/photo-1444124818704-4d89a495bbae?w=800",
        "https://images.unsplash.com/photo-1473269712320-f24cfdcba4e5?w=800",
        "https://images.unsplash.com/photo-1496309732348-3627f3f040ee?w=800",
        "https://images.unsplash.com/photo-1519181245277-cffeb31da2e3?w=800"
      ]
    },
    {
      nameId: "Sayuran Organik Segar", nameEn: "Fresh Organic Vegetables",
      descriptionId: "Paket sayuran organik segar yang dipanen pagi hari langsung dari kebun desa. Tersedia: kangkung, bayam, tomat, cabai, terong, dan labu. Bebas pestisida kimia.",
      descriptionEn: "Fresh organic vegetable package harvested in the morning directly from the village garden. Available: water spinach, spinach, tomatoes, chili, eggplant, and squash. Free from chemical pesticides.",
      category: "PERTANIAN" as const, price: 25000, unit: "paket", contact: "08123456008", isActive: true,
      specificationsId: "- Isi Paket: Aneka Sayuran Hijau & Bumbu (Tergantung Panen)\n- Metode Tanam: 100% Organik\n- Waktu Panen: Pagi Hari\n- Pengiriman: Khusus Area Lokal",
      specificationsEn: "- Package Contains: Various Greens & Spices (Depending on Harvest)\n- Farming Method: 100% Organic\n- Harvest Time: Morning\n- Delivery: Local Area Only",
      imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800",
      storeImageUrl: "https://images.unsplash.com/photo-1595844730298-b960fad97351?w=800",
      productionImageUrl: "https://images.unsplash.com/photo-1590868309235-ea34bed7bd7f?w=800",
    },
    {
      nameId: "Batik Tulis Motif Sumbing", nameEn: "Mount Sumbing Motif Hand-drawn Batik",
      descriptionId: "Batik tulis eksklusif dengan motif khas lereng Gunung Sumbing dan flora lokal Magelang. Dikerjakan selama 2-4 minggu oleh pengrajin berpengalaman. Menggunakan pewarna alami dari tumbuhan lokal Jawa Tengah.",
      descriptionEn: "Exclusive hand-drawn batik with distinctive Mount Sumbing slopes and local Magelang flora motifs. Crafted over 2-4 weeks by experienced artisans. Uses natural dyes from local Central Java plants.",
      category: "KERAJINAN" as const, price: 450000, unit: "lembar", contact: "08123456009", isActive: true,
      specificationsId: "- Material Kain: Katun Primissima\n- Ukuran: 2 x 1,15 Meter\n- Proses Pengerjaan: Tulis Manual\n- Pewarnaan: Alami (Soga / Indigo)",
      specificationsEn: "- Fabric Material: Primissima Cotton\n- Dimensions: 2 x 1.15 Meters\n- Crafting Process: Manual Hand-drawn\n- Dye: Natural (Soga / Indigo)",
      imageUrl: "https://images.unsplash.com/photo-1621272036047-31fe39fc73b9?w=800",
      storeImageUrl: "https://images.unsplash.com/photo-1606115915130-b1281ce13d71?w=800",
      productionImageUrl: "https://images.unsplash.com/photo-1580226463991-325b8716f9f6?w=800",
    },
    {
      nameId: "Nasi Gurih Khas Tanjungsari", nameEn: "Tanjungsari Special Nasi Gurih",
      descriptionId: "Nasi gurih tradisional Jawa Tengah dengan lauk ikan teri, tahu bacem, tempe goreng, dan sambal krecek. Dimasak menggunakan kayu bakar dan santan kelapa asli. Tersedia untuk pesanan catering minimal 20 porsi.",
      descriptionEn: "Traditional Central Javanese nasi gurih with salted anchovies, marinated tofu, fried tempeh, and krecek sambal. Cooked using firewood and real coconut milk. Available for catering orders minimum 20 portions.",
      category: "KULINER" as const, price: 20000, unit: "porsi", contact: "08123456010", isActive: true,
      specificationsId: "- Menu Utama: Nasi Gurih, Ikan Teri Masin\n- Pelengkap: Tahu Bacem, Tempe Goreng, Sambal Krecek, Lalapan\n- Kemasan: Box / Tampah Bambu (untuk rombongan)\n- Minimum Order: 20 Porsi",
      specificationsEn: "- Main Dish: Savory Rice, Salted Anchovies\n- Sides: Marinated Tofu, Fried Tempeh, Krecek Sambal, Fresh Greens\n- Packaging: Box / Bamboo Tray (for groups)\n- Minimum Order: 20 Portions",
      imageUrl: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=800",
      storeImageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
      productionImageUrl: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800",
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }
  console.log("✅ Products created:", products.length);

  // ─── 4.5 Digital Materials ────────────────────────────
  const materials = [
    {
      titleId: "Panduan BUMDes 2024",
      titleEn: "BUMDes Guide 2024",
      descriptionId: "Buku panduan lengkap tentang tata cara pembentukan dan pengelolaan Badan Usaha Milik Desa tahun 2024.",
      descriptionEn: "Complete guidebook on the formation and management procedures of Village-Owned Enterprises in 2024.",
      category: "UMUM" as const,
      fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      fileType: "PDF" as const,
      fileSize: 2450000,
      fileName: "panduan_bumdes_2024.pdf",
      isPublished: true,
    },
    {
      titleId: "Modul Pelatihan Pertanian Organik",
      titleEn: "Organic Farming Training Module",
      descriptionId: "Materi pelatihan teknik pembuatan pupuk kompos dan pestisida nabati untuk pertanian berkelanjutan.",
      descriptionEn: "Training material on composting techniques and botanical pesticides for sustainable agriculture.",
      category: "PERTANIAN" as const,
      fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      fileType: "PDF" as const,
      fileSize: 5200000,
      fileName: "modul_pertanian_organik.pdf",
      isPublished: true,
    },
    {
      titleId: "Sosialisasi Pencegahan Stunting",
      titleEn: "Stunting Prevention Socialization",
      descriptionId: "Video dokumentasi kegiatan sosialisasi pencegahan stunting di balai desa.",
      descriptionEn: "Documentation video of stunting prevention socialization activities at the village hall.",
      category: "KESEHATAN" as const,
      fileUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      fileType: "VIDEO" as const,
      fileSize: 15400000,
      fileName: "video_stunting_2023.mp4",
      isPublished: true,
    }
  ];

  for (const material of materials) {
    await prisma.digitalMaterial.create({
      data: material,
    });
  }
  console.log("✅ Digital Materials created:", materials.length);

  // ─── 5. Finance Records ─────────────────────────────────
  const financeRecords = [
    // 2024 — Income
    { year: 2024, type: "INCOME" as const, categoryId: "Dana Desa", categoryEn: "Village Fund", amount: 850000000, budget: 850000000, sourceId: "APBN", sourceEn: "National Budget" },
    { year: 2024, type: "INCOME" as const, categoryId: "Alokasi Dana Desa", categoryEn: "Village Fund Allocation", amount: 420000000, budget: 450000000, sourceId: "APBD Kabupaten", sourceEn: "District Budget" },
    { year: 2024, type: "INCOME" as const, categoryId: "Pendapatan Asli Desa", categoryEn: "Village Original Income", amount: 180000000, budget: 200000000, sourceId: "Retribusi & BUMDES", sourceEn: "Fees & Village Enterprise" },
    { year: 2024, type: "INCOME" as const, categoryId: "Bantuan Provinsi", categoryEn: "Provincial Aid", amount: 150000000, budget: 150000000, sourceId: "APBD Provinsi", sourceEn: "Provincial Budget" },
    { year: 2024, type: "INCOME" as const, categoryId: "Lain-lain Pendapatan", categoryEn: "Other Income", amount: 45000000, budget: 50000000, sourceId: "Hibah & Sumbangan", sourceEn: "Grants & Donations" },
    // 2024 — Expense
    { year: 2024, type: "EXPENSE" as const, categoryId: "Pembangunan Infrastruktur", categoryEn: "Infrastructure Development", subcategoryId: "Jalan, jembatan, irigasi", subcategoryEn: "Roads, bridges, irrigation", amount: 520000000, budget: 600000000 },
    { year: 2024, type: "EXPENSE" as const, categoryId: "Pendidikan & Pelatihan", categoryEn: "Education & Training", subcategoryId: "Beasiswa, pelatihan UMKM", subcategoryEn: "Scholarships, SME training", amount: 280000000, budget: 300000000 },
    { year: 2024, type: "EXPENSE" as const, categoryId: "Kesehatan", categoryEn: "Health", subcategoryId: "Posyandu, sanitasi, air bersih", subcategoryEn: "Health post, sanitation, clean water", amount: 195000000, budget: 200000000 },
    { year: 2024, type: "EXPENSE" as const, categoryId: "Pemerintahan Desa", categoryEn: "Village Governance", subcategoryId: "Operasional, gaji perangkat", subcategoryEn: "Operations, staff salaries", amount: 320000000, budget: 320000000 },
    { year: 2024, type: "EXPENSE" as const, categoryId: "Pemberdayaan Masyarakat", categoryEn: "Community Empowerment", subcategoryId: "PKK, Karang Taruna, BUMDES", subcategoryEn: "Women's group, Youth org, Village Enterprise", amount: 130000000, budget: 150000000 },
    // 2023 — Income
    { year: 2023, type: "INCOME" as const, categoryId: "Dana Desa", categoryEn: "Village Fund", amount: 800000000, budget: 800000000 },
    { year: 2023, type: "INCOME" as const, categoryId: "Alokasi Dana Desa", categoryEn: "Village Fund Allocation", amount: 400000000, budget: 420000000 },
    { year: 2023, type: "INCOME" as const, categoryId: "Pendapatan Asli Desa", categoryEn: "Village Original Income", amount: 150000000, budget: 180000000 },
    { year: 2023, type: "INCOME" as const, categoryId: "Bantuan Provinsi", categoryEn: "Provincial Aid", amount: 130000000, budget: 130000000 },
    { year: 2023, type: "INCOME" as const, categoryId: "Lain-lain Pendapatan", categoryEn: "Other Income", amount: 40000000, budget: 50000000 },
    // 2023 — Expense
    { year: 2023, type: "EXPENSE" as const, categoryId: "Pembangunan Infrastruktur", categoryEn: "Infrastructure Development", amount: 480000000, budget: 550000000 },
    { year: 2023, type: "EXPENSE" as const, categoryId: "Pendidikan & Pelatihan", categoryEn: "Education & Training", amount: 250000000, budget: 280000000 },
    { year: 2023, type: "EXPENSE" as const, categoryId: "Kesehatan", categoryEn: "Health", amount: 170000000, budget: 180000000 },
    { year: 2023, type: "EXPENSE" as const, categoryId: "Pemerintahan Desa", categoryEn: "Village Governance", amount: 300000000, budget: 300000000 },
    { year: 2023, type: "EXPENSE" as const, categoryId: "Pemberdayaan Masyarakat", categoryEn: "Community Empowerment", amount: 110000000, budget: 130000000 },
  ];

  for (const record of financeRecords) {
    await prisma.financeRecord.create({ data: record });
  }
  console.log("✅ Finance records created:", financeRecords.length);

  // ─── 6. News ────────────────────────────────────────────
  const newsArticles = [
    {
      titleId: "Desa Tanjungsari Raih Penghargaan Desa Digital Terbaik 2024",
      titleEn: "Tanjungsari Village Wins Best Digital Village Award 2024",
      slug: "penghargaan-desa-digital-2024",
      contentId: "<p>Desa Tanjungsari berhasil meraih penghargaan sebagai Desa Digital Terbaik tingkat Kabupaten Magelang tahun 2024. Penghargaan ini diberikan atas keberhasilan desa dalam mengimplementasikan sistem informasi desa terintegrasi, transparansi keuangan digital, dan pelayanan publik berbasis online.</p><p>Kepala Desa menyampaikan rasa syukur dan bangga atas pencapaian ini. \"Ini adalah hasil kerja keras seluruh perangkat desa dan partisipasi aktif masyarakat dalam mendukung digitalisasi desa,\" ujarnya.</p>",
      contentEn: "<p>Tanjungsari Village has won the Best Digital Village award at the Magelang Regency level in 2024. The award was given for the village's success in implementing an integrated village information system, digital financial transparency, and online-based public services.</p><p>The Village Head expressed gratitude and pride for this achievement. \"This is the result of hard work by all village officials and active community participation in supporting village digitalization,\" he said.</p>",
      excerptId: "Desa Tanjungsari berhasil meraih penghargaan Desa Digital Terbaik tingkat Kabupaten Magelang.",
      excerptEn: "Tanjungsari Village wins Best Digital Village award at Magelang Regency level.",
      category: "PENGUMUMAN" as const,
      isPublished: true,
      authorId: admin.id,
      publishedAt: new Date("2024-03-15"),
    },
    {
      titleId: "Pelatihan UMKM Digital Marketing untuk Warga Desa",
      titleEn: "Digital Marketing Training for Village SMEs",
      slug: "pelatihan-umkm-digital-marketing",
      contentId: "<p>Pemerintah Desa Tanjungsari bekerja sama dengan Dinas Koperasi dan UMKM mengadakan pelatihan digital marketing selama 3 hari untuk para pelaku UMKM desa. Pelatihan mencakup penggunaan media sosial, marketplace, dan fotografi produk.</p><p>Sebanyak 45 peserta dari berbagai sektor UMKM mengikuti pelatihan yang berlangsung di Balai Desa. Para peserta diajarkan cara membuat konten menarik, mengelola toko online, dan strategi pemasaran digital yang efektif.</p>",
      contentEn: "<p>The Tanjungsari Village Government in collaboration with the Cooperative and SME Agency held a 3-day digital marketing training for village SME practitioners. The training covered social media usage, marketplaces, and product photography.</p><p>A total of 45 participants from various SME sectors attended the training held at the Village Hall. Participants were taught how to create engaging content, manage online stores, and effective digital marketing strategies.</p>",
      excerptId: "Pelatihan digital marketing selama 3 hari untuk 45 pelaku UMKM desa.",
      excerptEn: "3-day digital marketing training for 45 village SME practitioners.",
      category: "KEGIATAN" as const,
      isPublished: true,
      authorId: admin.id,
      publishedAt: new Date("2024-04-20"),
    },
    {
      titleId: "Pembangunan Jalan Penghubung Dusun Grogol Selesai",
      titleEn: "Grogol Hamlet Connecting Road Construction Completed",
      slug: "pembangunan-jalan-grogol",
      contentId: "<p>Proyek pembangunan jalan penghubung antara Dusun Grogol dan Dusun Pendekan telah resmi selesai dan diresmikan oleh Camat Windusari. Jalan sepanjang 500 meter ini dibangun menggunakan Dana Desa tahun 2024 dengan total anggaran Rp 280 juta.</p><p>Dengan selesainya jalan ini, waktu tempuh antara kedua dusun yang sebelumnya 30 menit kini hanya 10 menit. Hal ini diharapkan dapat meningkatkan aksesibilitas dan perekonomian warga di kedua dusun.</p>",
      contentEn: "<p>The road construction project connecting Grogol and Pendekan hamlets has been officially completed and inaugurated by the Windusari Sub-district Head. The 500-meter road was built using the 2024 Village Fund with a total budget of Rp 280 million.</p><p>With this road completed, travel time between the two hamlets has been reduced from 30 minutes to just 10 minutes. This is expected to improve accessibility and the economy for residents in both hamlets.</p>",
      excerptId: "Jalan 500 meter penghubung Dusun Grogol dan Pendekan resmi selesai.",
      excerptEn: "500-meter road connecting Grogol and Pendekan hamlets officially completed.",
      category: "PEMBANGUNAN" as const,
      isPublished: true,
      authorId: admin.id,
      publishedAt: new Date("2024-05-10"),
    },
    {
      titleId: "Jadwal Posyandu dan Vaksinasi Bulan Juni 2024",
      titleEn: "June 2024 Health Post and Vaccination Schedule",
      slug: "jadwal-posyandu-juni-2024",
      contentId: "<p>Pemerintah Desa Tanjungsari menginformasikan jadwal Posyandu dan vaksinasi untuk bulan Juni 2024. Kegiatan dilaksanakan di 6 pos yang tersebar di setiap dusun.</p><ul><li>Pos 1 (Dusun Grogol): Senin, 3 Juni 2024</li><li>Pos 2 (Dusun Pendekan): Selasa, 4 Juni 2024</li><li>Pos 3 (Dusun Ngabean): Rabu, 5 Juni 2024</li><li>Pos 4 (Dusun Sudimoro Krajan): Kamis, 6 Juni 2024</li><li>Pos 5 (Dusun Sudimoro Dukuh): Jumat, 7 Juni 2024</li><li>Pos 6 (Dusun Sudimoro Jurang): Sabtu, 8 Juni 2024</li></ul><p>Warga diminta membawa KTP, KK, dan buku KIA untuk anak balita.</p>",
      contentEn: "<p>Tanjungsari Village Government informs the Health Post and vaccination schedule for June 2024. Activities will be held at 6 posts spread across each hamlet.</p><ul><li>Post 1 (Grogol): Monday, June 3, 2024</li><li>Post 2 (Pendekan): Tuesday, June 4, 2024</li><li>Post 3 (Ngabean): Wednesday, June 5, 2024</li><li>Post 4 (Sudimoro Krajan): Thursday, June 6, 2024</li><li>Post 5 (Sudimoro Dukuh): Friday, June 7, 2024</li><li>Post 6 (Sudimoro Jurang): Saturday, June 8, 2024</li></ul><p>Residents are asked to bring their ID card, family card, and child health book.</p>",
      excerptId: "Jadwal Posyandu di 6 pos dusun untuk bulan Juni 2024.",
      excerptEn: "Health post schedule at 6 hamlet posts for June 2024.",
      category: "PENGUMUMAN" as const,
      isPublished: true,
      authorId: admin.id,
      publishedAt: new Date("2024-05-28"),
    },
    {
      titleId: "Festival Budaya Desa Tanjungsari 2024 Sukses Digelar",
      titleEn: "Tanjungsari Village Cultural Festival 2024 Successfully Held",
      slug: "festival-budaya-2024",
      contentId: "<p>Festival Budaya Desa Tanjungsari 2024 sukses digelar selama 3 hari pada tanggal 15-17 Mei 2024. Acara yang menampilkan berbagai pertunjukan seni tradisional Jawa ini berhasil menarik lebih dari 2.000 pengunjung dari dalam dan luar desa.</p><p>Rangkaian acara meliputi pertunjukan wayang kulit, tari gambyong, pencak silat, serta bazar kuliner tradisional Jawa Tengah. Festival ini juga menjadi ajang promosi produk UMKM lokal yang berhasil membukukan transaksi lebih dari Rp 50 juta selama 3 hari.</p>",
      contentEn: "<p>The 2024 Tanjungsari Village Cultural Festival was successfully held for 3 days from May 15-17, 2024. The event featuring various traditional Javanese art performances attracted more than 2,000 visitors from inside and outside the village.</p><p>The series of events included wayang kulit puppet shows, gambyong dance, pencak silat martial arts, and traditional Central Javanese culinary bazaar. The festival also served as a promotional platform for local SME products, recording transactions of more than Rp 50 million over 3 days.</p>",
      excerptId: "Festival budaya 3 hari berhasil menarik 2.000 pengunjung dan transaksi UMKM Rp 50 juta.",
      excerptEn: "3-day cultural festival attracted 2,000 visitors and Rp 50 million in SME transactions.",
      category: "KEGIATAN" as const,
      isPublished: true,
      authorId: admin.id,
      publishedAt: new Date("2024-05-18"),
    },
  ];

  for (const article of newsArticles) {
    await prisma.news.upsert({
      where: { slug: article.slug },
      update: {},
      create: article,
    });
  }
  console.log("✅ News articles created:", newsArticles.length);

  // ─── 7. Gallery Items ───────────────────────────────────
  const galleryItems = [
    { titleId: "Panorama Sawah Terasering", titleEn: "Terraced Rice Field Panorama", type: "PHOTO" as const, url: "https://placehold.co/600x400?text=Sawah", category: "Wisata" },
    { titleId: "Upacara Adat Bersih Desa", titleEn: "Bersih Desa Traditional Ceremony", type: "PHOTO" as const, url: "https://placehold.co/600x400?text=Budaya", category: "Budaya" },
    { titleId: "Pelatihan UMKM 2024", titleEn: "SME Training 2024", type: "PHOTO" as const, url: "https://placehold.co/600x400?text=UMKM", category: "Kegiatan" },
    { titleId: "Pemandangan Lembah Sumbing", titleEn: "Sumbing Valley View", type: "PHOTO" as const, url: "https://placehold.co/600x400?text=Lembah", category: "Wisata" },
    { titleId: "Gotong Royong Pembangunan Jalan", titleEn: "Community Road Construction", type: "PHOTO" as const, url: "https://placehold.co/600x400?text=Pembangunan", category: "Pembangunan" },
    { titleId: "Panen Raya Padi Organik", titleEn: "Organic Rice Harvest", type: "PHOTO" as const, url: "https://placehold.co/600x400?text=Pertanian", category: "Pertanian" },
    { titleId: "Profil Desa Tanjungsari", titleEn: "Tanjungsari Village Profile", type: "VIDEO" as const, url: "https://youtu.be/dQw4w9WgXcQ", thumbnailUrl: "https://placehold.co/600x400?text=Video+Profil", category: "Profil" },
    { titleId: "Festival Budaya 2024 Highlights", titleEn: "Cultural Festival 2024 Highlights", type: "VIDEO" as const, url: "https://youtu.be/dQw4w9WgXcQ", thumbnailUrl: "https://placehold.co/600x400?text=Video+Festival", category: "Kegiatan" },
  ];

  for (const item of galleryItems) {
    await prisma.galleryItem.create({ data: item });
  }
  console.log("✅ Gallery items created:", galleryItems.length);

  // ─── 8. Map Features ────────────────────────────────────
  const mapFeatures = [
    {
      nameId: "Batas Wilayah Desa Tanjungsari", nameEn: "Tanjungsari Village Boundary",
      type: "BOUNDARY" as const,
      geometry: { type: "Polygon", coordinates: [[[110.08, -7.38], [110.12, -7.38], [110.13, -7.40], [110.11, -7.42], [110.07, -7.41], [110.06, -7.39], [110.08, -7.38]]] },
      isVisible: true,
    },
    {
      nameId: "Kantor Desa Tanjungsari", nameEn: "Tanjungsari Village Office",
      type: "FACILITY" as const, icon: "building",
      geometry: { type: "Point", coordinates: [110.10, -7.40] },
      descriptionId: "Kantor pelayanan pemerintahan desa di Dusun Grogol", descriptionEn: "Village government service office in Grogol Hamlet",
      isVisible: true,
    },
    {
      nameId: "SD Inpres Tanjungsari", nameEn: "Tanjungsari Elementary School",
      type: "FACILITY" as const, icon: "school",
      geometry: { type: "Point", coordinates: [110.098, -7.398] },
      isVisible: true,
    },
    {
      nameId: "Masjid Agung Tanjungsari", nameEn: "Tanjungsari Grand Mosque",
      type: "FACILITY" as const, icon: "mosque",
      geometry: { type: "Point", coordinates: [110.102, -7.402] },
      isVisible: true,
    },
    {
      nameId: "Pasar Windusari", nameEn: "Windusari Market",
      type: "POI" as const, icon: "market",
      geometry: { type: "Point", coordinates: [110.105, -7.405] },
      descriptionId: "Pasar tradisional di Dusun Sudimoro Krajan", descriptionEn: "Traditional market in Sudimoro Krajan Hamlet",
      isVisible: true,
    },
    {
      nameId: "Pondok Pesantren Sudimoro", nameEn: "Sudimoro Islamic Boarding School",
      type: "FACILITY" as const, icon: "school",
      geometry: { type: "Point", coordinates: [110.095, -7.408] },
      descriptionId: "Salah satu dari 2 pondok pesantren di Dusun Sudimoro", descriptionEn: "One of 2 Islamic boarding schools in Sudimoro Hamlet",
      isVisible: true,
    },
  ];

  for (const feature of mapFeatures) {
    await prisma.mapFeature.create({ data: feature });
  }
  console.log("✅ Map features created:", mapFeatures.length);

  console.log("\n🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
