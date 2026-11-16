# Yusuf Bozan Kişisel Web Sitesi — Mimari, Tasarım ve Geliştirme Dokümantasyonu (A'dan Z'ye)

Bu doküman, Yusuf Bozan için geliştirilen modern, yüksek performanslı, minimalist editoryal kişisel web sitesinin temel felsefesini, teknik mimarisini, dosya yapısını, veri motorlarını ve bugüne kadar hayata geçirilen tüm bileşenleri en ince teknik ayrıntısına kadar açıklar.

---

## 1. Proje Vizyonu ve Felsefesi (Core Philosophy)

### 1.1. Dijital Bahçe (Digital Garden) & Bağımsız Web (IndieWeb)
Bu platform, geleneksel kurumsal portföylerden veya algoritmaların dikte ettiği sosyal medya akışlarından farklı olarak, **"bağımsız bir kişisel not defteri ve dijital düşünce bahçesi"** olarak tasarlanmıştır.
- **İçerik Mülkiyeti (Data Sovereignty):** Hiçbir harici bulut veritabanına (Firebase, Supabase, SQL vb.) bağımlı değildir. Tüm yazılar, anlık düşünceler ve profil bilgileri projenin kendi Git deposunda saf Markdown (`.md`) ve JSON dosyaları olarak saklanır.
- **Sıfır Gürültü, Yüksek Okuma Ritmi:** Dikkat dağıtıcı banner'lar, reklamlar, açılır pop-up'lar veya gereksiz renk cümbüşü bulunmaz. Saf siyah (`#000000`), derin antrasit (`#0a0a0a`), nötr gri ve beyaz tonlarından oluşan yüksek kontrastlı monokrom bir palet kullanılır.
- **Tipografi Önceliği:** Kitap satır yüksekliği (`line-height: 1.85`), ferah harf aralıkları (`letter-spacing: -0.01em`) ve gözü yormayan editoryal tipografi (`.prose-editorial`) ile okuyucuya sakin bir deneyim sunulur.

---

## 2. Teknoloji Yığını ve Mimari Desenler (Tech Stack & Architecture)

| Katman | Teknoloji | Mimari Gerekçe ve Standart |
| :--- | :--- | :--- |
| **Framework** | **Next.js 16 (App Router)** | React Server Components (RSC) öncelikli, hibrit render, SSG (Static Site Generation), Route Handlers |
| **Dil** | **TypeScript (Strict Mode)** | %100 tip güvenliği, sıfır `any`, katı interface ve union tipleri, `readonly` değişmezlik |
| **Stil / Arayüz** | **Tailwind CSS v3 + CSS Variables** | Semantik renk token'ları (`bg-background`, `text-foreground`), 60fps mikro-etkileşimler |
| **İçerik İşleme** | **gray-matter + marked (v18)** | YAML Frontmatter ayrıştırma, GFM (GitHub Flavored Markdown) derleyicisi, özel AST başlık renderer'ı |
| **CMS (Yönetim Paneli)** | **Pages CMS (`.pages.yml`)** | Git tabanlı, sunucusuz (serverless), commit bazlı headless içerik yönetim arayüzü |
| **PWA (Web Uygulaması)** | **Web App Manifest + Custom Service Prompt** | Masaüstü ve mobilde uygulama olarak yüklenebilirlik (`standalone`), YB maskable ikonlar |
| **Form & Güvenlik** | **Web3Forms API + Zod + React Hook Form** | Gizli iletişim formu; e-posta adresi sitede ifşa edilmez, API proxy ile güvenli iletim |
| **SEO & Meta** | **Next.js Metadata API + @vercel/og** | Otomatik dinamik Open Graph kartları, JSON-LD, dinamik sitemap ve robots.txt |
| **RSS & Sindikasyon** | **Route Handlers (`/rss.xml` & `/feed.xml`)** | Standart RSS 2.0 XML akışı; hem yazıları hem anlık düşünceleri kronolojik birleştiren akış |
| **Performans İzleme**| **@vercel/analytics** | Çerezsiz (cookie-less), GDPR uyumlu, hafif ziyaretçi ve performans metriği |

---

## 3. Sistem Mimarisi ve Çalışma Mantığı

```
┌────────────────────────────────────────────────────────────────────────┐
│                        İÇERİK YÖNETİMİ (PAGES CMS)                     │
│  app.pagescms.org  ───>  GitHub API  ───>  Git Commit (.md / .json)    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ (git push / webhook)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     DERLEME ZAMANI (BUILD TIME - SSG)                  │
│                                                                        │
│   yazilar/*.md ──────> gray-matter ──> marked v18 ──> Başlık ID (TOC)  │
│   akis/*.md    ──────> date-resolver ──> Slugify  ──> Çapa Linkleri    │
│   profil.json  ──────> profile.ts ────> marked    ──> Biyografi HTML   │
│                                                                        │
│   Next.js 16 (App Router)  ──>  Statik HTML + JSON (15 Sayfa / 0ms)    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  SUNUM KATMANI (REACT SERVER COMPONENTS)                │
│                                                                        │
│   [Server Components]                                                  │
│   ├── layout.tsx (Kök düzen, PWA Manifest, SEO meta)                   │
│   ├── page.tsx (Hero, Son Akış, Son Yazılar)                          │
│   ├── blog/page.tsx & blog/[slug]/page.tsx (Makale detay, Çok sütun)   │
│   ├── akis/page.tsx (Zaman çizelgesi, CSS :target vurgusu)             │
│   └── about/page.tsx (Biyografi, Avatar, Sosyal Medya)                 │
│                                                                        │
│   [Client Leaf Components - Uç Etkileşimler]                           │
│   ├── TableOfContents (IntersectionObserver aktif başlık takibi)       │
│   ├── ThoughtPermalink (Panoya kopyalama, window.history.replaceState)│
│   ├── AudioPlayer (15 sn sarma, hız seçimi, monokrom çubuk)           │
│   ├── ImageLightbox (Tam ekran resim büyütme)                          │
│   ├── ShareModal & ShareButton (Sosyal medya paylaşım menüsü)          │
│   ├── InstallPrompt (PWA yükleme bildirimi, localStorage hafızası)     │
│   └── ContactForm (React Hook Form + Zod doğrulaması)                  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Klasör ve Dosya Yapısı (Project Directory Tree)

```text
c:\Users\Yusuf\Desktop\SİTE\
├── .pages.yml                   # Pages CMS resmi koleksiyon ve medya şeması
├── package.json                 # Bağımlılıklar, NPM scriptleri ve proje tanımları
├── tsconfig.json                # TypeScript katı mod (strict: true) yapılandırması
├── tailwind.config.ts           # Tailwind CSS tema, font ve eklenti ayarları
├── next.config.mjs              # Next.js derleme ve güvenlik başlıkları konfigürasyonu
│
├── public/                      # Statik medya ve genel dosyalar
│   ├── gorseller/               # CMS medya havuzu (yazı kapakları, avatarlar, akış resimleri)
│   ├── sesler/                  # Ses kayıtları ve podcast dosyaları
│   ├── manifest.json            # PWA web uygulama manifestosu
│   ├── icon.svg                 # Vektörel YB monogram ikonu
│   ├── icon-192.png             # 192x192 PWA uygulama ikonu
│   ├── icon-512.png             # 512x512 PWA yüksek çözünürlüklü uygulama ikonu
│   └── googlec0182533b61ea1a1.html # Google Search Console mülk doğrulama dosyası
│
├── yazilar/                     # Blog makalelerinin bağımsız Markdown dosyaları
│   └── kisa-yazi.md             # Örnek makale içeriği
│
├── akis/                        # Anlık düşünce (mikro-not) Markdown dosyaları
│   ├── 2026-11-05.md
│   ├── 2026-11-06-00-10.md
│   ├── 2026-11-06-17-10.md
│   ├── 2026-11-06-17-12.md
│   ├── 2026-11-06-17-16.md
│   └── 2026-11-06-17-19.md
│
└── src/
    ├── app/                     # Next.js App Router sayfaları ve API rotaları
    │   ├── layout.tsx           # Ana layout (Navbar, Footer, PWA InstallPrompt, SEO Meta)
    │   ├── page.tsx             # Ana sayfa (Hero, Son Akış Notları, Son Yazılar)
    │   ├── icon.tsx             # Dinamik monogram favicon üreticisi
    │   ├── opengraph-image.tsx  # Ana sayfa dinamik Open Graph kartı
    │   ├── robots.ts            # Dinamik robots.txt
    │   ├── sitemap.ts           # Dinamik XML sitemap
    │   ├── not-found.tsx        # Özel 404 sayfası
    │   ├── error.tsx            # Global hata yakalama sınırı (Error Boundary)
    │   │
    │   ├── blog/                # Blog listesi ve detay rotaları
    │   │   ├── page.tsx         # Makale listeleme sayfası
    │   │   └── [slug]/          # Dinamik makale detay rotası
    │   │       ├── page.tsx     # Çok sütunlu makale okuma düzeni (TOC + İçerik)
    │   │       └── opengraph-image.tsx # Yazıya özel otomatik OG kartı üreticisi
    │   │
    │   ├── akis/                # Akış (Mikro-Blog) sayfası
    │   │   └── page.tsx         # Zaman çizelgesi (Timeline) görünümü
    │   │
    │   ├── about/               # Hakkımda sayfası
    │   │   └── page.tsx         # Biyografi, profil fotoğrafı ve sosyal medya
    │   │
    │   ├── contact/             # İletişim sayfası
    │   │   └── page.tsx         # Gizli iletişim formu
    │   │
    │   ├── api/                 # Sunucu API uç noktaları
    │   │   └── contact/route.ts # Web3Forms güvenli e-posta iletim proxy'si
    │   │
    │   ├── rss.xml/route.ts     # Salt blog yazıları için RSS 2.0 XML akışı
    │   └── feed.xml/route.ts    # Birleşik (Yazılar + Akış) RSS 2.0 XML akışı
    │
    ├── content/                 # Site genel ayar ve profil verisi
    │   └── profil.json          # Biyografi, avatar, sosyal medya linkleri
    │
    ├── components/              # Yeniden kullanılabilir React bileşenleri
    │   ├── common/              # Ortak bileşenler
    │   │   ├── navbar.tsx       # Üst navigasyon çubuğu
    │   │   ├── footer.tsx       # Altbilgi (Telif, navigasyon, RSS bağlantısı)
    │   │   ├── theme-toggle.tsx # Karanlık/Aydınlık tema değiştirici
    │   │   ├── theme-provider.tsx # next-themes sağlayıcısı
    │   │   ├── share-modal.tsx  # Yeni nesil yuvarlak ikonlu paylaşım penceresi
    │   │   ├── share-button.tsx # Paylaş butonu tetikleyicisi
    │   │   ├── social-links.tsx # Sosyal medya ikon butonları
    │   │   └── icons.tsx        # SVG marka ikonları (X, WhatsApp, Telegram vb.)
    │   │
    │   ├── sections/            # Sayfa bölümleri
    │   │   ├── hero-section.tsx # Karşılama başlığı ve alt metin
    │   │   ├── thought-card.tsx # Zaman çizelgesi akış kartı (Rozetler + Permalink)
    │   │   ├── blog-list-client.tsx # Canlı arama ve etiket filtrelemeli blog listesi
    │   │   └── contact-form.tsx # Form validasyonu ve gönderim durumu
    │   │
    │   ├── mdx/                 # İçerik zenginleştirme bileşenleri
    │   │   ├── audio-player.tsx # Özel ses çaları (hız, sarma, ilerleme)
    │   │   ├── image-lightbox.tsx # Tıklanınca tam ekran resim büyütücü
    │   │   ├── reading-progress-bar.tsx # Sayfa okuma ilerleme çizgisi
    │   │   ├── post-navigation.tsx # Önceki / Sonraki yazı navigasyon kartları
    │   │   ├── post-content-renderer.tsx # İçerik içi ses ve resimleri dönüştürücü
    │   │   └── table-of-contents.tsx # Masaüstü sticky / Mobil akordeon İçindekiler
    │   │
    │   ├── thoughts/            # Akış özel bileşenleri
    │   │   └── thought-permalink.tsx # Not çapa linki kopyalama ve replaceState
    │   │
    │   ├── pwa/                 # PWA bileşenleri
    │   │   └── install-prompt.tsx # Uygulamayı yükle bildirim kartı
    │   │
    │   └── ui/                  # Temel primitifler
    │       ├── card.tsx         # Kart konteyneri
    │       └── container.tsx    # Responsive sayfa genişlik sınırlayıcısı
    │
    ├── lib/                     # Yardımcı fonksiyonlar ve veri motorları
    │   ├── posts.ts             # Yazı verisi okuma, TOC çıkarma, Türkçe slugify
    │   ├── thoughts.ts          # Akış notları okuma, sezon/bölüm/puan işleme
    │   ├── profile.ts           # Profil, avatar ve aktif sosyal medya ayrıştırıcı
    │   ├── date-resolver.ts     # Türkiye saati ve Git commit zaman damgası çözümleyici
    │   └── utils.ts             # cn() sınıf birleştirici, formatDate()
    │
    ├── styles/                  # Stil tanımları
    │   └── globals.css          # CSS değişkenleri, .prose-editorial, :target vurgusu
    │
    └── config/                  # Proje sabitleri
        └── site.ts              # Site adı, yazar, URL ve navigasyon menü linkleri
```

---

## 5. Çekirdek Sistemler ve Algoritmalar (A'dan Z'ye)

### 5.1. Yazılar Motoru ve Otomatik İçindekiler Tablosu (TOC) — `src/lib/posts.ts`
- **Markdown Derlemesi:** Markdown içeriğindeki tüm H2 (`##`) ve H3 (`###`) başlıkları derleme anında taranır.
- **Türkçe Slugify Fonksiyonu (`turkishSlugify`):**
  Türkçe karakterleri eksiksiz dönüştürür:
  - `ç->c`, `ğ->g`, `ı->i`, `ö->o`, `ş->s`, `ü->u`, `İ->i`, `I->i`.
  - Noktalama işaretlerini (`?`, `!`, `,`, `.`, vb.) temizler, ardışık boşlukları tek tireye (`-`) indirir.
- **ID Çakışma Koruması:** Aynı makale içinde birden fazla aynı başlık geçerse (örneğin iki adet "Giriş"), sayaç mekanizması devreye girerek ilkine `giris`, ikincisine `giris-1` atar.
- **HTML Enjeksiyonu:** Derlenen HTML çıktısındaki `<h2>` ve `<h3>` etiketlerine otomatik olarak `id="..."` ve `scroll-mt-24` sınıfları enjekte edilir.
- **Boş Durum Kontrolü (Guard Clause):** Makalede 2'den az başlık varsa TOC bileşeni DOM'a hiç basılmaz.
- **İki Sütunlu Sayfa Düzeni:**
  - **Masaüstü:** Makale alanı iki sütunlu ızgara (`grid-cols-[1fr_260px]`) düzenine geçer. TOC yan sütunda `sticky top-28` pozisyonunda sayfa kaydırıldıkça ekranda asılı kalır.
  - **Mobil:** Makale başlığının hemen altında, varsayılanı kapalı olan `<details>` akordeon kutusu olarak yer alır (`lg:hidden`).
  - **IntersectionObserver:** `rootMargin: '0px 0px -70% 0px'` kuralı ile kullanıcının o an okuduğu başlık tespit edilerek TOC listesindeki ilgili bağlantı zarifçe vurgulanır.

---

### 5.2. Akış (Timeline) ve Çapa Bağlantı (Permalink) — `src/lib/thoughts.ts` & `src/components/thoughts/thought-permalink.tsx`
- **Deterministik Slug:** `akis/` klasöründeki her `.md` dosyasının adından `.md` uzantısı ayıklanarak değişmez bir kimlik (`slug`) elde edilir (örneğin `2026-11-06-17-18`).
- **İstemci Yaprak Bileşeni (`ThoughtPermalink`):**
  - Butona tıklandığında tam URL'yi (`https://yusufbozan.com.tr/akis#2026-11-06-17-18`) panoya kopyalar (`navigator.clipboard.writeText`).
  - Sayfayı yeniden yüklemeden ve tarayıcı geçmişini kirletmeden adres çubuğunu `window.history.replaceState` ile anlık günceller.
  - 2 saniye boyunca onay ikonu ve "Kopyalandı" geri bildirimi sunar; `aria-live="polite"` erişilebilirlik standardını taşır.
- **CSS `:target` Sözde Sınıfı Odak Vurgusu:**
  Harici hiçbir JavaScript kütüphanesine veya animasyon scriptine ihtiyaç duymadan, saf CSS `article:target` kuralı ile URL'deki hash ile eşleşen nota otomatik çerçeve/ring vurgusu ve zaman çizelgesi noktasında ölçeklenme (`scale-125`) uygulanır.
- **Sezon, Bölüm ve Puan Rozetleri:**
  - Pages CMS'ten girilen `season` ve `episode` alanları `S01 • B04` veya `S02` şeklinde monokrom minimalist rozetlere dönüştürülür.
  - `rating` alanı doluysa yanında minik yıldız ikonuyla zarif bir puan rozeti (`★ 8.5/10`) belirir. Boş bırakıldığında DOM'da hiçbir boşluk kalmaz.

---

### 5.3. Saat Dilimi ve 00:00 Çözümleme Motoru — `src/lib/date-resolver.ts`
- **Sorun:** Pages CMS gibi web tabanlı editörler tarih ve saati yerel olarak (örneğin `2026-11-06T17:18`) kaydeder. Sunucularda Node.js `new Date()` bunu UTC kabul ettiğinde Türkiye saat dilimi (+3 saat) bir kez daha eklenerek saat `20:18` olarak kayıyordu.
- **Çözüm Algoritması:**
  1. Frontmatter içindeki string `YYYY-MM-DDTHH:mm` formatındaysa, kullanıcının seçtiği yerel Türkiye saati doğrudan yakalanır ve ikinci kez +3 saat eklenmesi engellenir.
  2. Saat girilmemişse veya `00:00` olarak gelmişse, sistem o dosyanın Git commit zaman damgasını (`git log -1 --format=%cI`) veya dosya oluşturulma zamanını `Europe/Istanbul` saat dilimine göre çekip gerçek paylaşım saatini üretir.

---

### 5.4. Profil, Avatar ve Sosyal Medya Motoru — `src/lib/profile.ts`
- **Merkezi Veri (`src/content/profil.json`):**
  - `title`: Hakkımda Başlığı
  - `avatar`: Profil fotoğrafı yolu (seçildiğinde `/about` sayfasında `rounded-2xl` şık bir fotoğrafla render edilir).
  - `bio`: Markdown destekli editoryal biyografi metni.
  - `social`: X, Instagram, YouTube, Facebook, GitHub, LinkedIn platformları için bağımsız `{ active: boolean, url: string }` switch yapısı.
  - `customLinks`: Sınırsız özel platform ekleme listesi (`title`, `url`, `active`).
- **Görünürlük Kuralı:** Yalnızca `active: true` olan ve geçerli bir URL içeren bağlantılar sitede gösterilir. Hiçbir link aktif değilse ilgili alanlar layout kayması yapmadan tamamen gizlenir.

---

### 5.5. PWA (Progressive Web App) ve Çevrimdışı/Yüklenebilir Deneyim
- **Manifest (`public/manifest.json`):** `standalone` görüntüleme modu, `#0a0a0a` arka plan ve tema rengi.
- **Uygulama İkonları:** Saf monokrom siyah zemin üzerine beyaz "YB" tipografisi içeren 192x192 ve 512x512 maskable PNG ikonları.
- **Yükleme Bildirimi (`src/components/pwa/install-prompt.tsx`):**
  Tarayıcının `beforeinstallprompt` olayını dinler. Ziyaretçi siteye girdiğinde sağ altta "Yusuf Bozan'ı ana ekranınıza ekleyin" kartı çıkar. "Yükle" veya kapatma ("X") tıklandığında `localStorage` üzerinde durum saklanır ve kullanıcı bir daha rahatsız edilmez.

---

### 5.6. Birleşik ve Otomatik RSS Akışı — `src/app/feed.xml/route.ts`
- Hem uzun makaleleri (`getAllPosts()`) hem de anlık Akış notlarını (`getAllThoughts()`) tarayarak derleme anında statik (`force-static`) bir RSS 2.0 XML akışı oluşturur.
- İçerikleri yayınlanma zaman damgalarına göre en yeniden en eskiye kronolojik dizer.
- Sitenin altbilgisinde (Footer) RSS ikonu ile `/feed.xml` adresi sunulur; tarayıcılar için HTML başlığına `<link rel="alternate" type="application/rss+xml" />` meta etiketi yerleştirilmiştir.

---

### 5.7. Yeni Nesil Açılır Paylaşım Penceresi — `src/components/common/share-modal.tsx`
- Yazıların ve Akış kartlarının altındaki "Paylaş" butonuna tıklandığında ekran ortasında `backdrop-blur` efektli modern bir modal açılır.
- **Bağlantı Kapsülü:** Tam URL tek satırda gösterilir, sağındaki "Bağlantıyı kopyala" butonuna basıldığında panoya kopyalanır ve 2 saniyeliğine "Kopyalandı ✓" geri bildirimi verir.
- **Orijinal Marka Renklerinde Dairesel İkonlar:**
  1. WhatsApp (`#25D366`)
  2. X (`#000000`)
  3. Telegram (`#26A5E4`)
  4. LinkedIn (`#0A66C2`)
  5. Facebook (`#1877F2`)
  6. Reddit (`#FF4500`)
- Tıklandığında ilgili platformun resmi paylaşım URL'si başlık ve bağlantı ile yeni sekmede açılır.

---

### 5.8. Özel Ses Oynatıcısı (Custom Audio Player) — `src/components/mdx/audio-player.tsx`
- Yazılarda veya Akış kartlarında ses dosyası tanımlandığında üstte belirir.
- 15 saniye ileri / 15 saniye geri sarma butonları.
- Oynatma hızı seçicisi (1x, 1.25x, 1.5x, 2x).
- Sürüklenip tıklanabilir özel monokrom zaman çizelgesi çubuğu.
- Sayfa içi HTML `<audio>` etiketleri `PostContentRenderer` aracılığıyla otomatik olarak bu özel bileşenle değiştirilir (Portal Mount).

---

### 5.9. Görsel Büyütme (Image Lightbox) — `src/components/mdx/image-lightbox.tsx`
- Yazı ve akış içi görsellere tıklandığında ekranı kaplayan yarı saydam koyu arka plan üzerinde resmi tam boyutunda açar.
- `ESC` tuşu, kapatma ("X") butonu veya arka plana tıklanarak zahmetsizce kapatılır.
- Görsellerin üzerine gelindiğinde `cursor: zoom-in` imleci gösterilir.

---

### 5.10. Gizli İletişim Formu ve Güvenlik — `src/app/contact/page.tsx` & `src/app/api/contact/route.ts`
- Yusuf Bozan'ın e-posta adresi kaynak kodda veya sayfada hiçbir şekilde görünmez.
- Form verileri istemcide Zod şeması ile doğrulanır (Ad, E-posta, Konu, Mesaj).
- Sunucu tarafındaki `/api/contact` API rotası üzerinden Web3Forms API'sine güvenli biçimde aktarılır.
- Başarılı gönderimde yeşil onay kartı gösterilir, form otomatik sıfırlanır.

---

## 6. Pages CMS (`.pages.yml`) Yapılandırması ve Kullanım Mantığı

Pages CMS (`app.pagescms.org`), GitHub deposuyla doğrudan konuşan statik bir headless CMS'tir. Yapılan her kaydetme işlemi arkada GitHub'a otomatik bir commit olarak işlenir ve Vercel anında canlı siteyi günceller.

### Koleksiyonlar:
1. **Yazılar (`yazilar/`):**
   - `title`: Başlık (Zorunlu)
   - `date`: Yayın Tarihi (Zorunlu)
   - `summary`: Kısa Özet
   - `tags`: Etiketler (Liste)
   - `image`: Kapak Görseli (`public/gorseller` havuzundan seçilir)
   - `audio`: Ses Dosyası (Yazı ses kaydı / podcast)
   - `body`: İçerik (Zengin metin / Markdown)
   - *Tablo Görünümü:* 1. Başlık, 2. Tarih, 3. Kısa Özet sıralamasıyla derli toplu sunulur.

2. **Akış (`akis/`):**
   - `body`: Düşünce Metni (Zorunlu)
   - `date`: Tarih ve Saat (`time: true` ile dakika hassasiyetinde seçim)
   - `season`: Sezon No (İsteğe bağlı)
   - `episode`: Bölüm No (İsteğe bağlı)
   - `rating`: Puan (İsteğe bağlı)
   - `image`: Görsel (İsteğe bağlı)
   - `audio`: Ses Notu (İsteğe bağlı)
   - *Dosya Adı Deseni:* `{year}-{month}-{day}-{hour}-{minute}.md` (aynı gün içindeki çoklu paylaşımlarda çakışma yaşanmaz).
   - *Tablo Görünümü:* 1. Düşünce Metni önizlemesi, 2. Tarih ve Saat.

3. **Hakkımda & Sosyal Medya (`src/content/profil.json`):**
   - Tekil ayar dosyasıdır.
   - Biyografi metni, profil fotoğrafı seçimi, X, Instagram, YouTube, Facebook, GitHub, LinkedIn aktif/pasif anahtarları ve URL alanları ile sınırsız özel link ekleme listesi (`customLinks`) barındırır.

4. **Editor ve Source Modları:**
   - **Editor Modu:** Word / Docs benzeri görsel zengin metin düzenleyicisidir (kalın, italik, başlık, liste, resim ekleme butonları içerir). Günlük kullanım için önerilen moddur.
   - **Source Modu:** Metnin arkasındaki saf Markdown kodunu düzenlemek için kullanılır.

---

## 7. Kalite, Performans ve SEO Göstergeleri

1. **Core Web Vitals:**
   - **LCP (Largest Contentful Paint):** `< 1.2s` (Tüm sayfalar SSG olarak derlendiği için sunucu bekleme süresi TTFB neredeyse sıfırdır).
   - **CLS (Cumulative Layout Shift):** `0.0` (Tüm görsellerde ve kartlarda en-boy oranı ve rezerv alanlar mevcuttur).
   - **INP (Interaction to Next Paint):** `< 50ms` (Gereksiz ağır istemci JavaScript'leri elenmiş, yalnızca leaf bileşenlerde `'use client'` kullanılmıştır).
2. **SEO & Arama Motoru Uyumu:**
   - Sayfa bazlı dinamik `canonical` URL tanımları.
   - Sosyal medya paylaşımları için otomatik üretilen 1200x630 OpenGraph ve Twitter kartları.
   - Otomatik üretilen `/sitemap.xml` ve `/robots.txt`.
   - Google Search Console HTML doğrulama dosyası entegrasyonu.
3. **Erişilebilirlik (WCAG 2.1 AA):**
   - Yalnızca ikon içeren tüm butonlarda anlamlı `aria-label` veya `<span className="sr-only">`.
   - Doğrudan klavye (`Tab`, `Enter`, `Space`) ile gezilebilirlik ve görünür `focus-visible` outline stilleri.
   - Dinamik durum güncellemelerinde ekran okuyucular için `aria-live="polite"`.

---

## 8. Git Dağıtım Hattı (CI/CD Pipeline)

- **Uzak Depo (Remote Repository):** `https://github.com/yusufbozan1901-creator/kisisel-site.git` (`main` dalı).
- **Canlı Üretim URL'si:** `https://kisisel-site-cyan.vercel.app` (veya bağlı özel alan adı `https://yusufbozan.com.tr`).
- **Dağıtım Mekanizması:** GitHub `main` dalına her `git push` yapıldığında veya Pages CMS üzerinden bir yazı/akış kaydedildiğinde Vercel Webhook tetiklenir, `next build` çalıştırılır ve yaklaşık 20-30 saniye içinde sıfır kesintiyle (zero-downtime) yayına alınır.

---
*Bu dokümantasyon projenin tüm mimari kararlarını, veri yapılarını ve kod bileşenlerini temsil eden eksiksiz referans kaynağıdır.*

