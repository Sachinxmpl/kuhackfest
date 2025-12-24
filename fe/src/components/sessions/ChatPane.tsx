'use client';
import React from 'react';
import SessionHeader from './SessionHeader';
import ChatWindow from './ChatWindow';
import RatingModal from './RatingModal';
import type { Session } from '@/lib/types';

export default function ChatPane({
  session,
  onSendMessage,
}: {
  session: Session;
  onSendMessage: (sessionId: string, content: string) => void;
}) {
  // Rating modal sample state (unchanged)
  const [isRatingOpen, setIsRatingOpen] = React.useState(false);

  const otherParticipant = session.participants?.find((p) => p.userId !== session.learnerId && p.userId !== session.helperId) ?? session.participants?.[0];

  const handleEndSession = () => {
    setIsRatingOpen(true);
  };

  const handleSubmitRating = async (data: any) => {
    console.log('rating submit', data);
    setIsRatingOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm overflow-hidden">
      <SessionHeader session={session} />

      <div className="flex-1 p-4">
        <ChatWindow
          session={session}
          currentUserId={session.learnerId /* or import currentUser if needed */}
          onSendMessage={(content) => onSendMessage(session.id, content)}
        />
      </div>

      <RatingModal
        isOpen={isRatingOpen}
        onClose={() => setIsRatingOpen(false)}
        recipientName={otherParticipant?.name ?? 'Participant'}
        onSubmit={handleSubmitRating}
      />

      <div className="p-4 border-t text-right">
        <button
          onClick={handleEndSession}
          className="inline-flex items-center px-4 py-2 border rounded-md text-sm text-white bg-red-600 hover:bg-red-700"
        >
          End Session
        </button>
      </div>
    </div>
  );
}