# Proje Uygulama Yol Haritası (Implementation Plan)

## 1. Proje Özeti ve Hedefler
Yusuf Bozan için bağımsız Markdown (.md) dosyalarıyla beslenen, birinci sınıf bir editoryal kişisel not defteri ve blog platformu.

**Tasarım ve İçerik İlkeleri:**
- %100 TypeScript katı mod
- Kod dosyalarından bağımsız, kök dizindeki `/yazilar/*.md` klasöründen beslenen blog mimarisi (`gray-matter` + `marked`)
- `public/gorseller` ve `public/sesler` klasörleri üzerinden doğrudan görsel ve özel React ses oynatıcısı desteği
- Saf siyah (`#000000`), derin antrasit (`#0a0a0a`) ve nötr beyaz tonlarında zarif monokrom palet
- Kitap/editoryal satır aralıkları (`line-height: 1.85`) ve ferah okuma ritmi
- Yüksek kontrastlı aydınlık ve karanlık mod dengesi
- Yalnızca tek ve samimi bir karşılama yazısı: *"Burası Neresi?"* (`yazilar/burasi-neresi.md`)
- Doğrudan ve güvenli iletişim altyapısı
- Canlı üretim URL'si: `https://kisisel-site-cyan.vercel.app`

---

### Aktif Çekirdek Sayfalar & Mimariler

- [x] **Markdown Motoru (`yazilar/` & `src/lib/posts.ts`):** Koddan bağımsız dosya sistemi tabanlı blog altyapısı
- [x] **Özel Ses Oynatıcı (`AudioPlayer` & `PostContentRenderer`):** 15 sn sarma, hız seçimi ve monokrom çubuk
- [x] **Görsel Lightbox (`ImageLightbox`):** Yazı içi resimlere tıklandığında tam ekran görüntüleme
- [x] **Canlı Arama & Etiket Filtreleme (`BlogListClient`):** Blog sayfasında anlık filtreleme
- [x] **Okuma İlerleme Çubuğu & Bağlantı Kopyalama:** Okuma ilerlemesi ve tek tıkla paylaşım
- [x] **Önceki / Sonraki Yazı Navigasyonu:** Kronolojik yazı geçiş kartları
- [x] **Aydınlık Mod Kontrast İyileştirmesi:** Açık temada yüksek okunabilirlikli zinc-700/800 metin tonları
- [x] **YB Monogramlı Favicon (`src/app/icon.tsx`):** Özel uygulama ikonu
- [x] **Doğrudan İletişim Kartı & Samimi Hakkımda:** Mailto/kopyalama kartı ve editoryal metin
- [x] **Vercel Analytics & Open Graph Kartları:** Canlı üretim URL'si (`https://kisisel-site-cyan.vercel.app`) ve mutlak OG görseli
- [x] **Git & GitHub Senkronizasyonu:** Tüm güncellemeler GitHub deposuna push edildi
