import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly variant?: 'default' | 'secondary' | 'outline' | 'success';
}

export function Badge({
  className,
  variant = 'default',
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/80',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border border-border text-foreground hover:bg-accent',
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

