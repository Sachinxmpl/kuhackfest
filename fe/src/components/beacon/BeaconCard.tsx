// BeaconCard component
'use client';
import { Beacon, BeaconType } from '@/lib/types';
import { formatRelativeTime, truncate } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import CountdownTimer from './CountdownTimer';
import { AlertCircle, User } from 'lucide-react';
import { useState, useEffect } from 'react';

export interface BeaconCardProps {
    beacon: Beacon;
    onApply?: (beaconId: string) => void;
    onView?: (beaconId: string) => void;
}

export default function BeaconCard({ beacon, onApply, onView }: BeaconCardProps) {
    const [relativeTime, setRelativeTime] = useState<string>('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setRelativeTime(formatRelativeTime(beacon.createdAt));
    }, [beacon.createdAt]);

    const isUrgent = beacon.type === BeaconType.URGENT;

    return (
        <div
            className={`bg-white border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow ${
                isUrgent ? 'border-orange-200 bg-orange-50/30' : 'border-zinc-200'
            }`}
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant="info">{beacon.status}</Badge>
                        {isUrgent && (
                            <Badge size="sm" variant="warning" className="gap-1">
                                <AlertCircle className="w-3 h-3" />
                                Urgent
                            </Badge>
                        )}
                    </div>
                    <h3
                        className="text-lg font-semibold text-zinc-900 hover:text-zinc-700 cursor-pointer"
                        onClick={() => onView?.(beacon.id)}
                    >
                        {beacon.title}
                    </h3>
                </div>
            </div>

            {/* Description */}
            <p className="text-sm text-zinc-600 mb-4 line-clamp-2">
                {truncate(beacon.description, 150)}
            </p>

            {/* Owner info */}
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-zinc-200">
                <div className="relative w-6 h-6 rounded-full overflow-hidden bg-zinc-100 flex-shrink-0 flex items-center justify-center">
                    {beacon.creator?.profile?.name ? (
                        <span className="text-xs font-medium text-zinc-600">
                            {beacon.creator.profile.name.charAt(0).toUpperCase()}
                        </span>
                    ) : (
                        <User className="w-4 h-4 text-zinc-600" />
                    )}
                </div>
                <span className="text-sm text-zinc-600">
                    {beacon.creator?.profile?.name || 'Anonymous'}
                </span>
                <span className="text-sm text-zinc-400">•</span>
                <span className="text-sm text-zinc-500" suppressHydrationWarning>
                    {mounted ? relativeTime || 'just now' : 'just now'}
                </span>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
                {isUrgent && beacon.expiresAt ? (
                    <CountdownTimer targetDate={beacon.expiresAt} />
                ) : (
                    <div className="text-sm text-zinc-500">
                        {beacon.applications?.length || 0} applicant
                        {(beacon.applications?.length || 0) !== 1 ? 's' : ''}
                    </div>
                )}
                <Button
                    size="sm"
                    onClick={() => onApply?.(beacon.id)}
                    variant={isUrgent ? 'primary' : 'outline'}
                >
                    Apply to Help
                </Button>
            </div>
        </div>
    );
}