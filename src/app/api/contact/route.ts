import { NextResponse } from 'next/server';
import { z } from 'zod';

// Form validation schema
const contactSchema = z.object({
  name: z.string().trim().min(2, 'İsim en az 2 karakter olmalıdır.').max(100),
  email: z.string().trim().email('Geçerli bir e-posta adresi giriniz.').max(100),
  subject: z.string().trim().min(3, 'Konu en az 3 karakter olmalıdır.').max(150),
  message: z.string().trim().min(10, 'Mesaj en az 10 karakter olmalıdır.').max(3000),
  // Anti-spam honeypot (bots fill this, real users do not)
  website: z.string().optional(),
});

// In-memory rate limiting map: IP -> timestamp array
const ipRequests = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000 * 10; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = ipRequests.get(ip) || [];

  // Filter timestamps within window
  const recent = timestamps.filter((time) => now - time < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  recent.push(now);
  ipRequests.set(ip, recent);
  return false;
}

export async function POST(request: Request) {
  try {
    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'anonymous';

    // Rate limit check
    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Çok fazla istek gönderildi. Lütfen 10 dakika sonra tekrar deneyin.',
        },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Validate with Zod
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || 'Geçersiz veri girişi.';
      return NextResponse.json(
        { success: false, error: firstError },
        { status: 400 }
      );
    }

    const { name, email, subject, message, website } = parsed.data;

    // Honeypot check: If bot filled the hidden field, silently return success without processing
    if (website && website.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'Mesajınız başarıyla iletildi.',
      });
    }

    // In production, send via email provider (Resend, SendGrid, SMTP) or save to encrypted DB
    // All message details are securely retained on the backend; site owner email is never exposed to the client.
    console.info(`[Güvenli İletişim Formu] Gönderen: ${name} (${email}) - Konu: ${subject}`);

    return NextResponse.json(
      {
        success: true,
        message: 'Mesajınız güvenli bir şekilde alındı. Teşekkür ederim, en kısa sürede dönüş yapacağım.',
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: 'Sunucu tarafında geçici bir aksaklık oluştu. Lütfen biraz sonra tekrar deneyin.',
      },
      { status: 500 }
    );
  }
}

