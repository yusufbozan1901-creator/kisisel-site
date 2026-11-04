import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  readonly asChild?: boolean;
  readonly variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'link';
  readonly size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';

    const baseStyles =
      'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none';

    const variantStyles = {
      default:
        'bg-primary text-primary-foreground shadow hover:bg-primary/90 active:scale-[0.98]',
      secondary:
        'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-[0.98]',
      outline:
        'border border-input bg-background hover:bg-accent hover:text-accent-foreground active:scale-[0.98]',
      ghost:
        'hover:bg-accent hover:text-accent-foreground active:scale-[0.98]',
      link: 'text-primary underline-offset-4 hover:underline',
    };

    const sizeStyles = {
      default: 'h-10 px-4 py-2',
      sm: 'h-8 rounded-md px-3 text-xs',
      lg: 'h-11 rounded-lg px-8 text-base',
      icon: 'h-10 w-10',
    };

    return (
      <Comp
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

