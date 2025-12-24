// Utility functions
import { type ClassValue, clsx } from 'clsx';

// Merge class names using clsx
export function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

// Format date to relative time
export function formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
        return 'just now';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
        return `${diffInWeeks} week${diffInWeeks !== 1 ? 's' : ''} ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
}

// Calculate time remaining until a date
export function getTimeRemaining(targetDate: Date): {
    total: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
} {
    const now = new Date();
    const total = targetDate.getTime() - now.getTime();

    if (total <= 0) {
        return { total: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);

    return { total, hours, minutes, seconds, isExpired: false };
}

// Format countdown timer
export function formatCountdown(hours: number, minutes: number, seconds: number): string {
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
}

// Truncate text
export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
}

// Generate random ID (for mock data)
export function generateId(): string {
    return Math.random().toString(36).substring(2, 9);
}

// Format rating
export function formatRating(rating: number): string {
    return rating.toFixed(1);
}
