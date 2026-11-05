'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Lütfen isminizi giriniz.' }),
  email: z.string().email({ message: 'Lütfen geçerli bir e-posta adresi giriniz.' }),
  subject: z.string().min(3, { message: 'Lütfen bir konu belirtiniz.' }),
  message: z.string().min(10, { message: 'Lütfen mesajınızı yazınız (en az 10 karakter).' }),
  website: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export function ContactForm() {
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [serverMessage, setServerMessage] = React.useState<string>('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      website: '',
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setStatus('loading');
    setServerMessage('');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: '3dc6f0d6-c238-46e4-9b00-697b65953a7f',
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
          botcheck: data.website || '',
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus('success');
        setServerMessage(result.message || 'Mesajınız başarıyla iletildi. Teşekkür ederim, en kısa sürede dönüş yapacağım.');
        reset();
      } else {
        setStatus('error');
        setServerMessage(result.message || result.error || 'Mesaj iletilemedi. Lütfen tekrar deneyin.');
      }
    } catch {
      setStatus('error');
      setServerMessage('Bağlantı hatası oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <Card className="border border-zinc-200/80 dark:border-zinc-800/80 bg-card rounded-lg p-2">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg font-semibold">Mesaj Gönderin</CardTitle>
      </CardHeader>

      <CardContent className="p-4 pt-2">
        {status === 'success' ? (
          <div className="rounded-md border border-zinc-200 dark:border-zinc-800 p-6 text-center space-y-3">
            <CheckCircle2 className="h-8 w-8 text-foreground mx-auto" />
            <h3 className="font-semibold text-foreground text-base">
              Mesajınız Güvenle İletildi
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {serverMessage}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setStatus('idle');
                setServerMessage('');
              }}
              className="mt-3 text-xs"
            >
              Yeni Bir Mesaj Gönder
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {status === 'error' && (
              <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{serverMessage}</span>
              </div>
            )}

            {/* Hidden honeypot field for bot protection */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input
                id="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                {...register('website')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-xs font-medium text-foreground">
                  Adınız & Soyadınız *
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="İsminiz"
                  {...register('name')}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name.message}</p>
                )}
              </div>

              {/* Sender Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-medium text-foreground">
                  E-posta Adresiniz *
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="ornek@alanadi.com"
                  {...register('email')}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-1.5">
              <label htmlFor="subject" className="text-xs font-medium text-foreground">
                Konu *
              </label>
              <input
                id="subject"
                type="text"
                placeholder="Konu"
                {...register('subject')}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
              {errors.subject && (
                <p className="text-xs text-destructive">{errors.subject.message}</p>
              )}
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <label htmlFor="message" className="text-xs font-medium text-foreground">
                Mesajınız *
              </label>
              <textarea
                id="message"
                rows={5}
                placeholder="Düşüncelerinizi buraya yazabilirsiniz..."
                {...register('message')}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none leading-relaxed"
              />
              {errors.message && (
                <p className="text-xs text-destructive">{errors.message.message}</p>
              )}
            </div>

            <div className="pt-1">
              <Button
                type="submit"
                disabled={status === 'loading'}
                className="w-full gap-2 text-xs font-medium h-9"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Gönderiliyor...
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    Mesajı Gönder
                  </>
                )}
              </Button>
            </div>

            <p className="text-[11px] text-muted-foreground/80 text-center pt-1">
              Bilgileriniz gizli tutulur ve yalnızca size yanıt vermek için kullanılır.
            </p>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
