import * as React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  variant?: 'default' | 'glass' | 'liquid' | 'bordered' | 'crimson' | 'subtle';
  glowEffect?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      hoverEffect = true,
      variant = 'default',
      glowEffect = false,
      children,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        'relative rounded-2xl border transition-all duration-300 overflow-hidden',
        // Default variant: rich dark obsidian gradient with subtle specular rim
        variant === 'default' &&
          'border-zinc-800/90 bg-gradient-to-b from-zinc-900/95 via-zinc-900 to-zinc-950/95 text-zinc-100 shadow-xl shadow-black/50 ring-1 ring-white/[0.06]',
        // Glass variant: sleek translucent frosted glass with crisp light rim
        variant === 'glass' &&
          'backdrop-blur-2xl bg-zinc-900/75 border-zinc-700/60 text-zinc-100 shadow-2xl shadow-black/60 ring-1 ring-white/[0.08]',
        // Liquid Glass variant: ultra-premium translucent crystal liquid glass with refraction sheen
        variant === 'liquid' &&
          'backdrop-blur-2xl bg-gradient-to-br from-white/[0.09] via-zinc-900/65 to-zinc-950/85 border border-white/20 text-zinc-100 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.85),0_0_35px_rgba(225,29,72,0.12)] ring-1 ring-white/15',
        // Crimson variant: refined deep dark tone with subtle specular rim
        variant === 'crimson' &&
          'border-zinc-800/90 bg-gradient-to-b from-zinc-900/95 via-[#140e11] to-zinc-950 text-zinc-100 shadow-2xl shadow-black/80 ring-1 ring-white/[0.08]',
        // Bordered variant: high-contrast highlighted border
        variant === 'bordered' &&
          'border border-zinc-700 bg-zinc-950 text-zinc-100 shadow-lg ring-1 ring-white/[0.06]',
        // Subtle variant
        variant === 'subtle' &&
          'border border-zinc-800/70 bg-zinc-900/60 text-zinc-100 shadow-md ring-1 ring-white/[0.03]',
        // Hover effect: gentle elevation and rim lighting
        hoverEffect &&
          'hover:border-zinc-600 hover:shadow-2xl hover:shadow-black/70 hover:-translate-y-1 hover:ring-white/[0.2]',
        // Glow effect
        glowEffect && 'shadow-[0_0_30px_rgba(225,29,72,0.15)] border-rose-500/40',
        className
      )}
      {...props}
    >
      {/* Subtle top edge specular highlight & diagonal liquid glass sheen */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      {children}
    </div>
  )
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'font-black text-xl sm:text-2xl leading-tight tracking-tight text-white',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-zinc-300 leading-relaxed font-normal', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };

