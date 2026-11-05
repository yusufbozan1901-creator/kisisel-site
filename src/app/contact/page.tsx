import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { ContactForm } from '@/components/forms/contact-form';
import { DirectContactCard } from '@/components/forms/direct-contact-card';
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
        <div className="max-w-xl mb-10 space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            İletişim
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-base leading-relaxed">
            Buradaki yazılar hakkında bir fikir paylaşmak, bir soru iletmek ya da sadece merhaba demek için doğrudan e-posta gönderebilir veya formu doldurabilirsiniz.
          </p>
        </div>

        {/* Direct Email Card */}
        <div className="max-w-xl">
          <DirectContactCard />
        </div>

        {/* Secure Form */}
        <div className="max-w-xl">
          <ContactForm />
        </div>
      </Container>
    </div>
  );
}
