// Button component
import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', fullWidth, children, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
                    {
                        // Variants
                        'bg-zinc-900 text-white hover:bg-zinc-800 focus:ring-zinc-900': variant === 'primary',
                        'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 focus:ring-zinc-500': variant === 'secondary',
                        'border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50 focus:ring-zinc-500': variant === 'outline',
                        'text-zinc-700 hover:bg-zinc-100 focus:ring-zinc-500': variant === 'ghost',
                        'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600': variant === 'danger',

                        // Sizes
                        'px-3 py-1.5 text-sm': size === 'sm',
                        'px-4 py-2 text-base': size === 'md',
                        'px-6 py-3 text-lg': size === 'lg',

                        // Width
                        'w-full': fullWidth,
                    },
                    className
                )}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;
