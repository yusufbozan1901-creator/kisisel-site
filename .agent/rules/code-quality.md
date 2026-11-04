# Kod Kalite Standartları ve Kuralları (Code Quality Standards)

Bu doküman, projede yazılan tüm TypeScript, React ve CSS kodlarının kurumsal kalitede, okunabilir, sürdürülebilir ve hatasız olmasını temin eden katı kuralları tanımlar.

---

## 1. TypeScript İlkeleri

1. **Katı Mod (Strict Mode):**
   - `strict: true` zorunludur. `noImplicitAny`, `strictNullChecks`, `noUncheckedIndexedAccess` açık olmalıdır.
2. **`any` Kullanımı Kesinlikle Yasaktır:**
   - Bilinmeyen tipler için `unknown` kullanılmalı ve Type Narrowing / Type Guards uygulanmalıdır.
   - Gerekli yerlerde Generic tipler (`T`, `TData`) tercih edilmelidir.
3. **Type vs Interface:**
   - Bileşen Props ve State tanımlarında `interface` tercih edilmelidir:
     ```typescript
     export interface ProjectCardProps {
       readonly title: string;
       readonly description: string;
       readonly tags: readonly string[];
       readonly demoUrl?: string;
       readonly githubUrl?: string;
     }
     ```
   - Birlik (Union), Kesişim (Intersection) ve ilkel tipler için `type` kullanılmalıdır:
     ```typescript
     export type ThemeMode = 'light' | 'dark' | 'system';
     export type ProjectCategory = 'web' | 'mobile' | 'ai' | 'cloud';
     ```
4. **Immutability (Değişmezlik):**
   - Dışarıdan gelen parametreler ve props tanımlarında `readonly` anahtar kelimesi teşvik edilir.

---

## 2. İsimlendirme Konvansiyonları

| Kategori | Kural | Örnek |
| :--- | :--- | :--- |
| **Bileşen Dosyaları** | `kebab-case.tsx` | `project-card.tsx`, `theme-toggle.tsx` |
| **Modül / Yardımcı Dosyalar** | `kebab-case.ts` | `format-date.ts`, `site-metadata.ts` |
| **React Bileşenleri** | `PascalCase` | `ProjectCard`, `Navbar`, `ContactForm` |
| **Custom Hooks** | `useCamelCase` | `useScrollPosition`, `useMounted` |
| **Fonksiyonlar & Metotlar** | `camelCase` (Fiil ile başlayan) | `calculateReadingTime`, `validateInput` |
| **Sabitler (Constants)** | `SCREAMING_SNAKE_CASE` | `MAX_FILE_SIZE`, `DEFAULT_PAGE_LIMIT` |
| **TypeScript Tipleri/Arayüzleri** | `PascalCase` | `BlogPost`, `SocialLink`, `UserSession` |

---

## 3. Bileşen Tasarım Prensipleri (Component Architecture)

1. **Tek Sorumluluk Prensibi (Single Responsibility):**
   - Bir bileşen yalnızca tek bir amaca hizmet etmelidir. 150-200 satırı aşan bileşenler alt parçalara bölünmelidir.
2. **Erken Dönüş (Early Return Pattern):**
   - İç içe `if/else` bloklarından kaçınılmalı, guard clause / early return kullanılmalıdır:
     ```typescript
     // Doğru:
     if (!post) {
       return <NotFoundState message="Yazı bulunamadı." />;
     }
     return <ArticleContent post={post} />;
     ```
3. **Props Doğrulama ve Destructuring:**
   - Props parametre seviyesinde destructure edilmeli ve varsayılan değerler burada verilmelidir:
     ```typescript
     export const SectionHeading = ({
       title,
       subtitle,
       centered = false,
     }: SectionHeadingProps) => { ... };
     ```
4. **Slot & Kompozisyon Kalıbı:**
   - Aşırı props aktarımı yerine `children` ve bileşen kompozisyonu kullanılmalıdır.

---

## 4. Stil ve CSS Standartları

1. **Tailwind Sınıf Sıralaması:**
   - `clsx` ve `tailwind-merge` (`cn()` utility) kullanılmalıdır.
   - Düzen (Layout) -> Kutu Modeli (Box Model) -> Tipografi -> Renkler/Görsel -> Efektler/Geçişler sırası izlenmelidir.
     ```typescript
     import { cn } from '@/lib/utils';

     export function Card({ className, ...props }: CardProps) {
       return (
         <div
           className={cn(
             'flex flex-col rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm transition-all hover:shadow-md',
             className
           )}
           {...props}
         />
       );
     }
     ```
2. **Sabit Renk Kodlarından Kaçınma:**
   - Asla `bg-[#1e1e1e]` veya `text-[#333]` gibi sabit değerler doğrudan kodlanmamalıdır.
   - Projenin semantik token'ları (`bg-background`, `text-foreground`, `border-border`, `text-muted-foreground`) kullanılmalıdır. Bu sayede karanlık/aydınlık tema kusursuz çalışır.

---

## 5. Erişilebilirlik (A11y - Accessibility)

1. **Semantik HTML:**
   - `div` çorbası yapılmamalıdır. `<main>`, `<article>`, `<section>`, `<aside>`, `<nav>`, `<header>`, `<footer>` gibi anlamsal etiketler kullanılmalıdır.
2. **Klavye Erişilebilirliği:**
   - Tüm interaktif öğeler (butonlar, linkler, menüler) klavye ile (`Tab`, `Enter`, `Space`) erişilebilir olmalı ve görünür `focus-visible` outline'a sahip olmalıdır.
3. **Ekran Okuyucu Desteği:**
   - Yalnızca ikon içeren butonlarda mutlaka `aria-label` veya `<span className="sr-only">` bulunmalıdır.
   - Görsellerde anlamlı `alt` metni zorunludur (dekoratif görsellerde `alt=""` olmalıdır).

---

## 6. Hata Yönetimi ve Dayanıklılık (Error Handling)

1. **Error Boundaries:**
   - Her ana rota grubu veya dinamik bileşen kendi `error.tsx` sınırına sahip olmalıdır.
2. **Tip Güvenli API Yanıtları:**
   - Sunucu eylemleri (Server Actions) veya API yanıtları her zaman öngörülebilir bir zarf (envelope) yapısıyla dönmelidir:
     ```typescript
     export type ActionResult<T> =
       | { success: true; data: T }
       | { success: false; error: string; fieldErrors?: Record<string, string[]> };
     ```

---

## 7. Temiz Kod ve Git Disiplini

- Konsol logları (`console.log`) ve kullanılmayan importlar prodüksiyon kodunda kesinlikle bırakılmamalıdır.
- Anlamlı ve konvansiyonel commit mesajları kullanılmalıdır (`feat:`, `fix:`, `refactor:`, `style:`, `docs:`).

