'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ChatPane from './ChatPane';
import { mockSessions, currentUser } from '@/lib/mock-data';
import type { Session } from '@/lib/types';
import { generateId } from '@/lib/utils';

export default function SessionsLayout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlSid = searchParams?.get('sid') ?? null;

  // Keep a local copy of sessions in state (clone messages arrays to avoid mutating the original mock)
  const [sessions, setSessions] = useState<Session[]>(
    () => mockSessions.map((s) => ({ ...s, messages: s.messages ? [...s.messages] : [] }))
  );

  const sessionsById = useMemo(() => {
    const map = new Map<string, Session>();
    for (const s of sessions) map.set(s.id, s);
    return map;
  }, [sessions]);

  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    () => urlSid ?? (sessions[0]?.id ?? null)
  );

  useEffect(() => {
    if (urlSid && urlSid !== selectedSessionId && sessionsById.has(urlSid)) {
      setSelectedSessionId(urlSid);
    }
  }, [urlSid, selectedSessionId, sessionsById]);

  const handleSelect = (id: string) => {
    setSelectedSessionId(id);
    router.push(`/session?sid=${id}`);
  };

  // onSendMessage updates only the session whose id matches
  const handleSendMessage = (sessionId: string, content: string) => {
    if (!content.trim()) return;

    const newMessage = {
      id: generateId(),
      sessionId,
      senderId: currentUser.id,
      content: content.trim(),
      timestamp: new Date(),
    };

    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? {
            ...s,
            messages: [...(s.messages ?? []), newMessage],
            lastMessage: {
              id: newMessage.id,
              senderId: newMessage.senderId,
              content: newMessage.content,
              timestamp: newMessage.timestamp,
            },
            // if the session isn't currently selected, increment unreadCount; else keep 0
            unreadCount: s.id === selectedSessionId ? 0 : (s.unreadCount ?? 0) + 1,
          }
          : s
      )
    );
  };

  const selectedSession = selectedSessionId ? sessionsById.get(selectedSessionId) ?? null : null;

  return (
    <main className="flex-1">
      {selectedSession ? (
        <ChatPane session={selectedSession} onSendMessage={handleSendMessage} />
      ) : (
        <div className="h-full flex flex-col items-center justify-center text-zinc-400">
          <p className="mb-2 font-medium">No conversation selected</p>
          <p className="text-sm">Choose someone on the left to open their session</p>
        </div>
      )}
    </main>
  );
}