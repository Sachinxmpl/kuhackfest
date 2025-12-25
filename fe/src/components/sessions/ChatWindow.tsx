'use client';

import { useState, useRef, useEffect } from 'react';
import type { Session } from '@/lib/types';
import MessageBubble from './MessageBubble';
import Button from '@/components/ui/Button';
import { Send, AlertCircle } from 'lucide-react';
import { ChatMessage } from '@/lib/api';

export interface ChatWindowProps {
  session: Session;
  currentUserId: string;
  onSendMessage?: (content: string) => void; // session id already bound by ChatPane
  messages: ChatMessage[];
}

export default function ChatWindow({ session, currentUserId, onSendMessage, messages }: ChatWindowProps) {
  // Do not keep a long-lived separate messages source that diverges.
  // Read messages from session.messages so they reflect the centralized store.
  // const messages = session.messages ?? [];

  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, session.id]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    onSendMessage?.(inputValue.trim());
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-130 bg-white border border-zinc-200 rounded-lg overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-zinc-500">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 text-zinc-300" />
              <p>No messages yet. Start the conversation!</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message: ChatMessage) => {
              const isCurrentUser = message.senderId === currentUserId;
              const senderName = message.senderId === session.helperId ? session.helper?.name ?? 'Helper' : session.learner?.name ?? 'Learner';

              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isCurrentUser={isCurrentUser}
                  senderName={senderName} />
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="border-t border-zinc-200 p-4">
        <div className="flex gap-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            rows={2}
            className="flex-1 px-3 py-2 border border-zinc-300 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent resize-none"
          />
          <Button onClick={handleSend} disabled={!inputValue.trim()} className="self-end">
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}