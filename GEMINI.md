# Kişisel Web Sitesi - Proje Geliştirme Yönergeleri

Bu proje, yüksek performanslı, kurumsal standartlarda, modern ve minimalist bir kişisel web sitesidir.
Geliştirme yaparken aşağıdaki kural setleri ve yol haritası harfiyen uygulanmalıdır:

- **Mimari Kurallar:** `@[architecture](.agent/rules/architecture.md)`
- **Kod Kalite Standartları:** `@[code-quality](.agent/rules/code-quality.md)`
- **Proje Yol Haritası:** `@[implementation-plan](.agent/implementation-plan.md)`

## Temel İlkeler:
1. **TypeScript Strict:** Sıfır `any`, katı tip tanımları.
2. **Server-First:** React Server Components (RSC) önceliklidir; sadece gerekli yerlerde `'use client'`.
3. **Erişilebilirlik ve Performans:** WCAG 2.1 AA uyumu, LCP < 2.0s, CLS = 0.
4. **Semantik Tasarım Token'ları:** Sabit hex kodları yerine Tailwind semantik değişkenleri (`bg-background`, `text-foreground`).

