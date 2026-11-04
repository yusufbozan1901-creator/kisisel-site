# Proje Uygulama Yol Haritası (Implementation Plan)

## 1. Proje Özeti ve Hedefler
Yusuf Bozan için sade, samimi, yüksek kaliteli ve minimalist bir kişisel not defteri ve blog alanı.

**Tasarım ve İçerik İlkeleri:**
- %100 TypeScript katı mod
- Saf siyah (`#000000`), derin antrasit (`#0a0a0a`) ve nötr beyaz tonlarında zarif monokrom palet
- Kitap/editoryal satır aralıkları (`line-height: 1.85`) ve ferah okuma ritmi
- İnce ve zarif sınır çizgileri (`border-zinc-800/900`)
- Yalnızca tek ve samimi bir karşılama yazısı: *"Burası Neresi?"*
- Gizli ve güvenli arka uç iletişim altyapısı (`/api/contact`)

---

### Aktif Çekirdek Sayfalar

- [x] **Ana Sayfa (`/`):** Kişisel karşılama ve "Burası Neresi?" notu
- [x] **Hakkımda (`/about`):** Kişisel hikaye ve yazma motivasyonu
- [x] **Yazılarım (`/blog`):** Tekil samimi not arşivi
- [x] **Yazı Okuma (`/blog/burasi-neresi`):** Editoryal tipografi ve okuma deneyimi
- [x] **Güvenli İletişim (`/contact` & `/api/contact`):** E-posta açıkta görünmez; Zod ve rate-limit korumalı
