// CountdownTimer component for urgent beacons
'use client';
import { useEffect, useState } from 'react';
import { getTimeRemaining, formatCountdown } from '@/lib/utils';
import { Clock } from 'lucide-react';

export interface CountdownTimerProps {
    targetDate: Date;
    onExpire?: () => void;
}

export default function CountdownTimer({ targetDate, onExpire }: CountdownTimerProps) {
    const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining(new Date(targetDate)));
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        queueMicrotask(() => setMounted(true));

        const timer = setInterval(() => {
            const remaining = getTimeRemaining(new Date(targetDate));
            setTimeRemaining(remaining);
            if (remaining.isExpired && onExpire) {
                onExpire();
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate, onExpire]);

    // Don't render anything until mounted to avoid hydration mismatch
    if (!mounted) {
        return (
            <span className="flex items-center gap-1 text-sm text-orange-600 font-medium">
                <Clock className="w-4 h-4" />
                <span className="w-16">Loading...</span>
            </span>
        );
    }

    if (timeRemaining.isExpired) {
        return (
            <span className="flex items-center gap-1 text-sm text-red-600 font-medium">
                <Clock className="w-4 h-4" />
                Expired
            </span>
        );
    }

    return (
        <span className="flex items-center gap-1 text-sm text-orange-600 font-medium">
            <Clock className="w-4 h-4" />
            {formatCountdown(timeRemaining.hours, timeRemaining.minutes, timeRemaining.seconds)}
        </span>
    );
}