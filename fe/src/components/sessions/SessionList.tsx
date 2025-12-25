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
        <h2 className="text-lg font-semibold text-black">Sessions</h2>
      </div>

      <div>
        {sessions && sessions.length > 0 ? sessions.map((s) => (
          <SessionItem
            key={s.id}
            session={s}
            selected={s.id === selectedId}
            onClick={() => onSelect(s.id)}
          />
        ))
          : (
            <div>
              <p className="p-4 text-sm text-zinc-500">No sessions available.</p>
            </div>
          )}
      </div>
    </div>
  );
}