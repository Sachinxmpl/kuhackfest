// Modal component
'use client';

import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { useEffect, ReactNode } from 'react';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    className?: string;
}

export default function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className={cn(
                    'relative w-full max-w-lg bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto',
                    className
                )}
            >
                {/* Header */}
                {title && (
                    <div className="flex items-center justify-between p-6 border-b border-zinc-200">
                        <h2 className="text-xl font-semibold text-zinc-900">{title}</h2>
                        <button
                            onClick={onClose}
                            className="text-zinc-500 hover:text-zinc-700 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* Close button for no-title modals */}
                {!title && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-700 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}

                {/* Content */}
                <div className={cn('p-6', title && 'pt-4')}>
                    {children}
                </div>
            </div>
        </div>
    );
}
