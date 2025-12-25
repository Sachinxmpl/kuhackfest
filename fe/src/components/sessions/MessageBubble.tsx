import { Message } from '@/lib/types';
import useRelativeTime from '@/lib/hooks/useRelativeTime';
import { ChatMessage } from '@/lib/api';

export interface MessageBubbleProps {
  message: ChatMessage;
  isCurrentUser: boolean;
  senderName: string;
}

export default function MessageBubble({
  message,
  isCurrentUser,
  senderName,
}: MessageBubbleProps) {
  // compute relative time on client only
  const timeLabel = useRelativeTime(message.createdAt);

  // stable server-side placeholder to avoid hydration mismatch
  const timeRender = timeLabel ? (
    <span>{timeLabel}</span>
  ) : (
    // invisible placeholder so the server layout matches the client before hydration
    <span className="invisible">just now</span>
  );

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[70%] ${isCurrentUser ? 'order-2' : 'order-1'}`}>
        {!isCurrentUser && <p className="text-xs text-zinc-500 mb-1 px-1">{senderName}</p>}

        <div
          className={`rounded-lg px-4 py-2 ${isCurrentUser ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-900'}`}
        >
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>

        <p className="text-xs text-zinc-400 mt-1 px-1">{timeRender}</p>
      </div>
    </div>
  );
}