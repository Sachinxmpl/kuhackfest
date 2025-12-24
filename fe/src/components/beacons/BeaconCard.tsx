// BeaconCard component
import { Beacon } from '@/lib/types';
import { formatRelativeTime, truncate } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import CountdownTimer from './CountdownTimer';
import { AlertCircle, User } from 'lucide-react';
import Image from 'next/image';

export interface BeaconCardProps {
    beacon: Beacon;
    onApply?: (beaconId: string) => void;
    onView?: (beaconId: string) => void;
}

export default function BeaconCard({ beacon, onApply, onView }: BeaconCardProps) {
    const isUrgent = beacon.type === 'Urgent';

    return (
        <div
            className={`bg-white border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow ${isUrgent ? 'border-orange-200 bg-orange-50/30' : 'border-zinc-200'
                }`}
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <Badge size="sm" variant={isUrgent ? 'warning' : 'default'}>
                            {beacon.topic}
                        </Badge>
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
                <div className="relative w-6 h-6 rounded-full overflow-hidden bg-zinc-100 flex-shrink-0">
                    {beacon.owner.avatar ? (
                        <Image
                            src={beacon.owner.avatar}
                            alt={beacon.owner.name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <User className="w-6 h-6 p-1 text-zinc-600" />
                    )}
                </div>
                <span className="text-sm text-zinc-600">{beacon.owner.name}</span>
                <span className="text-sm text-zinc-400">•</span>
                <span className="text-sm text-zinc-500">
                    {formatRelativeTime(beacon.createdAt)}
                </span>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
                {isUrgent && beacon.expiresAt ? (
                    <CountdownTimer targetDate={beacon.expiresAt} />
                ) : (
                    <div className="text-sm text-zinc-500">
                        {beacon.applicants.length} applicant{beacon.applicants.length !== 1 ? 's' : ''}
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
