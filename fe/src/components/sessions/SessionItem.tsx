'use client';

import type { Session } from '@/lib/types';
import { User2 } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

/**
 * Session list item — shows the "other" participant (name/avatar),
 * last message preview and unread badge. Click to open.
 *
 * Avoids SSR/CSR mismatch by formatting time on the client only.
 */
export default function SessionItem({
  session,
  selected,
  onClick,
}: {
  session: Session;
  selected?: boolean;
  onClick: () => void;
}) {
  const { user } = useUser();

  const other = session.helperId === user?.id ? session.learner : session.helper;
  const title = session.beacon?.title ?? other?.name ?? 'Conversation';

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 border-b flex items-center justify-between gap-3 hover:bg-zinc-50 ${selected ? 'bg-zinc-100' : 'bg-white'
        }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className='rounded-full border border-gray-300'>
          <User2 className='w-12 h-12 p-2 rounded-full object-cover text-gray-300' />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="font-medium truncate text-gray-700">{other?.name ?? title}</div>
          </div>
        </div>
      </div>
    </button>
  );
}