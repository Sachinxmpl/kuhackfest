'use client';

import { Session } from '@/lib/types';
import Button from '@/components/ui/Button';
import { currentUser } from '@/lib/mock-data';

export default function SessionHeader({ session }: { session: Session }) {
  const other =
    session.participants?.find((p) => p.userId !== currentUser.id) ??
    session.participants?.[0];

  const isHelper = currentUser.id === session.helperId;
  const actionLabel = isHelper ? 'End Session' : 'Request Help';

  return (
    <div className="flex items-center justify-between p-4 border-b bg-white">
      <div className="flex items-center gap-3">
        <img
          src={other?.avatarUrl ?? '/images/avatar-placeholder.png'}
          className="w-10 h-10 rounded-full object-cover"
          alt=""
        />
        <div>
          <div className="font-medium">{other?.name ?? 'Participant'}</div>
          <div className="text-xs text-zinc-500">{session.beacon?.title ?? 'No topic'}</div>
        </div>
      </div>

      <div>
        <Button onClick={() => console.log('action clicked', session.id)} size="sm" variant="outline">
          {actionLabel}
        </Button>
      </div>
    </div>
  );
}