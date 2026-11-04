# Kurumsal Mimari Kuralları (Architecture Rules)

Bu doküman, kişisel web sitesi projesinin mimari standartlarını, teknoloji yığınını, klasör yapısını ve temel tasarım desenlerini belirler. Geliştirme sürecinde bu kurallara kesinlikle uyulmalıdır.

---

## 1. Mimari Prensipler

1. **Modülerlik ve Ayrışım (Separation of Concerns):**
   - Veri katmanı, iş mantığı (business logic) ve sunum katmanı (UI) birbirinden izole edilmelidir.
   - UI bileşenleri yalnızca görselleştirme ve kullanıcı etkileşiminden sorumlu olmalıdır.

2. **Server-First Yaklaşımı (RSC - React Server Components):**
   - Varsayılan olarak tüm bileşenler Server Component olmalıdır.
   - Yalnızca tarayıcı API'leri (`localStorage`, `window`), React hook'ları (`useState`, `useEffect`) veya event dinleyicileri gerektiren uç bileşenlerde `'use client'` direktifi kullanılmalıdır.
   - Client bileşenleri ağacın mümkün olduğunca en uç noktalarında tutulmalıdır (Client leaf pattern).

3. **Statik & Dinamik Render Dengesi:**
   - Sayfalar varsayılan olarak SSG (Static Site Generation) veya ISR (Incremental Static Regeneration) ile önceden üretilmelidir.
   - Blog ve proje içerikleri build zamanında derlenmeli, sıfır çalışma zamanı (zero-runtime) gecikmesi hedeflenmelidir.

---

## 2. Teknoloji Yığını (Tech Stack)

| Katman | Teknoloji / Kütüphane | Gerekçe / Standart |
| :--- | :--- | :--- |
| **Framework** | Next.js (App Router) | SEO, RSC, hibrit render ve kurumsal standart |
| **Dil** | TypeScript (Strict Mode) | %100 tip güvenliği, sıfır `any` |
| **Stil / Tasarım** | Tailwind CSS + CSS Variables | Hızlı stil oluşturma, dinamik tema desteği |
| **UI Primitives** | Radix UI / Shadcn UI | Tam erişilebilir (WAI-ARIA) headless bileşenler |
| **İkonlar** | Lucide React | Tutarlı, modern, ağaç sallama (tree-shaking) dostu |
| **Animasyon** | Motion (Framer Motion) / CSS Keyframes | Akıcı, 60fps mikro etkileşimler |
| **İçerik (MDX)** | Velite veya Contentlayer2 | Tip güvenli markdown/MDX işleme |
| **Form & Validasyon** | React Hook Form + Zod | Hafif form yönetimi ve şema bazlı doğrulama |
| **SEO & Meta** | Next.js Metadata API + JSON-LD | Arama motorları ve sosyal paylaşımlar için zengin veri |

---

## 3. Klasör ve Modül Mimarisi

```text
src/
├── app/                      # Next.js App Router (Sayfalar, layout'lar, rotalar)
│   ├── (site)/               # Ana site rotaları
│   │   ├── about/
│   │   ├── projects/
│   │   │   └── [slug]/
│   │   ├── blog/
│   │   │   └── [slug]/
│   │   ├── contact/
│   │   ├── layout.tsx        # Ana layout (Navbar, Footer, Providers)
│   │   └── page.tsx          # Anasayfa
│   ├── api/                  # API rotaları (Örn: contact form, newsletter)
│   ├── robots.ts             # SEO robots.txt
│   ├── sitemap.ts            # Dinamik XML sitemap
│   └── not-found.tsx         # Özel 404 sayfası
├── components/
│   ├── common/               # Genel bileşenler (navbar, footer, theme-toggle)
│   ├── sections/             # Sayfa bölümleri (hero, experience, tech-stack)
│   ├── ui/                   # Temel UI primitifleri (button, dialog, card, badge)
│   └── mdx/                  # MDX özel render bileşenleri (code-block, callout)
├── content/                  # Statik içerikler (Markdown / MDX)
│   ├── projects/             # Portföy / Proje vaka analizleri
│   └── blog/                 # Teknik makaleler ve yazılar
├── config/                   # Proje konfigürasyonları (site metadata, nav links)
├── hooks/                    # Tekrar kullanılabilir özel React hook'ları
├── lib/                      # Yardımcı fonksiyonlar, kütüphane başlatıcıları (utils.ts)
├── styles/                   # Global CSS, Tailwind tanımlamaları, font ayarları
└── types/                    # Genel TypeScript tipleri ve arayüzler
```

---

## 4. Durum Yönetimi (State Management)

1. **URL-First State:**
   - Filtreler, arama terimleri ve sayfalama gibi durumlar her zaman URL parametrelerinde (`searchParams`) tutulmalıdır.
   - Böylece sayfalar paylaşılabilir, yer işaretlerine eklenebilir ve sunucu tarafında render edilebilir olur.

2. **Lokal UI Durumu:**
   - Modal açık/kapalı, mobil menü gibi durumlar için React'in standart `useState` veya `useReducer` mekanizması kullanılmalıdır.

3. **Global Durum:**
   - Yalnızca Tema (Karanlık/Aydınlık) ve bildirimler (Toaster) gibi evrensel ihtiyaçlar için Context API kullanılmalı; gereksiz ağır kütüphanelerden (Redux vb.) kaçınılmalıdır.

---

## 5. Performans ve Core Web Vitals (CWV)

- **LCP (Largest Contentful Paint):** `< 2.0s`
  - Hero görsellerinde `priority` bayrağı kullanılmalı.
  - Yeni nesil görsel formatları (WebP, AVIF) zorunlu tutulmalıdır (`next/image`).
- **INP (Interaction to Next Paint):** `< 150ms`
  - Ağır JavaScript yürütmeleri azaltılmalı, RSC kullanılarak istemciye minimum JS gönderilmelidir.
- **CLS (Cumulative Layout Shift):** `0.0`
  - Tüm görsel ve dinamik elementlerde genişlik/yükseklik veya en-boy oranı (`aspect-ratio`) rezerve edilmelidir.
  - Font yüklemelerinde `next/font` kullanılarak FOUT (Flash of Unstyled Text) önlenmelidir.

---

## 6. Güvenlik ve Dayanıklılık Standartları

1. **Güvenlik Başlıkları (Security Headers):**
   - `next.config.mjs` veya middleware üzerinde CSP (Content Security Policy), HSTS, X-Frame-Options ve X-Content-Type-Options aktif edilmelidir.
2. **Form Doğrulama ve Sanitization:**
   - Tüm kullanıcı girdileri sunucu tarafında Zod şeması ile doğrulanmalı ve XSS saldırılarına karşı temizlenmelidir.
3. **Rate Limiting:**
   - İletişim formu ve API uç noktalarında IP tabanlı sınırlandırma uygulanmalıdır (Upstash Redis veya In-memory token bucket).

