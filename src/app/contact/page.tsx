import type { Metadata } from 'next';
import { Container } from '@/components/ui/container';
import { ContactForm } from '@/components/forms/contact-form';

export const metadata: Metadata = {
  title: 'İletişim',
  description: 'Yusuf Bozan ile doğrudan ve güvenli iletişim kurun.',
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
