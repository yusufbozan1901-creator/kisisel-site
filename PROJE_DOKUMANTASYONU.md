# Yusuf Bozan Kişisel Web Sitesi — Mimari, Tasarım ve Geliştirme Dokümantasyonu (A'dan Z'ye)

Bu doküman, Yusuf Bozan için geliştirilen modern, yüksek performanslı, minimalist editoryal kişisel web sitesinin temel felsefesini, teknik mimarisini, klasör yapısını, veri motorlarını, Pages CMS entegrasyonunu ve bugüne kadar hayata geçirilen tüm bileşenleri en ince teknik ayrıntısına kadar açıklar.

---

## 1. Proje Vizyonu ve Felsefesi (Core Philosophy)

### 1.1. Dijital Bahçe (Digital Garden) & Bağımsız Web (IndieWeb)
Bu platform, geleneksel kurumsal portföylerden veya algoritmaların dikte ettiği sosyal medya akışlarından farklı olarak, **"bağımsız bir kişisel not defteri, düşünce akışı ve dijital kültür arşivi"** olarak tasarlanmıştır.
- **İçerik Mülkiyeti (Data Sovereignty):** Hiçbir harici bulut veritabanına (Firebase, Supabase, SQL vb.) bağımlı değildir. Tüm blog yazıları, anlık düşünceler, raf arşivi (film, dizi, kitap), videolar ve profil bilgileri projenin kendi Git deposunda saf Markdown (`.md`) ve JSON dosyaları olarak saklanır.
- **Sıfır Gürültü, Yüksek Okuma Ritmi:** Dikkat dağıtıcı banner'lar, reklamlar, açılır pop-up'lar, gereksiz renk cümbüşü veya süslü gösteriş rozetleri bulunmaz. Saf siyah (`#000000`), derin antrasit (`#0a0a0a`), kart zeminleri (`#141414`), sınır çizgileri (`#1F1F1F`) ve nötr gri/beyaz tonlarından oluşan yüksek kontrastlı monokrom bir palet kullanılır.
- **Tipografi ve Ergonomi Önceliği:** Kitap satır yüksekliği (`line-height: 1.85`), ferah harf aralıkları (`letter-spacing: -0.01em`) ve gözü yormayan editoryal tipografi (`.prose-editorial`) ile okuyucuya sakin bir deneyim sunulur.

---

## 2. Teknoloji Yığını ve Mimari Standartlar (Tech Stack)

| Katman | Teknoloji / Kütüphane | Mimari Gerekçe ve Standart |
| :--- | :--- | :--- |
| **Framework** | **Next.js 16 (App Router)** | React Server Components (RSC) öncelikli mimari, hibrit render, SSG (Static Site Generation), Route Handlers |
| **Dil** | **TypeScript (Strict Mode)** | %100 tip güvenliği, sıfır `any`, katı interface ve union tipleri, `readonly` değişmezlik |
| **Stil / Arayüz** | **Tailwind CSS v3 + CSS Variables** | Semantik renk token'ları (`bg-background`, `text-foreground`, `border-border`), 60fps akıcı mikro etkileşimler |
| **İçerik & Ayrıştırma** | **gray-matter + marked (v18)** | YAML Frontmatter ayrıştırma, GFM (GitHub Flavored Markdown) derleyicisi, özel AST başlık işleyicisi |
| **Veri Şeması & Güvenlik**| **Zod (`src/lib/schemas.ts`)** | Derleme zamanında (build-time) katı frontmatter ve JSON şema doğrulaması; eksik veri durumunda build kırılmaz, güvenli varsayılana düşer |
| **UI Primitifleri** | **Radix UI (`@radix-ui/react-dialog`)** | WAI-ARIA standartlarında tam erişilebilir, klavye uyumlu headless modal/çekmece primitifleri |
| **CMS (Yönetim Paneli)** | **Pages CMS (`.pages.yml`)** | Git tabanlı, sunucusuz (serverless), commit bazlı headless içerik yönetim arayüzü |
| **Arama (Command Palette)**| **⌘K Komut Paleti & /api/search** | Makaleler, anlık düşünceler, raf arşivi ve videolar üzerinde anlık tam metin arama |
| **PWA (Web Uygulaması)** | **Web App Manifest + Custom Prompt** | Masaüstü ve mobilde uygulama olarak yüklenebilirlik (`standalone`), YB maskable ikonlar |
| **Form & Güvenlik** | **Web3Forms API + Zod + /api/contact Proxy** | Gizli iletişim formu; e-posta ve Web3Forms API anahtarı istemciye sızdırılmaz (`WEB3FORMS_ACCESS_KEY`), `/api/contact` üzerinden güvenli sunucu tarafı iletim ve sanitizasyon sağlanır |
| **Birim Testleri** | **Vitest (`src/lib/__tests__/`)** | Kritik yardımcı fonksiyonlar (`turkishSlugify`, duplicate TOC başlıkları, `extractYouTubeId`, `resolveTurkeyTimestamp`) için %100 tip güvenli ve hızlı birim testleri |
| **SEO & Meta** | **Next.js Metadata API + @vercel/og** | Otomatik dinamik Open Graph kartları, JSON-LD, dinamik XML sitemap ve robots.txt |
| **RSS & Sindikasyon** | **Route Handlers (`/rss.xml` & `/feed.xml`)** | Standart RSS 2.0 XML akışı; hem yazıları hem anlık düşünceleri kronolojik birleştiren akış |
| **Performans İzleme**| **@vercel/analytics** | Çerezsiz (cookie-less), GDPR uyumlu, sıfır yük getiren ziyaretçi ve performans metriği |

---

## 3. Sistem Mimarisi ve Veri Akışı

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        İÇERİK YÖNETİMİ (PAGES CMS)                     │
│  app.pagescms.org  ───>  GitHub API  ───>  Git Commit (.md / .json)    │
│  (Yazılar, Akış, Now, Rafım, Videolar, Profil Yönetimi)                │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ (git push / webhook)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     DERLEME ZAMANI (BUILD TIME - SSG)                  │
│                                                                        │
│   yazilar/*.md ──────> gray-matter ──> marked v18 ──> Başlık ID (TOC)  │
│   akis/*.md    ──────> date-resolver ──> Slugify  ──> Çapa Linkleri    │
│   raf/*.md     ──────> Zod Validation ─> Poster, Tür, Durum ve Detay   │
│   videolar/*.md ─────> extractYouTubeId ─> resolveTurkishDate ─> Lite  │
│   now.json     ──────> NowStateSchema ─> Adaptif 3'lü Bento Şeridi     │
│   profil.json  ──────> profile.ts ────> marked    ──> Biyografi HTML   │
│                                                                        │
│   Next.js 16 (App Router)  ──>  Statik HTML + JSON (18 Sayfa / 0ms)    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  SUNUM KATMANI (REACT SERVER COMPONENTS)                │
│                                                                        │
│   [Server Components - Varsayılan ve Sıfır JS Yükü]                    │
│   ├── layout.tsx (Kök düzen, Navbar, Footer, PWA, SEO meta)            │
│   ├── page.tsx (Hero, Now Bento, Akış, Son Yazılar, Rafım, Videolar)   │
│   ├── blog/page.tsx & blog/[slug]/page.tsx (Makale okuma, Çok sütun)   │
│   ├── akis/page.tsx (Zaman çizelgesi, Sticky etiket/ay yan paneli)     │
│   ├── rafim/page.tsx (Kültür arşivi, Tür/Durum sekmeleri, Sıralama)    │
│   ├── videolar/page.tsx (Lite YouTube Embed video koleksiyonu)          │
│   └── about/page.tsx (Biyografi, Avatar, Dinamik Konum, Sosyal Medya)  │
│                                                                        │
│   [Client Leaf Components - İzole Edilmiş Uç Etkileşimler]             │
│   ├── CommandPalette & SearchButton (⌘K arama penceresi)               │
│   ├── ShelfShowcase & ShelfGridClient (Radix Dialog eser detay modalı) │
│   ├── LiteYouTubeEmbed (Tıklanınca yüklenen hafif YouTube oynatıcısı)  │
│   ├── TableOfContents (IntersectionObserver aktif başlık takibi)       │
│   ├── ThoughtPermalink (Çapa linki kopyalama & replaceState)          │
│   ├── AudioPlayer (15 sn sarma, hız seçici, monokrom çubuk)            │
│   ├── ImageLightbox (Tam ekran resim görüntüleme)                      │
│   ├── ShareModal & ShareButton (Sosyal medya paylaşım menüsü)          │
│   ├── InstallPrompt (PWA yükleme bildirimi, localStorage hafızası)     │
│   └── ContactForm (React Hook Form + Zod doğrulaması)                  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Proje Dizin Yapısı (Project Directory Tree)

```text
c:\Users\Yusuf\Desktop\SİTE\
├── .pages.yml                   # Pages CMS resmi koleksiyon ve alan şeması
├── package.json                 # Bağımlılıklar, NPM scriptleri ve proje tanımları
├── tsconfig.json                # TypeScript katı mod (strict: true) yapılandırması
├── tailwind.config.ts           # Tailwind CSS tema, font ve eklenti ayarları
├── next.config.mjs              # Next.js derleme ve güvenlik başlıkları konfigürasyonu
│
├── public/                      # Statik medya ve genel dosyalar
│   ├── gorseller/               # CMS medya havuzu (afişler, kapaklar, avatarlar, akış resimleri)
│   ├── sesler/                  # Ses kayıtları ve sesli düşünceler havuzu
│   ├── manifest.json            # PWA web uygulama manifestosu
│   ├── icon.svg                 # Vektörel YB monogram ikonu
│   ├── icon-192.png             # 192x192 PWA uygulama ikonu
│   ├── icon-512.png             # 512x512 PWA yüksek çözünürlüklü uygulama ikonu
│   └── googlec0182533b61ea1a1.html # Google Search Console mülk doğrulama dosyası
│
├── yazilar/                     # Blog makalelerinin bağımsız Markdown (.md) dosyaları
│   └── kisa-yazi.md             # Örnek editoryal makale
│
├── akis/                        # Anlık düşünce (mikro-not) Markdown (.md) dosyaları
│   ├── 2026-11-05.md
│   ├── 2026-11-06-00-10.md
│   ├── 2026-11-06-17-10.md
│   ├── 2026-11-16-03-17.md
│   └── ...                      # Zaman damgalı düşünce notları
│
├── raf/                         # Rafım (Film, Dizi, Kitap) Markdown (.md) dosyaları
│   └── ...                      # 2:3 afişli kültür inceleme kartları
│
├── videolar/                    # Video arşiv Markdown (.md) dosyaları
│   └── ...                      # YouTube bağlantılı video kayıtları
│
└── src/
    ├── app/                     # Next.js App Router sayfaları ve API rotaları
    │   ├── layout.tsx           # Ana layout (Navbar, Footer, PWA InstallPrompt, SEO Meta)
    │   ├── page.tsx             # Ana sayfa (Hero, Now Bento, Akış, Son Yazılar, Rafım, Videolar)
    │   ├── icon.tsx             # Dinamik monogram favicon üreticisi (YB)
    │   ├── opengraph-image.tsx  # Ana sayfa dinamik Open Graph kartı
    │   ├── robots.ts            # Dinamik robots.txt
    │   ├── sitemap.ts           # Dinamik XML sitemap
    │   ├── not-found.tsx        # Özel minimalist 404 sayfası
    │   ├── error.tsx            # Global rota hata yakalama sınırı (Error Boundary)
    │   ├── global-error.tsx     # Kök layout hata yakalama sınırı
    │   │
    │   ├── blog/                # Blog listesi ve detay rotaları
    │   │   ├── page.tsx         # Makale listeleme sayfası
    │   │   └── [slug]/          # Dinamik makale okuma rotası
    │   │       ├── page.tsx     # Çok sütunlu editoryal okuma düzeni (TOC + İçerik)
    │   │       └── opengraph-image.tsx # Yazıya özel otomatik OG kartı üreticisi
    │   │
    │   ├── akis/                # Akış (Mikro-Blog / Zaman Çizelgesi) sayfası
    │   │   └── page.tsx         # Notlar akışı ve sağ tarafta yapışkan arşiv paneli
    │   │
    │   ├── rafim/               # Rafım (Kültür & Tüketim Arşivi) sayfası
    │   │   └── page.tsx         # Dizi, Film ve Kitap arşivi, filtreler ve sıralama
    │   │
    │   ├── videolar/            # Videolarım sayfası
    │   │   └── page.tsx         # Lite YouTube embed tabanlı kişisel video galerisi
    │   │
    │   ├── about/               # Hakkımda sayfası
    │   │   └── page.tsx         # Biyografi, avatar, konum ve sosyal medya kartı
    │   │
    │   ├── contact/             # İletişim sayfası
    │   │   └── page.tsx         # Güvenli iletişim formu
    │   │
    │   ├── api/                 # API Uç Noktaları (Route Handlers)
    │   │   ├── contact/route.ts # Web3Forms güvenli e-posta proxy uç noktası
    │   │   └── search/route.ts  # Tüm koleksiyonları kapsayan statik/dinamik arama API'si
    │   │
    │   ├── rss.xml/route.ts     # Salt blog makaleleri için RSS 2.0 XML akışı
    │   └── feed.xml/route.ts    # Birleşik (Makaleler + Akış Notları) RSS 2.0 XML akışı
    │
    ├── content/                 # Site genel ayar ve durum verileri
    │   ├── profil.json          # Başlık, konum, avatar, biyografi ve sosyal medya verisi
    │   └── now.json             # "Şu Sıralar" 3'lü Bento şeridi durum verisi
    │
    ├── components/              # Yeniden kullanılabilir React bileşenleri
    │   ├── common/              # Ortak arayüz bileşenleri
    │   │   ├── navbar.tsx       # Üst navigasyon çubuğu (YB monogram, menü, arama, tema, iletişim)
    │   │   ├── footer.tsx       # Altbilgi (Telif, navigasyon, RSS bağlantısı)
    │   │   ├── command-palette.tsx # ⌘K / Ctrl+K tam metin arama penceresi
    │   │   ├── search-button.tsx # Üst bardaki arama tetikleyici butonu
    │   │   ├── theme-toggle.tsx # Karanlık/Aydınlık tema değiştirici
    │   │   ├── theme-provider.tsx # next-themes tema sağlayıcısı
    │   │   ├── share-modal.tsx  # Yuvarlak ikonlu açılır paylaşım penceresi
    │   │   ├── share-button.tsx # Paylaş butonu tetikleyicisi
    │   │   ├── social-links.tsx # Sosyal medya ikon butonları
    │   │   └── icons.tsx        # Marka SVG ikonları (X, WhatsApp, Telegram vb.)
    │   │
    │   ├── sections/            # Sayfa bölümleri
    │   │   ├── hero-section.tsx # Karşılama başlığı ve alt metin
    │   │   ├── now-bento.tsx    # "Şu Sıralar" 3'lü adaptif Bento şeridi
    │   │   ├── thought-card.tsx # Zaman çizelgesi akış kartı (Rozetler + Permalink)
    │   │   └── blog-list-client.tsx # Canlı arama ve etiket filtrelemeli blog listesi
    │   │
    │   ├── shelf/               # Rafım modülü bileşenleri
    │   │   ├── shelf-grid-client.tsx # /rafim sayfası ızgarası, filtreler, sıralama ve modal
    │   │   └── shelf-showcase.tsx    # Ana sayfa Rafım vitrini ve tıklanınca açılan modal
    │   │
    │   ├── videos/              # Video modülü bileşenleri
    │   │   └── lite-youtube-embed.tsx # Tıklanınca yüklenen hafif YouTube embed oynatıcısı
    │   │
    │   ├── thoughts/            # Akış modülü bileşenleri
    │   │   ├── akis-stream-client.tsx # Akış listesi ve sağ yapışkan arşiv paneli
    │   │   └── thought-permalink.tsx # Not çapa linki kopyalama ve URL replaceState
    │   │
    │   ├── mdx/                 # İçerik zenginleştirme bileşenleri
    │   │   ├── audio-player.tsx # Özel ses çaları (hız, 15sn sarma, zaman çizgisi)
    │   │   ├── image-lightbox.tsx # Tıklanınca tam ekran görsel büyütücü
    │   │   ├── reading-progress-bar.tsx # Sayfa üstü okuma ilerleme çizgisi
    │   │   ├── post-navigation.tsx # Önceki / Sonraki makale geçiş kartları
    │   │   ├── post-content-renderer.tsx # İçerik içi ses ve resimleri dönüştürücü
    │   │   ├── copy-link-button.tsx # Bağlantı kopyalama butonu
    │   │   └── table-of-contents.tsx # Masaüstü sticky / Mobil akordeon İçindekiler Tablosu
    │   │
    │   ├── forms/               # Form bileşenleri
    │   │   └── contact-form.tsx # Zod doğrulamalı iletişim formu
    │   │
    │   ├── pwa/                 # PWA bileşenleri
    │   │   └── install-prompt.tsx # Uygulamayı yükle bildirim kartı
    │   │
    │   └── ui/                  # Temel tasarım primitifleri
    │       ├── button.tsx       # Standart buton primitifi
    │       ├── badge.tsx        # Rozet primitifi
    │       ├── card.tsx         # Kart konteyneri
    │       └── container.tsx    # Responsive sayfa genişlik sınırlayıcısı
    │
    ├── lib/                     # Yardımcı fonksiyonlar, veri motorları ve şemalar
    │   ├── schemas.ts           # Zod derleme zamanı tip ve frontmatter doğrulama şemaları
    │   ├── posts.ts             # Yazı verisi okuma, TOC çıkarma, Türkçe slugify
    │   ├── thoughts.ts          # Akış notları okuma, sezon/bölüm/puan işleme
    │   ├── shelf.ts             # Rafım içeriklerini okuma, tür ve durum dönüştürme
    │   ├── videos.ts            # Video içeriklerini okuma, YouTube ID ayrıştırma
    │   ├── now.ts               # "Şu Sıralar" Bento durumunu okuma ve doğrulama
    │   ├── profile.ts           # Profil, avatar, konum ve aktif sosyal medya ayrıştırıcı
    │   ├── date-resolver.ts     # Türkiye saati ve Git commit zaman damgası çözümleyici
    │   └── utils.ts             # cn() sınıf birleştirici, formatDate()
    │
    ├── styles/                  # Stil tanımları
    │   └── globals.css          # CSS değişkenleri, .prose-editorial, :target vurgusu
    │
    └── config/                  # Proje konfigürasyonları
        └── site.ts              # Site adı, yazar, URL ve navigasyon menü linkleri
```

---

## 5. Çekirdek Sistemler, Modüller ve Algoritmalar (A'dan Z'ye)

### 5.1. "Şu Sıralar" (Now Bento Şeridi) Sistemi — `src/content/now.json` & `now-bento.tsx`
- **Konsept:** Derek Sivers'ın *"Now Page"* felsefesinden ilham alan, ana sayfada Yusuf Bozan'ın o anki zihinsel ve üretken odağını özetleyen 3 kartlı dinamik Bento şerididir.
- **Kart 1 — Üzerinde Çalıştığım (Focus):**
  - Başlık (`title`), açıklama (`description`), durum (`status`) ve son güncelleme zamanı (`updatedAt`).
  - Sağ üst köşesinde yeşil nabız (`animate-pulse`) noktası yer alır.
- **Kart 2 — Şu An Rafta (Shelf):**
  - Birincil Eser: Adı (`itemTitle`), türü (`itemType`), bölüm/sayfa bilgisi (`itemMeta`) ve genel durumu (`status`).
  - İkincil Eser: Varsa ikincil eser adı (`secondaryTitle`), türü (`secondaryType` — örn. *Kitap*), bölüm/sayfa bilgisi (`secondaryMeta`) ve ikincil esere özel durumu (`secondaryStatus`).
  - Her iki eser de aralarında zarif bir ayırıcı çizgi ve monokrom rozetlerle eşit düzende sunulur.
- **Kart 3 — Son Düşünce (Thought):**
  - Vurgulu alıntı metni (`quote`), konu bağlamı (`context`), etiket (`label`) ve tarih alanı (`thoughtDate`).
  - Tarih alanı kartın alt satırında net ve belirgin biçimde listelenir.
- **Adaptif Izgara ve Boş Durum Koruması:**
  - Kartlar `now.json` içinde boş bırakıldığında kullanıcıya boş veya sahte kutular gösterilmez; yalnızca dolu olan kartlar render edilir.
  - Kart sayısına göre ızgara otomatik uyarlanır (`1 kart: ortalanmış tekil kart`, `2 kart: md:grid-cols-2`, `3 kart: md:grid-cols-3`).
  - Üç kart da boş bırakılmışsa Bento şeridi DOM'da sıfır alan kaplayarak tamamen gizlenir.
  - Kartların üst başlıkları (`ÜZERİNDE ÇALIŞTIĞIM`, `ŞU AN RAFTA`, `SON DÜŞÜNCE`) okuma ergonomisi için `text-xs` font-mono formatında tasarlanmıştır.

---

### 5.2. Rafım (Kültür & Tüketim Arşivi) — `raf/*.md` & `src/lib/shelf.ts`
- **Konsept:** Film, Dizi ve Kitap tüketimlerinin notlar, alıntılar ve kişisel puanlamalarla kaydedildiği yaşayan kişisel kültür rafıdır.
- **Kart Mimarisi:**
  - 2:3 dikey afiş oranı (`aspect-[2/3]`) ile sinematik/kitap kapağı standardı.
  - Sol üstte sezon/bölüm rozeti (`badge`), sağ üstte durum rozeti (`status`: *İzleniyor, Okunuyor, Tamamlandı, Başyapıt*), sağ altta yıldızlı puan rozeti (`rating`: örn. *★ 9.4*).
  - Sabit kart yükseklikleri ve `line-clamp-2` başlık/açıklama sınırlandırmasıyla CLS (düzen kayması) kesinlikle sıfırdır (`0.0`).
- **Detaylı İnceleme Penceresi (Radix UI Dialog):**
  - Hem `/rafim` sayfasında hem de ana sayfadaki vitrinde afiş kartına tıklandığında sayfadan ayrılmadan tam ekran detay modalı açılır.
  - Modal içinde eserin tam başlığı, kategorileri, çıkış yılı, durum ve ilerleme rozetleri ile Markdown ile yazılmış detaylı kişisel inceleme metni (`htmlContent`) yer alır.
- **Canlı Filtreleme ve Sıralama:**
  - `/rafim` sayfasında anlık başlık/kategori araması.
  - Tür sekmeleri (*Tümü, Diziler, Filmler, Kitaplar*).
  - Koyu temayla uyumlu sıralama açılır kutusu (*En Yeni, En Yüksek Puan, Yıla Göre*).

---

### 5.3. Videolarım (Kişisel & Liste Dışı YouTube Arşivi) — `videolar/*.md` & `src/lib/videos.ts`
- **Konsept:** Ekran kayıtları, arayüz prototipleri ve liste dışı YouTube videolarının saklandığı kişisel video galerisidir.
- **Lite YouTube Embed (`src/components/videos/lite-youtube-embed.tsx`):**
  - Sayfa ilk açıldığında ağır YouTube `<iframe>` kodları indirilmez; yalnızca video afişi (`hqdefault.jpg`) ve özel bir SVG oynat butonu yüklenir. Bu sayede LCP (Largest Contentful Paint) süresinde hiçbir kayıp yaşanmaz.
  - Oynat butonuna tıklandığında veya klavyeden `Enter` basıldığında `youtube-nocookie.com` üzerinden güvenli ve gizlilik odaklı oynatıcı anında başlar.
- **YouTube ID Ayrıştırma Algoritması (`extractYouTubeId`):**
  - Pages CMS'ten girilen tam URL'ler (`https://www.youtube.com/watch?v=...`, `https://youtu.be/...`, `https://www.youtube.com/shorts/...`, embed linkleri) veya 11 haneli yalın video ID'leri regex ile otomatik ayrıştırılır.
- **Açıklama ve Tarih Görünürlüğü:**
  - Video kartlarının alt kısmında Pages CMS'ten girilen zengin açıklama (`description`) metni gösterilir.
  - Tarih ayrıştırması `resolveTurkishDate` üzerinden yapılarak UTC saat dilimi kaymaları engellenir.
  - Sadeleşme ilkesi doğrultusunda kartların sol altındaki gereksiz "YouTube'da Aç" linkleri ve çözünürlük rozetleri kaldırılmıştır.

---

### 5.4. Akış (Timeline / Mikro-Blog) — `akis/*.md` & `src/lib/thoughts.ts`
- **Konsept:** Twitter/X veya Threads benzeri, tarih ve dakika bazlı mikro-düşüncelerin, aforizmaların, kod kesitlerinin ve sesli düşüncelerin paylaşıldığı dikey zaman çizelgesidir.
- **Deterministik Slug ve Çapa Bağlantı (`ThoughtPermalink`):**
  - Her not `{year}-{month}-{day}-{hour}-{minute}` yapısıyla benzersiz bir kimliğe sahiptir.
  - Paylaş/çapa ikonuna tıklandığında tam bağlantı panoya kopyalanır ve sayfa yenilenmeden `window.history.replaceState` ile URL güncellenir.
  - CSS `:target` sözde sınıfı sayesinde, çapa linkle gelinen not sayfada otomatik olarak çerçeve vurgusu ve zaman çizelgesi noktasında ölçeklenme (`scale-125`) kazanır.
- **Dizi/Film Notu Rozetleri:**
  - Pages CMS'ten girilen `season` ve `episode` alanları `S01 • B04` veya `S02` formatında; `rating` alanı ise minik yıldız ikonuyla (`★ 8.5/10`) gösterilir.
- **Sadeleştirilmiş Akış ve Sağ Yapışkan Panel:**
  - Sayfa üstündeki gereksiz "Tüm Notlar (11)" sekme çubuğu kaldırılmış, notlar doğrudan listelenir hale getirilmiştir.
  - Masaüstünde sağ tarafta asılı kalan (Sticky Sidebar) yan panelde **Konu Etiketleri** (tıklanınca ilgili etiketi filtreler) ve **Zaman Arşivi** (ay bazlı filtreleme) yer alır.

---

### 5.5. Yazılar Motoru ve Otomatik İçindekiler Tablosu (TOC) — `yazilar/*.md` & `src/lib/posts.ts`
- **Markdown Derlemesi:** Makale içindeki tüm H2 (`##`) ve H3 (`###`) başlıkları derleme anında taranır.
- **Türkçe Slugify Fonksiyonu (`turkishSlugify`):**
  - `ç->c`, `ğ->g`, `ı->i`, `ö->o`, `ş->s`, `ü->u`, `İ->i`, `I->i` dönüşümleri eksiksiz yapılır.
  - Noktalama işaretleri temizlenir, boşluklar tireye (`-`) çevrilir.
  - Aynı makalede birden fazla aynı başlık geçerse otomatik sayaç devreye girer (`giris`, `giris-1`).
- **İki Sütunlu Okuma Düzeni:**
  - Masaüstünde makale gövdesinin sağında `sticky top-28` pozisyonunda İçindekiler Tablosu yer alır. `IntersectionObserver` ile kullanıcının o an okuduğu başlık menüde gerçek zamanlı vurgulanır.
  - Mobilde makale başlığının hemen altında `<details>` akordeon kutusu olarak sunulur.
  - Sayfa üstünde okuma ilerleme çubuğu (`reading-progress-bar.tsx`), altında ise Önceki / Sonraki makale geçiş kartları (`post-navigation.tsx`) bulunur.

---

### 5.6. Profil, Hakkımda ve Dinamik Konum — `src/content/profil.json` & `/about`
- **İsteğe Bağlı Konum Alanı (`location`):**
  - Sabit kodlanmış konum veya "müsait" ibareleri kaldırılmıştır.
  - Pages CMS üzerinden `location` doldurulduğunda sol kartta MapPin ikonuyla gösterilir; boş bırakıldığında DOM'da hiçbir boşluk kalmaz.
- **Sadeleştirilmiş Editoryal Görünüm:**
  - Sağ sütundaki uydurma odak alanları ve araç kutuları temizlenmiştir. Yalnızca sayfa ana başlığı ve `profil.json` içinden gelen zengin biyografi metni sunulur.
- **Sosyal Medya Entegrasyonu:**
  - X, Instagram, YouTube, Facebook, GitHub, LinkedIn ve sınırsız özel linkler (`customLinks`). Yalnızca `active: true` olanlar render edilir.

---

### 5.7. Global Arama Sistemi (Command Palette / ⌘K) — `src/components/common/command-palette.tsx`
- **Erişim:** Üst bardaki büyüteç ikonu veya klavyeden `⌘K` / `Ctrl+K` kısayolu ile anında açılır.
- **Kapsam:** Sitedeki tüm makaleler, akış notları, raf eserleri ve videolar üzerinde anlık tam metin arama yapar.
- Klavye ok tuşları (`↑`, `↓`) ile seçim yapılabilir, `Enter` ile ilgili içeriğe doğrudan gidilir.

---

### 5.8. Saat Dilimi ve Tarih Çözümleme — `src/lib/date-resolver.ts`
- **Sorun:** Pages CMS gibi web tabanlı editörler tarih ve saati yerel olarak (örneğin `2026-11-17T00:21`) kaydeder. Sunucularda Node.js `new Date()` bunu UTC kabul ettiğinde Türkiye saat dilimi (+3 saat) bir kez daha eklenerek saat `03:21` olarak kayıyordu.
- **Çözüm Algoritması (`resolveTurkeyTimestamp` / `resolveTurkishDate`):**
  1. Frontmatter içindeki string yerel formatındaysa (`YYYY-MM-DDTHH:mm`), kullanıcının seçtiği yerel saat doğrudan korunur ve sonuna `+03:00` eklenerek ikinci kez saat kayması önlenir.
  2. Saat girilmemişse veya `00:00` olarak gelmişse, sistem o dosyanın Git commit zaman damgasını (`git log -1 --format=%cI`) veya dosya oluşturulma zamanını `Europe/Istanbul` saat dilimine göre çekip gerçek paylaşım saatini üretir.

---

### 5.9. Zod Derleme Zamanı Şema Doğrulaması — `src/lib/schemas.ts`
- Derleme sırasında tüm veri kaynakları katı Zod şemalarından geçirilir:
  - `PostFrontmatterSchema`: Blog makaleleri
  - `ThoughtFrontmatterSchema`: Akış notları ve `mediaDetails`
  - `NowStateSchema`: "Şu Sıralar" Bento kartları
  - `ShelfItemSchema`: Rafım film, dizi ve kitap kayıtları
  - `VideoItemSchema`: Video kayıtları
  - `ProfileSchema`: Profil, konum ve sosyal medya
- Hatalı veya eksik bir alan girilse dahi derleme kırılmaz (`safeParse`), sistem güvenli varsayılan değerleri devreye sokarak yayının kesintisiz sürmesini garanti eder.

---

### 5.10. Özel Ses Oynatıcısı, Görsel Lightbox, Paylaşım Modalı ve PWA
- **Ses Oynatıcısı (`AudioPlayer`):** 15 saniye ileri/geri sarma, hız seçici (1x, 1.25x, 1.5x, 2x) ve sürüklenip tıklanabilir monokrom zaman çubuğu.
- **Görsel Lightbox (`ImageLightbox`):** Yazı ve akış görsellerine tıklandığında tam ekran görüntüleme, `ESC` veya dışarı tıklama ile kapatma.
- **Paylaşım Modalı (`ShareModal`):** Tek tıkla bağlantı kopyalama ve WhatsApp, X, Telegram, LinkedIn, Facebook, Reddit üzerinde orijinal marka renklerinde dairesel butonlarla doğrudan paylaşım.
- **PWA (`InstallPrompt`):** Masaüstü ve mobil cihazlarda tek tıkla ana ekrana eklenebilen hafif web uygulaması; tercih `localStorage` üzerinde saklanır.
- **Gizli İletişim Formu (`ContactForm`):** E-posta adresi açıkta görünmez, Web3Forms API üzerinden sunucu taraflı proxy ile iletilir.

---

## 6. Pages CMS (`.pages.yml`) Yapılandırması ve Şeması

Pages CMS (`app.pagescms.org`), doğrudan GitHub deposuyla konuşan modern bir headless CMS'tir. Yapılan her değişiklik depoya doğrudan Git commit'i olarak işlenir ve Vercel anında canlı siteyi günceller.

### Koleksiyonlar ve Alan Gruplamaları:
1. **Yazılar (`yazilar/`):**
   - `title`: Başlık (Zorunlu)
   - `date`: Yayın Tarihi ve Saati (Zorunlu)
   - `summary`: Kısa Özet
   - `image`: Kapak Görseli (`public/gorseller` havuzundan)
   - `audio`: Ses Dosyası (Podcast / seslendirme)
   - `body`: İçerik (Zengin metin / Markdown)
   *(Gereksiz karmaşıklığı önlemek için etiketler CMS formundan kaldırılmıştır).*

2. **Akış (`akis/`):**
   - `body`: Düşünce Metni (Zorunlu)
   - `date`: Tarih ve Saat (`time: true` ile dakika hassasiyetinde)
   - `mediaDetails`: **Dizi / Film Notu (İsteğe Bağlı)** açılır-kapanır nesne kutusu:
     - `season`: Sezon No
     - `episode`: Bölüm No
     - `rating`: Puan
   - `image`: Görsel (İsteğe bağlı)
   - `audio`: Ses Notu (İsteğe bağlı)
   - *Dosya Adı Deseni:* `{year}-{month}-{day}-{hour}-{minute}.md`

3. **Şu Sıralar (`src/content/now.json`):**
   - `focus`: **1. Üzerinde Çalıştığım (Odak):** `title`, `description`, `status`, `updatedAt`
   - `shelf`: **2. Şu An Rafta:**
     - Birincil Eser: `itemTitle`, `itemType`, `itemMeta`, `status`
     - İkincil Eser: `secondaryTitle`, `secondaryType`, `secondaryMeta`, `secondaryStatus`
   - `thought`: **3. Son Düşünce:** `quote`, `context`, `label`, `thoughtDate`

4. **Rafım (`raf/`):**
   - `title`: Eser Başlığı (Zorunlu)
   - `type`: Tür (*Film, Dizi, Kitap* açılır seçimi)
   - `category`: Kategori / Türler (*Bilim Kurgu, Dram, Gerilim, Korku, Romantik, Suç, Felsefe, Tarih, Klasik, Biyografi, Belgesel, Animasyon* — çoklu seçim)
   - `rating`: Puan (örn. ★ 9.4)
   - `status`: Durum (*İzleniyor, Okunuyor, Tamamlandı, Başyapıt* açılır seçimi)
   - `details`: **Bölüm / Sayfa Detayı (İsteğe Bağlı)** açılır-kapanır nesne kutusu:
     - `badge`: Rozet / Sezon-Bölüm (örn. S02 • B04)
     - `progress`: İlerleme (örn. s. 84 / 176)
   - `poster`: Afiş Görseli
   - `year`: Çıkış Yılı
   - `updatedAt`: Son Durum Zamanı (örn. Dün)
   - `body`: Kişisel Not & İnceleme (Zengin metin)

5. **Videolar (`videolar/`):**
   - `title`: Video Başlığı (Zorunlu)
   - `youtubeId`: YouTube Linki veya ID'si (Zorunlu)
   - `date`: Tarih ve Saat
   - `body`: Açıklama (İsteğe bağlı zengin metin)
   *(Süre, liste dışı switch'i ve çözünürlük alanları temizlenmiştir).*

6. **Hakkımda & Sosyal Medya (`src/content/profil.json`):**
   - `title`: Hakkımda Başlığı
   - `location`: Şehir / Konum (İsteğe bağlı; doldurulursa görünür)
   - `avatar`: Profil Fotoğrafı
   - `bio`: Biyografi Metni
   - `social`: **Sosyal Medya Bağlantıları (Tıkla Aç)** açılır-kapanır nesne kutusu:
     - `twitter`, `instagram`, `youtube`, `facebook`, `github`, `linkedin`
   - `customLinks`: Özel Platform Bağlantıları

---

## 7. Kalite, Performans, Test ve SEO Göstergeleri

1. **Core Web Vitals:**
   - **LCP (Largest Contentful Paint):** `< 2.0s` (Ölçülebilir hedef: Sayfalar SSG olarak derlenir; görseller `next/image` ile responsive `sizes` ve `priority` desteğiyle yüklenir; YouTube videolarında Lite Embed kullanılır).
   - **CLS (Cumulative Layout Shift):** `0.0` (Tüm afiş, görsel ve dinamik kutularda en-boy oranları `aspect-[2/3]` ve `aspect-video` ile rezerve edilmiştir).
   - **INP (Interaction to Next Paint):** `< 50ms` (Gereksiz ağır istemci kütüphaneleri elenmiş, yalnızca uç bileşenlerde `'use client'` kullanılmıştır).
2. **SEO & Arama Motoru Uyumu:**
   - Birincil alan adı `https://yusufbozan.com.tr` üzerinde birleştirilmiş dinamik `canonical` URL tanımları.
   - Sosyal paylaşımlar için otomatik üretilen 1200x630 OpenGraph ve Twitter kartları.
   - Otomatik üretilen `/sitemap.xml` (tüm 8 ana rota + makaleler) ve `/robots.txt`.
   - Bağımsız web için çift RSS akışı (`/rss.xml` ve `/feed.xml`).
   - Google Search Console HTML mülk doğrulama dosyası entegrasyonu.
3. **Erişilebilirlik (WCAG 2.1 AA):**
   - Yalnızca ikon içeren butonlarda anlamlı `aria-label` veya gizli metin (`.sr-only`).
   - Klavye ile (`Tab`, `Enter`, `Space`, `ESC`) tam gezilebilirlik, Radix Dialog focus trap ve görünür `focus-visible` stilleri.
   - Klavye kullanıcıları için doğrudan ana içeriğe atlama bağlantısı (`#main-content` skip link).
4. **Birim Testleri (Vitest):**
   - `npm test` komutuyla çalışan 15 kapsamlı birim testi:
     - `turkishSlugify` (Türkçe karakter dönüşümü, sembol temizleme ve fallback mekanizması).
     - TOC ve HTML başlık tekilleştirmesi (`-1`, `-2` ID üretimi).
     - `extractYouTubeId` (standart, shorts, embed, youtu.be ve saf 11 karakter ID desteği).
     - `resolveTurkeyTimestamp` (yerel tarih koruması, gece yarısı düzeltmesi ve +03:00 saat dilimi).
5. **Ortam Değişkenleri (Environment Variables):**
   - `WEB3FORMS_ACCESS_KEY`: Sunucu tarafında `/api/contact` içinde güvenle tüketilir; istemci tarafına ifşa edilmez. Örnek şablon `.env.example` içinde tanımlanmıştır.

---

## 8. Dağıtım Hattı (CI/CD Pipeline)

- **Uzak Depo (Git Remote):** `https://github.com/yusufbozan1901-creator/kisisel-site.git` (`main` dalı).
- **Canlı Üretim URL'si:** `https://yusufbozan.com.tr` (Vercel barındırma: `kisisel-site-cyan.vercel.app`).
- **Dağıtım Mekanizması:** GitHub `main` dalına her `git push` yapıldığında veya Pages CMS üzerinden bir içerik kaydedildiğinde Vercel Webhook tetiklenir, `next build` çalıştırılır ve yaklaşık 20-30 saniye içinde sıfır kesintiyle (zero-downtime) üretim ortamına aktarılır.

---
*Bu dokümantasyon, Yusuf Bozan kişisel web sitesinin tüm mimari kararlarını, veri şemalarını, dosya hiyerarşisini ve bileşen mantığını temsil eden eksiksiz ve güncel referans kaynağıdır.*
