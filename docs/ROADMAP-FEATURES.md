# Roadmap Fitur - Pengembangan Lanjutan

**Status:** Sprint Planning  
**Terakhir Update:** 15 Juni 2026

---

## 🎯 Prioritas Pengembangan

### Phase 1: Dashboard Enhancement & Rich Text (High Priority)
Estimasi: 2-3 sprint

#### 1.1 Dashboard Admin yang Lebih Informatif
**Current State:** Basic dashboard exists  
**Improvement:**

- [ ] **Statistik Real-time**
  - Total pengunjung hari ini/bulan ini/tahun ini
  - Pertumbuhan pengunjung (line chart)
  - Aktifitas terbaru (logs real-time)
  - Top pages yang dikunjungi
  
- [ ] **Quick Stats Cards**
  - Total produk + status (aktif/nonaktif)
  - Total berita + draft vs published
  - Total galeri items + categories
  - User engagement (komentar, likes)
  
- [ ] **Alerts & Notifications**
  - Stock produk menipis (<5 items)
  - Berita/galeri menunggu publikasi
  - Finance anomaly detection
  - System health status
  
- [ ] **Performance Metrics**
  - Page load time monitoring
  - Database health check
  - API response time trends
  - Storage usage (file uploads)

- [ ] **Calendar Widget**
  - Event publik (berita publish dates)
  - Deadline konten
  - Maintenance schedule

**Tech Stack:**
- Recharts untuk charts (sudah exist)
- Next.js Analytics API untuk visitor data
- Server Components untuk real-time stats

---

#### 1.2 Rich Text Editor untuk Berita & Pengumuman
**Current State:** Simple textarea  
**Improvement:**

- [ ] **Integrasi Rich Text Editor**
  - Editor pilihan: TipTap (recommended) atau Slate.js
  - Features:
    - Formatting: Bold, Italic, Underline, Strikethrough
    - Headings (H1-H6) + Paragraphs
    - Lists (ordered, unordered, nested)
    - Blockquotes + Code blocks (syntax highlight)
    - Links (with preview) + Embeds (YouTube, Vimeo)
    - Image upload/gallery picker (drag-drop)
    - Table insert
    - Divider + HR
    - Undo/Redo
    - Character count
    - Collaboration mode (optional future)

- [ ] **Berita Page Updates**
  ```
  src/app/admin/berita/[id]/edit/page.tsx
  - RichTextEditor component untuk konten berita
  - Preview mode real-time
  - Metadata: SEO title, meta description, slug
  - Featured image picker
  - Publish/Draft/Schedule status
  - Author + Edit history
  ```

- [ ] **Pengumuman System** (baru)
  ```
  Models:
  - Announcement (title, content, priority, start_date, end_date, isActive)
  - Display di homepage & sidebar
  - Admin panel untuk CRUD announcements
  ```

- [ ] **Content Versioning**
  - Track edit history (who, when, what changed)
  - Revert ke versi lama
  - Draft auto-save every 30s

**Tech Stack:**
- TipTap Editor (`npm install @tiptap/react @tiptap/starter-kit`)
- Prisma model update untuk rich content storage
- Server action untuk auto-save drafts

---

### Phase 2: SEO Optimization & Server-Side Rendering
Estimasi: 2-3 sprint

#### 2.1 Public Pages - Server-Side Rendering
**Current State:** Client-side React Query  
**Improvement:**

- [ ] **Berita Public Page**
  ```
  src/app/[locale]/berita/page.tsx
  - Convert to Server Component
  - Fetch data di server (Prisma direct query)
  - SSR + ISR (Incremental Static Regeneration) 
    - revalidate: 300 (5 menit)
  - Meta tags (Open Graph, Twitter Card)
  - Structured data (JSON-LD)
  ```

- [ ] **Berita Detail Page**
  ```
  src/app/[locale]/berita/[slug]/page.tsx
  - generateStaticParams untuk popular posts
  - Fallback dynamic rendering untuk new posts
  - Metadata API untuk dynamic OG images
  - Related posts (SSR)
  - Comments section (SSR + client hydration)
  ```

- [ ] **Galeri Public Page**
  ```
  src/app/[locale]/galeri/page.tsx
  - SSR dengan pagination
  - Category filtering (SSR querystring)
  - Image optimization (next/image)
  - Lazy loading dengan IntersectionObserver
  ```

- [ ] **Produk Public Page**
  ```
  src/app/[locale]/produk/page.tsx
  - SSR dengan kategori + search
  - Product card dengan gambar optimized
  - Pagination + sorting
  ```

- [ ] **Profil Desa Page**
  ```
  src/app/[locale]/profil/page.tsx
  - Pilihan full SSR
  - Breadcrumb schema
  - Organization schema (structured data)
  ```

- [ ] **Keuangan Public Page**
  ```
  src/app/[locale]/keuangan/page.tsx
  - SSR untuk transparency page
  - Cache summary data (revalidate: 3600)
  - Structured data untuk financial info
  ```

**SEO Improvements:**

- [ ] **Meta Tags & Structured Data**
  ```typescript
  // generateMetadata() di setiap page
  - Dynamic title/description
  - og:image, og:type, og:url
  - twitter:card, twitter:image
  - JSON-LD (Article, Organization, BreadcrumbList)
  - Canonical URLs
  - Robots meta (noindex untuk draft)
  ```

- [ ] **Sitemap & Robots.txt**
  ```
  public/robots.txt
  - Allow: /id/*, /en/*
  - Disallow: /admin/*, /api/*
  
  app/sitemap.ts (Next.js 14+)
  - Dynamic sitemap dari DB
  - Priority: berita > produk > galeri
  - lastmod dates
  ```

- [ ] **Open Graph Images**
  - Dynamic OG image generation per post
  - Use `next/og` atau Satori
  - Include title, date, author, thumbnail

- [ ] **Performance Optimization**
  ```
  - Image optimization (next/image)
  - Font optimization (next/font)
  - CSS/JS minification (Next.js default)
  - Compression middleware
  ```

- [ ] **Mobile-Friendly Check**
  - Responsive design audit
  - Touch-friendly buttons/links
  - Mobile viewport meta tag

**Tech Stack:**
- Next.js App Router + Server Components
- ISR (Incremental Static Regeneration)
- next/image + Image optimization
- Prisma untuk direct DB queries (no QueryClient needed on server)
- JSON-LD libraries (`schema-org` package optional)

---

### Phase 3: Enhanced Features & Admin UX
Estimasi: 2-3 sprint

#### 3.1 User Management & Roles
- [ ] **Admin Panel Users**
  - List users dengan role (ADMIN, EDITOR, VIEWER)
  - Create/Edit/Delete user
  - Password reset functionality
  - Activity logs per user
  - Two-factor authentication (future)

- [ ] **Permission System**
  - Granular permissions (create, edit, delete, publish)
  - Role-based access control (RBAC)
  - Module-specific permissions

#### 3.2 Content Scheduling
- [ ] **Schedule Publish**
  - Post berita pada jam tertentu
  - Auto-publish + auto-unpublish
  - Cron job untuk scheduled actions

- [ ] **Content Calendar**
  - Visual calendar view
  - Drag-drop untuk reschedule
  - Conflict detection

#### 3.3 Analytics & Reporting
- [ ] **Page Analytics**
  - Track views per page
  - User behavior flow
  - Referral sources
  - Top search keywords

- [ ] **Export Reports**
  - Monthly/yearly finance reports
  - Content performance reports
  - Visitor statistics
  - Format: PDF, Excel, CSV

#### 3.4 Backup & Recovery
- [ ] **Automated Backups**
  - Database backup setiap hari (3.00 AM)
  - File uploads backup
  - Backup retention (7 days)

- [ ] **Recovery Panel**
  - Restore dari backup
  - Selective restore (specific tables)

---

### Phase 4: Community & Engagement (Medium Priority)
Estimasi: 1-2 sprint

#### 4.1 Comments & Ratings
- [ ] **Berita Comments**
  - Nested comments (reply to reply)
  - Comment moderation
  - Spam filtering

- [ ] **Product Ratings**
  - Star ratings (1-5)
  - Review text
  - Helpful votes

#### 4.2 Newsletter & Notifications
- [ ] **Email Newsletter**
  - Subscriber management
  - Email templates
  - Auto-send new berita to subscribers

- [ ] **Push Notifications**
  - Web push untuk update berita
  - Notification preferences
  - Do Not Disturb hours

---

### Phase 5: Performance & DevOps (Low Priority - Nice to Have)
Estimasi: 1-2 sprint

#### 5.1 Caching Strategy
- [ ] **Redis Cache**
  - Cache frequently accessed data
  - Cache invalidation on updates
  - TTL configuration

- [ ] **CDN Integration**
  - Image delivery via CDN
  - Static asset caching
  - Edge caching

#### 5.2 Monitoring & Alerts
- [ ] **Error Tracking**
  - Sentry integration
  - Error alerts via email/Slack
  - Performance monitoring

- [ ] **Uptime Monitoring**
  - Health check endpoints
  - Downtime alerts
  - Status page

#### 5.3 Database Optimization
- [ ] **Query Optimization**
  - Index analysis
  - Slow query logs
  - Query performance monitoring

- [ ] **Database Scaling**
  - Read replicas (future)
  - Connection pooling

---

## 📋 Implementation Checklist

### Phase 1 - Sprint 8-9
- [ ] Dashboard analytics component
- [ ] TipTap editor integration
- [ ] Announcement model + CRUD
- [ ] Rich text storage & retrieval
- [ ] Edit history tracking

### Phase 2 - Sprint 10-11
- [ ] Convert berita to SSR
- [ ] Convert galeri to SSR
- [ ] Meta tags + OG images
- [ ] Sitemap generation
- [ ] Robots.txt configuration
- [ ] JSON-LD structured data

### Phase 3 - Sprint 12-13
- [ ] User management panel
- [ ] Permission system
- [ ] Content scheduler
- [ ] Basic analytics
- [ ] Backup automation

### Phase 4 - Sprint 14-15
- [ ] Comments system
- [ ] Newsletter signup
- [ ] Email notifications

### Phase 5 - Sprint 16+
- [ ] Redis caching
- [ ] Sentry monitoring
- [ ] CDN integration
- [ ] Database optimization

---

## 🛠️ Tech Stack Summary

**Already Available:**
- Next.js 16.2.9 + Turbopack
- Prisma 6.19.3 + MySQL
- TailwindCSS v4
- React Query (TanStack)
- NextAuth.js
- Leaflet + react-leaflet
- Recharts (for charts)

**To Install:**
```bash
# Phase 1: Rich Text Editor
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-image

# Phase 2: SEO & Image Optimization
npm install schema-org  # Optional, for JSON-LD helpers

# Phase 3: Analytics (optional)
npm install @sentry/nextjs  # Error tracking

# Phase 4: Comments (optional)
npm install @prisma/client  # Already have this

# Phase 5: Caching (optional)
npm install redis ioredis  # For Redis caching
```

---

## 📊 Effort Estimation

| Phase | Features | Sprints | Story Points |
|-------|----------|---------|--------------|
| 1 | Dashboard + Rich Text | 2-3 | 40-50 |
| 2 | SSR + SEO | 2-3 | 35-45 |
| 3 | Users + Advanced Admin | 2-3 | 30-40 |
| 4 | Community Features | 1-2 | 20-30 |
| 5 | DevOps & Performance | 1-2 | 25-35 |
| **Total** | | **8-13** | **150-200** |

---

## 🎯 Success Metrics

- [ ] Dashboard engagement: +50% session duration increase
- [ ] SEO: Top 3 pages rank in Google search
- [ ] Performance: Page load < 2s (LCP < 2.5s, FID < 100ms)
- [ ] Content Quality: Rich text adoption 100% untuk new posts
- [ ] User Retention: Email newsletter 30%+ open rate

---

## 📝 Notes

- **Backward Compatibility:** Ensure existing berita/galeri still work after SSR migration
- **Data Migration:** Write script to migrate old textarea content to rich text
- **Testing:** Add E2E tests untuk critical user flows
- **Documentation:** Update docs/ setelah setiap phase

