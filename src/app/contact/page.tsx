import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { ContactForm } from '@/components/forms/contact-form';
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
          <p className="text-zinc-600 dark:text-zinc-400 text-base leading-relaxed">
            Yazılarım hakkında bir fikir paylaşmak, soru sormak veya selam vermek için aşağıdaki formu kullanabilirsiniz.
          </p>
        </div>

        {/* Secure Form */}
        <div className="max-w-xl">
          <ContactForm />
        </div>
      </Container>
    </div>
  );
}
