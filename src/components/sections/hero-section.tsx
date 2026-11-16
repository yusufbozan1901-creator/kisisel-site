import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { SocialLinks } from '@/components/common/social-links';
import type { ActiveSocialLink } from '@/lib/profile';

interface HeroSectionProps {
  readonly socialLinks?: readonly ActiveSocialLink[];
}

export function HeroSection({ socialLinks }: HeroSectionProps) {
  return (
    <section className="pt-8 sm:pt-12 pb-6">
      <Container size="default">
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-zinc-900 dark:text-white leading-tight">
            Dijital bahçem ve kişisel arşivim.
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-[#A1A1AA] leading-relaxed max-w-2xl font-normal">
            Burası internetin telaşından ve gürültüsünden uzakta; zihnimi toparlamak, editoryal notlar tutmak ve zamanla biriktirdiğim düşünce kırıntılarını paylaşmak için açtığım sakin bir köşe.
          </p>

          {socialLinks && socialLinks.length > 0 && (
            <div className="pt-2">
              <SocialLinks links={socialLinks} />
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
