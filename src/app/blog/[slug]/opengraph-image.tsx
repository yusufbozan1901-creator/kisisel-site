import { ImageResponse } from 'next/og';
import { getPostBySlug } from '@/lib/posts';

export const runtime = 'nodejs';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  const title = post?.title || 'Yusuf Bozan';
  const description = post?.description || 'Kişisel Düşünceler ve Notlar';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '70px 80px',
          backgroundColor: '#09090b',
          color: '#fafafa',
          fontFamily: 'sans-serif',
          border: '12px solid #18181b',
        }}
      >
        {/* Üst Bar: YB Monogramı ve Site Adresi */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                color: '#000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                fontWeight: 900,
                letterSpacing: '-0.05em',
              }}
            >
              YB
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff' }}>
                Yusuf Bozan
              </span>
              <span style={{ fontSize: '14px', color: '#71717a', fontFamily: 'monospace' }}>
                yusufbozan.com.tr
              </span>
            </div>
          </div>

          <div
            style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              border: '1px solid #27272a',
              backgroundColor: '#18181b',
              fontSize: '14px',
              color: '#a1a1aa',
            }}
          >
            Makale & Not
          </div>
        </div>

        {/* Orta Alan: Başlık ve Açıklama */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1000px' }}>
          <div
            style={{
              fontSize: title.length > 50 ? '48px' : '58px',
              fontWeight: 800,
              lineHeight: 1.15,
              color: '#ffffff',
              letterSpacing: '-0.03em',
            }}
          >
            {title}
          </div>
          {description && (
            <div
              style={{
                fontSize: '24px',
                lineHeight: 1.45,
                color: '#a1a1aa',
                maxHeight: '100px',
                overflow: 'hidden',
              }}
            >
              {description}
            </div>
          )}
        </div>

        {/* Alt Bar: İmza */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid #27272a',
            paddingTop: '28px',
          }}
        >
          <span style={{ fontSize: '18px', color: '#71717a', fontWeight: 500 }}>
            Yusuf Bozan | yusufbozan.com.tr
          </span>
          <span style={{ fontSize: '16px', color: '#52525b', fontFamily: 'monospace' }}>
            Kişisel Not Defteri
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

