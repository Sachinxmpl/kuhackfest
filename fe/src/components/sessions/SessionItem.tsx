'use client';

import { useEffect, useState } from 'react';
import type { Session } from '@/lib/types';
import Badge from '@/components/ui/Badge';
import { User2 } from 'lucide-react';

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
  const other = session.participants?.[0] ?? null;
  const title = session.beacon?.title ?? other?.name ?? 'Conversation';
  const preview = session.lastMessage?.content ?? '';

  // Client-only formatted time to avoid SSR <-> CSR mismatch
  const [timeStr, setTimeStr] = useState<string>('');
  useEffect(() => {
    if (!session.lastMessage?.timestamp) {
      setTimeStr('');
      return;
    }
    // ensure we call toLocaleTimeString only in the browser
    try {
      const t = new Date(session.lastMessage.timestamp);
      setTimeStr(t.toLocaleTimeString());
    } catch {
      setTimeStr('');
    }
  }, [session.lastMessage?.timestamp]);

  // Render an invisible placeholder on the server so layout doesn't jump when client sets time
  const timeRender = timeStr ? (
    <div className="text-xs text-zinc-400 ml-2">{timeStr}</div>
  ) : (
    // invisible placeholder of similar width to avoid layout shift
    <div className="text-xs text-zinc-400 ml-2 invisible">00:00</div>
  );

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
            {timeRender}
          </div>
          <div className="text-xs text-zinc-500 truncate mt-1">{preview}</div>
        </div>
      </div>

      <div className="flex flex-col items-end">
        {session.unreadCount ? (
          <Badge variant="default" className="px-2 py-0.5 rounded-full text-xs">
            {session.unreadCount}
          </Badge>
        ) : (
          <div className="text-xs text-zinc-400">{/* placeholder for spacing */}</div>
        )}
      </div>
    </button>
  );
}