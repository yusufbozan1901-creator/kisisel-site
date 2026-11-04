import Link from 'next/link';
import { ArrowRight, Clock, Calendar } from 'lucide-react';
import { HeroSection } from '@/components/sections/hero-section';
import { Container } from '@/components/ui/container';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { getAllPosts } from '@/lib/posts';
import { formatDate } from '@/lib/utils';

export default function HomePage() {
  const posts = getAllPosts();

  return (
    <>
      <HeroSection />

      {/* Featured Note Section */}
      <section className="pb-24 pt-4 border-t border-zinc-200/60 dark:border-zinc-900/80">
        <Container size="narrow">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">
              Son Eklenen Not
            </h2>
            <Link
              href="/blog"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Arşiv ({posts.length})
            </Link>
          </div>

          <div className="space-y-6">
            {posts.map((post) => (
              <Card
                key={post.slug}
                className="group border border-zinc-200/80 dark:border-zinc-800/80 bg-card hover:border-zinc-400 dark:hover:border-zinc-750 transition-all duration-200 rounded-lg p-1 sm:p-2"
              >
                <CardHeader className="p-6 pb-3">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(post.publishedAt)}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {post.readingTime}
                    </span>
                  </div>

                  <CardTitle className="text-xl sm:text-2xl font-bold group-hover:underline underline-offset-4 decoration-1 transition-all">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </CardTitle>

                  <CardDescription className="text-sm sm:text-base text-muted-foreground leading-relaxed pt-2">
                    {post.description}
                  </CardDescription>
                </CardHeader>

                <CardFooter className="px-6 py-4 pt-1 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-900 mt-2">
                  <div className="flex items-center gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-muted-foreground/80 font-normal"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground hover:underline underline-offset-4"
                  >
                    Yazıyı Oku
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
