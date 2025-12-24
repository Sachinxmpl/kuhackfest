'use client';

import type { Session } from '@/lib/types';
import SessionItem from './SessionItem';

export default function SessionList({
  sessions,
  selectedId,
  onSelect,
}: {
  sessions: Session[];
  selectedId?: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Sessions</h2>
        <p className="text-xs text-zinc-500 mt-1">People you have active sessions with</p>
      </div>

      <div>
        {sessions.map((s) => (
          <SessionItem key={s.id} session={s} selected={s.id === selectedId} onClick={() => onSelect(s.id)} />
        ))}
      </div>
    </div>
  );
}