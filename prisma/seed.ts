import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ─── 1. Admin User ──────────────────────────────────────
  const hashedPassword = await hash("Admin@Desa2024", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@sukamakmur.desa.id" },
    update: {},
    create: {
      email: "admin@sukamakmur.desa.id",
      name: "Administrator",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log("✅ Admin user created:", admin.email);

  // ─── 2. Village Profile (Singleton) ─────────────────────
  const profile = await prisma.villageProfile.upsert({
    where: { id: "village-profile-singleton" },
    update: {},
    create: {
      id: "village-profile-singleton",
      name: "Desa Sukamakmur",
      descriptionId:
        "Desa Sukamakmur terletak di kaki Gunung Salak, Kabupaten Bogor, Jawa Barat. Desa ini dikenal dengan keindahan alam, hasil pertanian yang melimpah, dan keramahan penduduknya. Dengan luas wilayah 1.200 hektar, desa ini menjadi rumah bagi lebih dari 5.200 jiwa yang hidup harmonis dalam keberagaman.",
      descriptionEn:
        "Sukamakmur Village is located at the foot of Mount Salak, Bogor Regency, West Java. The village is known for its natural beauty, abundant agricultural products, and the hospitality of its residents. With an area of 1,200 hectares, this village is home to more than 5,200 people living in harmony.",
      visionId:
        "Mewujudkan Desa Sukamakmur yang mandiri, sejahtera, dan berbudaya berbasis potensi lokal.",
      visionEn:
        "To realize Sukamakmur Village as an independent, prosperous, and cultured village based on local potential.",
      missionId:
        "1. Meningkatkan kualitas pelayanan publik yang transparan dan akuntabel\n2. Mengembangkan potensi ekonomi lokal melalui UMKM dan wisata desa\n3. Membangun infrastruktur yang merata dan berkelanjutan\n4. Melestarikan budaya dan kearifan lokal\n5. Meningkatkan kualitas sumber daya manusia melalui pendidikan dan pelatihan",
      missionEn:
        "1. Improve the quality of transparent and accountable public services\n2. Develop local economic potential through SMEs and village tourism\n3. Build equitable and sustainable infrastructure\n4. Preserve culture and local wisdom\n5. Improve human resource quality through education and training",
      historyId:
        "Desa Sukamakmur berdiri pada tahun 1945 setelah kemerdekaan Indonesia. Awalnya merupakan bagian dari Desa Ciapus sebelum dimekarkan pada tahun 1970. Nama 'Sukamakmur' berasal dari bahasa Sunda yang berarti 'senang dan makmur', mencerminkan harapan para pendiri desa akan kehidupan yang sejahtera bagi seluruh warganya. Pada tahun 2015, desa ini mulai mengembangkan sektor wisata dan berhasil meraih penghargaan Desa Wisata Terbaik tingkat kabupaten pada tahun 2022.",
      historyEn:
        "Sukamakmur Village was established in 1945 after Indonesian independence. It was originally part of Ciapus Village before being divided in 1970. The name 'Sukamakmur' comes from Sundanese meaning 'happy and prosperous', reflecting the founders' hopes for a prosperous life for all residents. In 2015, the village began developing its tourism sector and won the Best Tourism Village award at the district level in 2022.",
      heroVideoUrl: "/videos/hero-video.mp4",
      address:
        "Jl. Raya Sukamakmur No. 1, Kec. Sukamakmur, Kab. Bogor, Jawa Barat 16830",
      phone: "0251-8000123",
      email: "desa@sukamakmur.desa.id",
      population: 5247,
      area: 1200.5,
      socialMedia: {
        facebook: "https://facebook.com/desasukamakmur",
        instagram: "https://instagram.com/desasukamakmur",
        youtube: "https://youtube.com/@desasukamakmur",
      },
    },
  });
  console.log("✅ Village profile created:", profile.name);

  // ─── 3. Organization Members ────────────────────────────
  const members = [
    { name: "H. Ahmad Sudirman, S.Sos", positionId: "Kepala Desa", positionEn: "Village Head", photoUrl: "/images/org/kepala-desa.jpg", order: 1 },
    { name: "Siti Nurhaliza, S.AP", positionId: "Sekretaris Desa", positionEn: "Village Secretary", photoUrl: "/images/org/sekretaris.jpg", order: 2 },
    { name: "Budi Santoso", positionId: "Kaur Keuangan", positionEn: "Head of Finance", photoUrl: "/images/org/kaur-keuangan.jpg", order: 3 },
    { name: "Dewi Anggraeni, S.Pd", positionId: "Kaur Perencanaan", positionEn: "Head of Planning", photoUrl: "/images/org/kaur-perencanaan.jpg", order: 4 },
    { name: "Ridwan Kamil", positionId: "Kasi Pemerintahan", positionEn: "Head of Governance", photoUrl: "/images/org/kasi-pemerintahan.jpg", order: 5 },
    { name: "Rina Wulandari", positionId: "Kasi Kesejahteraan", positionEn: "Head of Welfare", photoUrl: "/images/org/kasi-kesejahteraan.jpg", order: 6 },
    { name: "Joko Prasetyo", positionId: "Kasi Pelayanan", positionEn: "Head of Services", photoUrl: "/images/org/kasi-pelayanan.jpg", order: 7 },
  ];

  for (const member of members) {
    await prisma.organizationMember.create({
      data: { ...member, profileId: profile.id },
    });
  }
  console.log("✅ Organization members created:", members.length);

  // ─── 4. Products ────────────────────────────────────────
  const products = [
    {
      nameId: "Kopi Arabika Gunung Salak", nameEn: "Mount Salak Arabica Coffee",
      descriptionId: "Kopi arabika premium yang ditanam di ketinggian 1.200 mdpl di lereng Gunung Salak. Diproses secara natural dengan rasa fruity dan aroma floral yang khas. Tersedia dalam bentuk biji utuh dan bubuk.",
      descriptionEn: "Premium arabica coffee grown at 1,200 meters above sea level on the slopes of Mount Salak. Naturally processed with distinctive fruity taste and floral aroma. Available in whole bean and ground.",
      category: "UMKM" as const, price: 85000, unit: "250g", contact: "08123456001", isActive: true,
      specificationsId: "- Ketinggian Tanam: 1.200 mdpl\n- Proses: Natural\n- Tingkat Sangrai: Medium\n- Varian: Biji Kopi / Bubuk",
      specificationsEn: "- Altitude: 1,200 masl\n- Process: Natural\n- Roast Level: Medium\n- Variant: Whole Bean / Ground",
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
      nameId: "Wisata Air Terjun Curug Nangka", nameEn: "Curug Nangka Waterfall Tour",
      descriptionId: "Air terjun setinggi 40 meter yang tersembunyi di dalam hutan tropis desa. Akses trekking sejauh 2 km dengan pemandangan alam yang memukau. Cocok untuk hiking dan fotografi.",
      descriptionEn: "A 40-meter waterfall hidden in the village's tropical forest. A 2 km trekking access with stunning natural scenery. Perfect for hiking and photography.",
      category: "WISATA" as const, price: 15000, unit: "tiket masuk", contact: "08123456003", isActive: true,
      specificationsId: "- Tinggi Air Terjun: 40 Meter\n- Jarak Trekking: 2 Km\n- Fasilitas: Toilet, Mushola, Warung Makan\n- Jam Operasional: 07:00 - 16:00 WIB",
      specificationsEn: "- Waterfall Height: 40 Meters\n- Trekking Distance: 2 Km\n- Facilities: Restroom, Prayer Room, Food Stalls\n- Operating Hours: 07:00 AM - 04:00 PM",
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
      nameId: "Dodol Susu Khas Desa", nameEn: "Village Special Milk Dodol",
      descriptionId: "Dodol susu tradisional yang dibuat dari susu sapi segar peternak desa. Dimasak selama 8 jam dengan resep warisan nenek moyang. Tekstur kenyal dan rasa manis gurih yang khas.",
      descriptionEn: "Traditional milk dodol made from fresh cow's milk from village farmers. Cooked for 8 hours with an ancestral recipe. Chewy texture with distinctive sweet and savory flavor.",
      category: "KULINER" as const, price: 35000, unit: "box", contact: "08123456006", isActive: true,
      specificationsId: "- Komposisi: Susu Sapi, Gula Aren, Tepung Ketan\n- Kemasan: Box Kertas Food Grade\n- Isi: 20 pcs / box\n- Masa Kedaluwarsa: 1 Bulan",
      specificationsEn: "- Ingredients: Cow's Milk, Palm Sugar, Glutinous Rice Flour\n- Packaging: Food Grade Paper Box\n- Content: 20 pcs / box\n- Expiry: 1 Month",
      imageUrl: "https://images.unsplash.com/photo-1616053424169-216973ba0a1d?w=800",
      storeImageUrl: "https://images.unsplash.com/photo-1589134720977-1647ebad4d71?w=800",
      productionImageUrl: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800",
    },
    {
      nameId: "Homestay Saung Asri", nameEn: "Saung Asri Homestay",
      descriptionId: "Penginapan tradisional bergaya saung Sunda dengan pemandangan sawah dan gunung. Dilengkapi fasilitas dasar dan sarapan tradisional. Kapasitas 2-4 orang per unit.",
      descriptionEn: "Traditional Sundanese-style saung accommodation with views of rice fields and mountains. Equipped with basic facilities and traditional breakfast. Capacity 2-4 people per unit.",
      category: "WISATA" as const, price: 350000, unit: "malam", contact: "08123456007", isActive: true,
      specificationsId: "- Kapasitas Maksimal: 4 Orang\n- Fasilitas: Kamar Mandi Dalam, Kipas Angin, Kasur Lesehan\n- View: Sawah dan Pegunungan\n- Termasuk: Sarapan Pagi 2 Pax",
      specificationsEn: "- Maximum Capacity: 4 People\n- Facilities: En-suite Bathroom, Fan, Floor Mattress\n- View: Rice Fields and Mountains\n- Included: Breakfast for 2 Pax",
      imageUrl: "https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800",
      storeImageUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800",
      productionImageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
    },
    {
      nameId: "Potensi Wisata Bukit Bintang", nameEn: "Bukit Bintang Tourism Potential",
      descriptionId: "Lahan seluas 2 hektar di puncak bukit dengan pemandangan 360 derajat ke lembah dan pegunungan sekitar. Sangat cocok dikembangkan menjadi area glamping atau cafe dengan konsep alam.",
      descriptionEn: "A 2-hectare land at the hilltop with a 360-degree view of the valley and surrounding mountains. Perfectly suited to be developed into a glamping area or nature-concept cafe.",
      category: "WISATA" as const, price: 0, unit: "Investasi", contact: "08123456099", isActive: true,
      specificationsId: "- Luas Lahan: 2 Hektar\n- Status Tanah: Tanah Kas Desa\n- Ketinggian: 1.500 mdpl\n- Akses: Jalan desa beraspal",
      specificationsEn: "- Land Area: 2 Hectares\n- Land Status: Village Owned\n- Altitude: 1,500 masl\n- Access: Paved village road",
      isPotential: true,
      investmentRequired: 500000000,
      investmentDetailsId: "- Pembangunan 5 unit tenda glamping eksklusif (Rp 250 Juta)\n- Pembangunan fasilitas umum, toilet, dan mushola (Rp 100 Juta)\n- Pembuatan cafe bambu semi-outdoor (Rp 100 Juta)\n- Pemasaran dan operasional awal (Rp 50 Juta)\n\nEstimasi Return of Investment (ROI): 2-3 Tahun dengan skema bagi hasil bersama BUMDes.",
      investmentDetailsEn: "- Construction of 5 exclusive glamping tents (Rp 250 Million)\n- Public facilities, restroom, and prayer room (Rp 100 Million)\n- Semi-outdoor bamboo cafe (Rp 100 Million)\n- Marketing and initial operations (Rp 50 Million)\n\nEstimated Return of Investment (ROI): 2-3 Years with a profit-sharing scheme with BUMDes.",
      imageUrl: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800",
      storeImageUrl: "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?w=800",
      productionImageUrl: "https://images.unsplash.com/photo-1498307833015-e7b400441eb8?w=800",
      locationUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126748.56347862248!2d107.57311654129782!3d-6.903444341687889!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e6398252477f%3A0x146a1f93d3e815b2!2sBandung%2C%20Bandung%20City%2C%20West%20Java!5e0!3m2!1sen!2sid!4v1709405625447!5m2!1sen!2sid",
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
      nameId: "Batik Tulis Motif Gunung Salak", nameEn: "Mount Salak Motif Hand-drawn Batik",
      descriptionId: "Batik tulis eksklusif dengan motif khas Gunung Salak dan flora lokal. Dikerjakan selama 2-4 minggu oleh pengrajin berpengalaman. Menggunakan pewarna alami dari tumbuhan lokal.",
      descriptionEn: "Exclusive hand-drawn batik with distinctive Mount Salak and local flora motifs. Crafted over 2-4 weeks by experienced artisans. Uses natural dyes from local plants.",
      category: "KERAJINAN" as const, price: 450000, unit: "lembar", contact: "08123456009", isActive: true,
      specificationsId: "- Material Kain: Katun Primissima\n- Ukuran: 2 x 1,15 Meter\n- Proses Pengerjaan: Tulis Manual\n- Pewarnaan: Alami (Soga / Indigo)",
      specificationsEn: "- Fabric Material: Primissima Cotton\n- Dimensions: 2 x 1.15 Meters\n- Crafting Process: Manual Hand-drawn\n- Dye: Natural (Soga / Indigo)",
      imageUrl: "https://images.unsplash.com/photo-1621272036047-31fe39fc73b9?w=800",
      storeImageUrl: "https://images.unsplash.com/photo-1606115915130-b1281ce13d71?w=800",
      productionImageUrl: "https://images.unsplash.com/photo-1580226463991-325b8716f9f6?w=800",
    },
    {
      nameId: "Nasi Liwet Khas Sukamakmur", nameEn: "Sukamakmur Special Nasi Liwet",
      descriptionId: "Nasi liwet tradisional dengan ikan teri, tahu, tempe, dan lalapan segar. Dimasak menggunakan kayu bakar dan santan kelapa asli. Tersedia untuk pesanan catering minimal 20 porsi.",
      descriptionEn: "Traditional nasi liwet with anchovies, tofu, tempeh, and fresh vegetables. Cooked using firewood and real coconut milk. Available for catering orders minimum 20 portions.",
      category: "KULINER" as const, price: 20000, unit: "porsi", contact: "08123456010", isActive: true,
      specificationsId: "- Menu Utama: Nasi Gurih, Ikan Teri Masin\n- Pelengkap: Tahu Goreng, Tempe Bacem, Sambal Terasi, Lalapan\n- Kemasan: Box / Tampah Bambu (untuk rombongan)\n- Minimum Order: 20 Porsi",
      specificationsEn: "- Main Dish: Savory Rice, Salted Anchovies\n- Sides: Fried Tofu, Marinated Tempeh, Shrimp Paste Sambal, Fresh Greens\n- Packaging: Box / Bamboo Tray (for groups)\n- Minimum Order: 20 Portions",
      imageUrl: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=800",
      storeImageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
      productionImageUrl: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800",
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }
  console.log("✅ Products created:", products.length);

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
      titleId: "Desa Sukamakmur Raih Penghargaan Desa Digital Terbaik 2024",
      titleEn: "Sukamakmur Village Wins Best Digital Village Award 2024",
      slug: "penghargaan-desa-digital-2024",
      contentId: "<p>Desa Sukamakmur berhasil meraih penghargaan sebagai Desa Digital Terbaik tingkat Kabupaten Bogor tahun 2024. Penghargaan ini diberikan atas keberhasilan desa dalam mengimplementasikan sistem informasi desa terintegrasi, transparansi keuangan digital, dan pelayanan publik berbasis online.</p><p>Kepala Desa H. Ahmad Sudirman menyampaikan rasa syukur dan bangga atas pencapaian ini. \"Ini adalah hasil kerja keras seluruh perangkat desa dan partisipasi aktif masyarakat dalam mendukung digitalisasi desa,\" ujarnya.</p>",
      contentEn: "<p>Sukamakmur Village has won the Best Digital Village award at the Bogor Regency level in 2024. The award was given for the village's success in implementing an integrated village information system, digital financial transparency, and online-based public services.</p><p>Village Head H. Ahmad Sudirman expressed gratitude and pride for this achievement. \"This is the result of hard work by all village officials and active community participation in supporting village digitalization,\" he said.</p>",
      excerptId: "Desa Sukamakmur berhasil meraih penghargaan Desa Digital Terbaik tingkat kabupaten.",
      excerptEn: "Sukamakmur Village wins Best Digital Village award at district level.",
      category: "PENGUMUMAN" as const,
      isPublished: true,
      authorId: admin.id,
      publishedAt: new Date("2024-03-15"),
    },
    {
      titleId: "Pelatihan UMKM Digital Marketing untuk Warga Desa",
      titleEn: "Digital Marketing Training for Village SMEs",
      slug: "pelatihan-umkm-digital-marketing",
      contentId: "<p>Pemerintah Desa Sukamakmur bekerja sama dengan Dinas Koperasi dan UMKM mengadakan pelatihan digital marketing selama 3 hari untuk para pelaku UMKM desa. Pelatihan mencakup penggunaan media sosial, marketplace, dan fotografi produk.</p><p>Sebanyak 45 peserta dari berbagai sektor UMKM mengikuti pelatihan yang berlangsung di Balai Desa. Para peserta diajarkan cara membuat konten menarik, mengelola toko online, dan strategi pemasaran digital yang efektif.</p>",
      contentEn: "<p>The Sukamakmur Village Government in collaboration with the Cooperative and SME Agency held a 3-day digital marketing training for village SME practitioners. The training covered social media usage, marketplaces, and product photography.</p><p>A total of 45 participants from various SME sectors attended the training held at the Village Hall. Participants were taught how to create engaging content, manage online stores, and effective digital marketing strategies.</p>",
      excerptId: "Pelatihan digital marketing selama 3 hari untuk 45 pelaku UMKM desa.",
      excerptEn: "3-day digital marketing training for 45 village SME practitioners.",
      category: "KEGIATAN" as const,
      isPublished: true,
      authorId: admin.id,
      publishedAt: new Date("2024-04-20"),
    },
    {
      titleId: "Pembangunan Jembatan Penghubung Dusun Sukamaju Selesai",
      titleEn: "Sukamaju Hamlet Connecting Bridge Construction Completed",
      slug: "pembangunan-jembatan-sukamaju",
      contentId: "<p>Proyek pembangunan jembatan penghubung antara Dusun Sukamaju dan Dusun Cikaret telah resmi selesai dan diresmikan oleh Camat Sukamakmur. Jembatan sepanjang 25 meter ini dibangun menggunakan Dana Desa tahun 2024 dengan total anggaran Rp 280 juta.</p><p>Dengan selesainya jembatan ini, waktu tempuh antara kedua dusun yang sebelumnya 45 menit kini hanya 10 menit. Hal ini diharapkan dapat meningkatkan aksesibilitas dan perekonomian warga di kedua dusun.</p>",
      contentEn: "<p>The bridge construction project connecting Sukamaju and Cikaret hamlets has been officially completed and inaugurated by the Sukamakmur Sub-district Head. The 25-meter bridge was built using the 2024 Village Fund with a total budget of Rp 280 million.</p><p>With this bridge completed, travel time between the two hamlets has been reduced from 45 minutes to just 10 minutes. This is expected to improve accessibility and the economy for residents in both hamlets.</p>",
      excerptId: "Jembatan 25 meter penghubung Dusun Sukamaju dan Cikaret resmi selesai.",
      excerptEn: "25-meter bridge connecting Sukamaju and Cikaret hamlets officially completed.",
      category: "PEMBANGUNAN" as const,
      isPublished: true,
      authorId: admin.id,
      publishedAt: new Date("2024-05-10"),
    },
    {
      titleId: "Jadwal Posyandu dan Vaksinasi Bulan Juni 2024",
      titleEn: "June 2024 Health Post and Vaccination Schedule",
      slug: "jadwal-posyandu-juni-2024",
      contentId: "<p>Pemerintah Desa Sukamakmur menginformasikan jadwal Posyandu dan vaksinasi untuk bulan Juni 2024. Kegiatan dilaksanakan di 4 pos yang tersebar di setiap dusun.</p><ul><li>Pos 1 (Dusun Sukamaju): Senin, 3 Juni 2024</li><li>Pos 2 (Dusun Cikaret): Selasa, 4 Juni 2024</li><li>Pos 3 (Dusun Ciherang): Rabu, 5 Juni 2024</li><li>Pos 4 (Dusun Sukamanah): Kamis, 6 Juni 2024</li></ul><p>Warga diminta membawa KTP, KK, dan buku KIA untuk anak balita.</p>",
      contentEn: "<p>Sukamakmur Village Government informs the Health Post and vaccination schedule for June 2024. Activities will be held at 4 posts spread across each hamlet.</p><ul><li>Post 1 (Sukamaju): Monday, June 3, 2024</li><li>Post 2 (Cikaret): Tuesday, June 4, 2024</li><li>Post 3 (Ciherang): Wednesday, June 5, 2024</li><li>Post 4 (Sukamanah): Thursday, June 6, 2024</li></ul><p>Residents are asked to bring their ID card, family card, and child health book.</p>",
      excerptId: "Jadwal Posyandu di 4 pos dusun untuk bulan Juni 2024.",
      excerptEn: "Health post schedule at 4 hamlet posts for June 2024.",
      category: "PENGUMUMAN" as const,
      isPublished: true,
      authorId: admin.id,
      publishedAt: new Date("2024-05-28"),
    },
    {
      titleId: "Festival Budaya Desa Sukamakmur 2024 Sukses Digelar",
      titleEn: "Sukamakmur Village Cultural Festival 2024 Successfully Held",
      slug: "festival-budaya-2024",
      contentId: "<p>Festival Budaya Desa Sukamakmur 2024 sukses digelar selama 3 hari pada tanggal 15-17 Mei 2024. Acara yang menampilkan berbagai pertunjukan seni tradisional Sunda ini berhasil menarik lebih dari 2.000 pengunjung dari dalam dan luar desa.</p><p>Rangkaian acara meliputi pertunjukan wayang golek, tari jaipong, pencak silat, serta bazar kuliner tradisional. Festival ini juga menjadi ajang promosi produk UMKM lokal yang berhasil membukukan transaksi lebih dari Rp 50 juta selama 3 hari.</p>",
      contentEn: "<p>The 2024 Sukamakmur Village Cultural Festival was successfully held for 3 days from May 15-17, 2024. The event featuring various traditional Sundanese art performances attracted more than 2,000 visitors from inside and outside the village.</p><p>The series of events included wayang golek puppet shows, jaipong dance, pencak silat martial arts, and traditional culinary bazaar. The festival also served as a promotional platform for local SME products, recording transactions of more than Rp 50 million over 3 days.</p>",
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
    { titleId: "Upacara Adat Seren Taun", titleEn: "Seren Taun Traditional Ceremony", type: "PHOTO" as const, url: "https://placehold.co/600x400?text=Budaya", category: "Budaya" },
    { titleId: "Pelatihan UMKM 2024", titleEn: "SME Training 2024", type: "PHOTO" as const, url: "https://placehold.co/600x400?text=UMKM", category: "Kegiatan" },
    { titleId: "Air Terjun Curug Nangka", titleEn: "Curug Nangka Waterfall", type: "PHOTO" as const, url: "https://placehold.co/600x400?text=Curug", category: "Wisata" },
    { titleId: "Gotong Royong Pembangunan Jalan", titleEn: "Community Road Construction", type: "PHOTO" as const, url: "https://placehold.co/600x400?text=Pembangunan", category: "Pembangunan" },
    { titleId: "Panen Raya Padi Organik", titleEn: "Organic Rice Harvest", type: "PHOTO" as const, url: "https://placehold.co/600x400?text=Pertanian", category: "Pertanian" },
    { titleId: "Profil Desa Sukamakmur", titleEn: "Sukamakmur Village Profile", type: "VIDEO" as const, url: "https://youtu.be/dQw4w9WgXcQ", thumbnailUrl: "https://placehold.co/600x400?text=Video+Profil", category: "Profil" },
    { titleId: "Festival Budaya 2024 Highlights", titleEn: "Cultural Festival 2024 Highlights", type: "VIDEO" as const, url: "https://youtu.be/dQw4w9WgXcQ", thumbnailUrl: "https://placehold.co/600x400?text=Video+Festival", category: "Kegiatan" },
  ];

  for (const item of galleryItems) {
    await prisma.galleryItem.create({ data: item });
  }
  console.log("✅ Gallery items created:", galleryItems.length);

  // ─── 8. Map Features ────────────────────────────────────
  const mapFeatures = [
    {
      nameId: "Batas Wilayah Desa Sukamakmur", nameEn: "Sukamakmur Village Boundary",
      type: "BOUNDARY" as const,
      geometry: { type: "Polygon", coordinates: [[[106.830, -6.720], [106.850, -6.720], [106.855, -6.735], [106.845, -6.745], [106.825, -6.740], [106.820, -6.730], [106.830, -6.720]]] },
      isVisible: true,
    },
    {
      nameId: "Kantor Desa Sukamakmur", nameEn: "Sukamakmur Village Office",
      type: "FACILITY" as const, icon: "building",
      geometry: { type: "Point", coordinates: [106.838, -6.730] },
      descriptionId: "Kantor pelayanan pemerintahan desa", descriptionEn: "Village government service office",
      isVisible: true,
    },
    {
      nameId: "SDN 1 Sukamakmur", nameEn: "Sukamakmur Elementary School 1",
      type: "FACILITY" as const, icon: "school",
      geometry: { type: "Point", coordinates: [106.835, -6.728] },
      isVisible: true,
    },
    {
      nameId: "Masjid Al-Ikhlas", nameEn: "Al-Ikhlas Mosque",
      type: "FACILITY" as const, icon: "mosque",
      geometry: { type: "Point", coordinates: [106.840, -6.732] },
      isVisible: true,
    },
    {
      nameId: "Curug Nangka", nameEn: "Curug Nangka Waterfall",
      type: "POI" as const, icon: "waterfall",
      geometry: { type: "Point", coordinates: [106.848, -6.738] },
      descriptionId: "Air terjun setinggi 40 meter, objek wisata utama desa", descriptionEn: "40-meter waterfall, main tourist attraction",
      isVisible: true,
    },
    {
      nameId: "Puskesmas Pembantu", nameEn: "Health Sub-center",
      type: "FACILITY" as const, icon: "hospital",
      geometry: { type: "Point", coordinates: [106.842, -6.726] },
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
