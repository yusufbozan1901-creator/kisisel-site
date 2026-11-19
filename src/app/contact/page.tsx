import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';
// NOTE: İletişim formu geçici olarak devre dışı bırakılmıştır.
// Form bileşeni ve Web3Forms gönderim mantığı silinmemiştir; reactivate edilmek üzere saklanmaktadır.
// import { ContactForm } from '@/components/forms/contact-form';
import { SITE_CONFIG } from '@/config/site';

export const metadata: Metadata = {
  title: 'İletişim',
  description: 'Yusuf Bozan ile doğrudan ve güvenli iletişim kurun.',
  openGraph: {
    title: `İletişim | ${SITE_CONFIG.name}`,
    description: 'Yusuf Bozan ile doğrudan ve güvenli iletişim kurun.',
    url: `${SITE_CONFIG.url}/contact`,
    type: 'website',
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: `İletişim | ${SITE_CONFIG.name}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `İletişim | ${SITE_CONFIG.name}`,
    description: 'Yusuf Bozan ile doğrudan ve güvenli iletişim kurun.',
    images: [SITE_CONFIG.ogImage],
  },
};

export default function ContactPage() {
  return (
    <div className="py-20 sm:py-28">
      <Container size="narrow">
        {/* Header */}
        <div className="max-w-xl mb-12 space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            İletişim
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            Düşüncelerinizi paylaşmak, soru iletmek veya bağlantı kurmak için bana ulaşabilirsiniz.
          </p>
        </div>

        {/* Temporary Deactivation Notice (Form is kept in code, hidden on UI) */}
        <div className="max-w-xl">
          <div className="rounded-xl border border-border bg-card p-6 sm:p-8 text-center space-y-3 shadow-sm">
            <h2 className="font-semibold text-foreground text-base sm:text-lg">
              İletişim Formu Geçici Olarak Kapalıdır
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              İletişim formu altyapı güncellemeleri nedeniyle şu anda doğrudan ileti gönderimine kapatılmıştır.
              Bana profil sayfamdaki sosyal medya bağlantıları üzerinden ulaşabilirsiniz.
            </p>
          </div>
          {/* 
            Geliştirici Notu: 
            Formu tekrar aktif etmek için yukarıdaki bildirim kutusu yerine 
            `<ContactForm />` bileşenini geri açınız.
          */}
        </div>
      </Container>
    </div>
  );
}
