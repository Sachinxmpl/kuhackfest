// MessageBubble component
import { Message } from '@/lib/types';
import { formatRelativeTime } from '@/lib/utils';

export interface MessageBubbleProps {
    message: Message;
    isCurrentUser: boolean;
    senderName: string;
}

export default function MessageBubble({
    message,
    isCurrentUser,
    senderName,
}: MessageBubbleProps) {
    return (
        <div
            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}
        >
            <div className={`max-w-[70%] ${isCurrentUser ? 'order-2' : 'order-1'}`}>
                {!isCurrentUser && (
                    <p className="text-xs text-zinc-500 mb-1 px-1">{senderName}</p>
                )}
                <div
                    className={`rounded-lg px-4 py-2 ${isCurrentUser
                            ? 'bg-zinc-900 text-white'
                            : 'bg-zinc-100 text-zinc-900'
                        }`}
                >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
                <p className="text-xs text-zinc-400 mt-1 px-1">
                    {formatRelativeTime(message.timestamp)}
                </p>
            </div>
        </div>
    );
}
