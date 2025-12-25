'use client';
import React from 'react';
import SessionHeader from './SessionHeader';
import ChatWindow from './ChatWindow';
import RatingModal from './RatingModal';
import type { Session } from '@/lib/types';
import { useUser } from '@/contexts/UserContext';
import { ChatMessage } from '@/lib/api';
import { API_BASE_URL } from '@/constants/constants';
import { RatingFormData } from '@/lib/validator';
import { useRouter } from 'next/navigation';

export default function ChatPane({
  session,
  onSendMessage,
  messages,
}: {
  session: Session;
  onSendMessage: (sessionId: string, content: string) => void;
  messages: ChatMessage[];
}) {
  const { user } = useUser();
  const router = useRouter();

  // Rating modal sample state (unchanged)
  const [isRatingOpen, setIsRatingOpen] = React.useState(false);

  const otherParticipant = session.learnerId === user?.id ? session.helper : session.learner;

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const handleEndSession = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/sessions/${session.id}/end`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token as string,
        },
      });

      const result = await response.json();

      if (!result.success) {
        console.error('Failed to end session:', result.error);
        return;
      }

      setIsRatingOpen(true);
    } catch (e) {
      console.error('Error ending session:', e);
    }
  };

  const handleSubmitRating = async (data: RatingFormData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token as string,
        },
        body: JSON.stringify({
          toUserId: otherParticipant?.id,
          sessionId: session.id,
          score: data.stars,
          comment: data.feedback,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        console.error('Failed to submit rating:', result.error);
        return;
      }

      setIsRatingOpen(false);
      router.push("/sessions")
    } catch (e) {
      console.error('Error submitting rating:', e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white shadow-sm overflow-hidden">
      <SessionHeader
        session={session}
        onEndSession={handleEndSession}
      />

      <div className="flex-1 p-4">
        <ChatWindow
          session={session}
          currentUserId={user?.id as string}
          messages={messages}
          onSendMessage={(content) => onSendMessage(session.id, content)}
        />
      </div>

      <RatingModal
        isOpen={isRatingOpen}
        onClose={() => setIsRatingOpen(false)}
        recipientName={otherParticipant?.name ?? 'Participant'}
        onSubmit={handleSubmitRating}
      />
    </div>
  );
}