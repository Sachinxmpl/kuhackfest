// Badge component
import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
    size?: 'sm' | 'md';
}

export default function Badge({
    className,
    variant = 'default',
    size = 'md',
    children,
    ...props
}: BadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center font-medium rounded-full',
                {
                    // Variants
                    'bg-zinc-100 text-zinc-700': variant === 'default',
                    'bg-green-100 text-green-700': variant === 'success',
                    'bg-yellow-100 text-yellow-700': variant === 'warning',
                    'bg-red-100 text-red-700': variant === 'danger',
                    'bg-blue-100 text-blue-700': variant === 'info',

                    // Sizes
                    'px-2 py-0.5 text-xs': size === 'sm',
                    'px-2.5 py-1 text-sm': size === 'md',
                },
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
}
