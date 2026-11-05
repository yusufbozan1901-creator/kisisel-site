# Proje Uygulama Yol Haritası (Implementation Plan)

## 1. Proje Özeti ve Hedefler
Yusuf Bozan için bağımsız Markdown (.md) dosyalarıyla beslenen, Pages CMS destekli, birinci sınıf bir editoryal kişisel not defteri, blog ve düşünce akışı platformu.

**Tasarım ve İçerik İlkeleri:**
- %100 TypeScript katı mod
- Kod dosyalarından bağımsız, kök dizindeki `/yazilar/*.md` ve `/akis/*.md` klasörlerinden beslenen çift katmanlı içerik mimarisi
- Pages CMS (`.pages.yml`) üzerinden web tabanlı görsel içerik, anlık düşünceler ve profil/sosyal medya yönetimi
- Web3Forms API tabanlı gizli ve güvenli iletişim formu
- Saf siyah (`#000000`), derin antrasit (`#0a0a0a`) ve nötr beyaz tonlarında zarif monokrom palet
- Kitap/editoryal satır aralıkları (`line-height: 1.85`) ve ferah okuma ritmi
- Yüksek kontrastlı aydınlık ve karanlık mod dengesi
- Canlı üretim URL'si: `https://kisisel-site-cyan.vercel.app`

---

### Aktif Çekirdek Sayfalar & Mimariler

- [x] **Markdown Motoru (`yazilar/` & `src/lib/posts.ts`):** Koddan bağımsız dosya sistemi tabanlı blog altyapısı
- [x] **Akış Sistemi (`akis/` & `src/lib/thoughts.ts` & `/akis`):** Zaman çizelgesi görünümlü anlık düşünceler ve mikro-notlar
- [x] **Pages CMS (`.pages.yml`):** Görseller, sesler, yazılar, akış ve profil.json yönetim paneli şeması
- [x] **Dinamik Profil & Sosyal Medya:** `src/content/profil.json` üzerinden kodsuz yönetilen Hakkımda ve sosyal medya ikonları
- [x] **Paylaşım Butonu (`ShareButton`):** Web Share API + X, WhatsApp, LinkedIn, Facebook ve Bağlantı Kopyalama menüsü
- [x] **Özel Ses Oynatıcı (`AudioPlayer` & `PostContentRenderer`):** 15 sn sarma, hız seçimi ve monokrom çubuk; yazılarda otomatik üst ses çaları
- [x] **Görsel Lightbox (`ImageLightbox`):** Yazı ve akış içi resimlere tıklandığında tam ekran görüntüleme
- [x] **Canlı Arama & Etiket Filtreleme (`BlogListClient`):** Blog sayfasında anlık filtreleme
- [x] **Okuma İlerleme Çubuğu & Bağlantı Kopyalama:** Okuma ilerlemesi ve tek tıkla paylaşım
- [x] **Önceki / Sonraki Yazı Navigasyonu:** Kronolojik yazı geçiş kartları
- [x] **Aydınlık Mod Kontrast İyileştirmesi:** Açık temada yüksek okunabilirlikli zinc-700/800 metin tonları
- [x] **YB Monogramlı Favicon (`src/app/icon.tsx`):** Özel uygulama ikonu
- [x] **Gizli İletişim Formu (Web3Forms):** E-posta açıkta görünmez; Web3Forms API doğrudan entegrasyonu
- [x] **Vercel Analytics & Open Graph Kartları:** Canlı üretim URL'si (`https://kisisel-site-cyan.vercel.app`) ve mutlak OG görseli
- [x] **Git & GitHub Senkronizasyonu:** Tüm güncellemeler GitHub deposuna push edildi
