import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-rose-600 text-white shadow-lg shadow-rose-600/25 hover:bg-rose-500 hover:shadow-rose-600/40',
        destructive:
          'bg-red-600 text-white shadow-md shadow-red-600/25 hover:bg-red-500',
        outline:
          'border border-zinc-700 bg-zinc-900/60 text-zinc-100 hover:bg-zinc-800 hover:text-white hover:border-zinc-600',
        secondary:
          'bg-zinc-800 text-zinc-100 shadow-sm hover:bg-zinc-700',
        ghost:
          'hover:bg-zinc-800/80 hover:text-white text-zinc-300',
        link:
          'text-rose-500 underline-offset-4 hover:underline',
        primary:
          'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg shadow-rose-600/30 hover:from-rose-500 hover:to-red-500',
      },
      size: {
        default: 'h-11 px-5 py-2.5',
        sm: 'h-9 rounded-lg px-3.5 text-xs',
        md: 'h-11 px-5 py-2.5 text-sm',
        lg: 'h-13 rounded-2xl px-8 text-base font-bold',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin text-current" />}
        {children}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
