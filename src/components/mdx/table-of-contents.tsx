'use client';

import * as React from 'react';
import { ListTree, ChevronDown } from 'lucide-react';

export interface TocItem {
  readonly id: string;
  readonly text: string;
  readonly level: 2 | 3;
}

interface TableOfContentsProps {
  readonly items: readonly TocItem[];
  readonly variant?: 'desktop' | 'mobile';
  readonly className?: string;
}

/**
 * TableOfContents - Renders a hierarchical table of contents with active section tracking.
 * Uses IntersectionObserver (rootMargin: '0px 0px -70% 0px') to highlight the active heading
 * as the user scrolls through the article.
 */
export function TableOfContents({
  items,
  variant = 'desktop',
  className = '',
}: TableOfContentsProps) {
  const [activeId, setActiveId] = React.useState<string>(items[0]?.id || '');

  React.useEffect(() => {
    if (items.length === 0) return;

    const headingElements = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (headingElements.length === 0) return;

    // Detect currently reading section near top-to-middle of viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '0px 0px -70% 0px',
        threshold: [0, 1.0],
      }
    );

    headingElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [items]);

  const handleLinkClick = (id: string) => {
    setActiveId(id);
  };

  if (!items || items.length < 2) {
    return null;
  }

  // Mobile Accordion Variant (<details>)
  if (variant === 'mobile') {
    return (
      <details className={`group rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 p-4 transition-all ${className}`}>
        <summary className="flex items-center justify-between cursor-pointer list-none select-none text-xs font-medium text-foreground">
          <span className="flex items-center gap-2 font-mono uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
            <ListTree className="h-3.5 w-3.5" />
            <span>İçindekiler ({items.length})</span>
          </span>
          <ChevronDown className="h-4 w-4 text-muted-foreground group-open:rotate-180 transition-transform duration-200" />
        </summary>

        <nav aria-label="İçindekiler" className="mt-3 pt-3 border-t border-zinc-200/60 dark:border-zinc-800/60">
          <ul className="space-y-2 text-xs">
            {items.map((item) => {
              const isActive = activeId === item.id;
              return (
                <li key={item.id} className={item.level === 3 ? 'pl-4' : 'pl-0'}>
                  <a
                    href={`#${item.id}`}
                    onClick={() => handleLinkClick(item.id)}
                    className={`block py-0.5 transition-colors leading-snug ${
                      isActive
                        ? 'font-medium text-foreground underline underline-offset-4'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-foreground'
                    }`}
                  >
                    {item.text}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </details>
    );
  }

  // Desktop Sticky Sidebar Variant
  return (
    <nav
      aria-label="İçindekiler"
      className={`space-y-3 p-4 rounded-xl border border-zinc-200/60 dark:border-zinc-850/70 bg-card/50 backdrop-blur-sm ${className}`}
    >
      <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
        <ListTree className="h-3.5 w-3.5" />
        <span>İçindekiler</span>
      </div>

      <ul className="space-y-1 text-xs border-l border-zinc-200/70 dark:border-zinc-800/80">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li
              key={item.id}
              className={`transition-colors -ml-px border-l-2 ${
                item.level === 3 ? 'pl-4' : 'pl-3'
              } ${
                isActive
                  ? 'border-foreground font-medium text-foreground'
                  : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-foreground hover:border-zinc-400 dark:hover:border-zinc-600'
              }`}
            >
              <a
                href={`#${item.id}`}
                onClick={() => handleLinkClick(item.id)}
                className="block py-1 leading-snug transition-colors line-clamp-2"
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
