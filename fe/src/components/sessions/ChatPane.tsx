'use client';
import React from 'react';
import SessionHeader from './SessionHeader';
import ChatWindow from './ChatWindow';
import RatingModal from './RatingModal';
import type { Session } from '@/lib/types';
import { useUser } from '@/contexts/UserContext';
import { ChatMessage } from '@/lib/api';

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

  // Rating modal sample state (unchanged)
  const [isRatingOpen, setIsRatingOpen] = React.useState(false);

  const otherParticipant = session.learnerId === user?.id ? session.helper : session.learner;

  const handleEndSession = () => {
    setIsRatingOpen(true);
  };

  const handleSubmitRating = async (data: any) => {
    setIsRatingOpen(false);
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