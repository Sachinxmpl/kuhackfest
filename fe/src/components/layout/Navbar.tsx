// Navigation bar component
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Button from '@/components/ui/Button';
import { Lightbulb, User, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navbar() {
    const pathname = usePathname();

    // Don't show navbar on auth pages or landing page
    if (pathname === '/' || pathname==="/login" || pathname==="/signup") {
        return null;
    }

    const navLinks = [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/profile', label: 'Profile' },
        { href: '/sessions', label: 'Sessions' },
    ];

    return (
        <nav className="bg-white border-b border-zinc-200 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/dashboard" className="flex items-center gap-2 font-bold text-zinc-900">
                        <div className="w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center">
                            <Lightbulb className="w-5 h-5 text-white" />
                        </div>
                        Study Match
                    </Link>

                    {/* Nav links */}
                    <div className="flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    'text-sm font-medium transition-colors hover:text-zinc-900',
                                    pathname === link.href ? 'text-zinc-900' : 'text-zinc-600'
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {/* User menu */}
                        <div className="flex items-center gap-2 pl-4 border-l border-zinc-200">
                            <Link href="/profile">
                                <Button size="sm" variant="ghost">
                                    <User className="w-4 h-4" />
                                </Button>
                            </Link>
                            <Link href="/">
                                <Button size="sm" variant="ghost">
                                    <LogOut className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
