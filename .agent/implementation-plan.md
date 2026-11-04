# Proje Uygulama Yol Haritası (Implementation Plan)

## 1. Proje Özeti ve Hedefler
Yusuf Bozan için bağımsız Markdown (.md) dosyalarıyla beslenen, sade, samimi ve kaliteli bir kişisel not defteri ve blog platformu.

**Tasarım ve İçerik İlkeleri:**
- %100 TypeScript katı mod
- Kod dosyalarından bağımsız, kök dizindeki `/yazilar/*.md` klasöründen beslenen blog mimarisi (`gray-matter` + `marked`)
- `public/gorseller` ve `public/sesler` klasörleri üzerinden doğrudan görsel ve HTML5 `<audio controls>` ses desteği
- Saf siyah (`#000000`), derin antrasit (`#0a0a0a`) ve nötr beyaz tonlarında zarif monokrom palet
- Kitap/editoryal satır aralıkları (`line-height: 1.85`) ve ferah okuma ritmi
- İnce ve zarif saç teli sınır çizgileri (`border-zinc-200/80` ve `dark:border-zinc-800/80`)
- Yalnızca tek ve samimi bir karşılama yazısı: *"Burası Neresi?"* (`yazilar/burasi-neresi.md`)
- Gizli ve güvenli arka uç iletişim altyapısı (`/api/contact`)

---

### Aktif Çekirdek Sayfalar & Mimariler

- [x] **Markdown Motoru (`yazilar/` & `src/lib/posts.ts`):** Koddan bağımsız dosya sistemi tabanlı blog altyapısı
- [x] **Medya Desteği:** `public/gorseller` ve `public/sesler` entegrasyonu, Markdown resim ve ses oynatıcı desteği
- [x] **Ana Sayfa (`/`):** Kişisel karşılama ve "Burası Neresi?" notu
- [x] **Hakkımda (`/about`):** Kişisel hikaye ve yazma motivasyonu
- [x] **Yazılarım (`/blog`):** Markdown dosyalarından derlenen dinamik arşiv
- [x] **Yazı Okuma (`/blog/burasi-neresi`):** Editoryal tipografi, görsel ve ses oynatma desteği (SSG)
- [x] **Güvenli İletişim (`/contact` & `/api/contact`):** E-posta açıkta görünmez; Zod ve rate-limit korumalı
- [x] **Git & GitHub Senkronizasyonu:** Tüm güncellemeler GitHub deposuna push edildi
