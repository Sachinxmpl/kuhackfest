// ChatWindow component
'use client';

import { useState, useRef, useEffect } from 'react';
import { Session, Message } from '@/lib/types';
import MessageBubble from './MessageBubble';
import Button from '@/components/ui/Button';
import { Send, AlertCircle } from 'lucide-react';
import { generateId } from '@/lib/utils';

export interface ChatWindowProps {
    session: Session;
    currentUserId: string;
    onSendMessage?: (content: string) => void;
}

export default function ChatWindow({
    session,
    currentUserId,
    onSendMessage,
}: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>(session.messages);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const newMessage: Message = {
            id: generateId(),
            sessionId: session.id,
            senderId: currentUserId,
            content: inputValue.trim(),
            timestamp: new Date(),
        };

        setMessages([...messages, newMessage]);
        setInputValue('');
        onSendMessage?.(inputValue.trim());
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-[600px] bg-white border border-zinc-200 rounded-lg">
            {/* Messages area */}
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
                        {messages.map((message) => {
                            const isCurrentUser = message.senderId === currentUserId;
                            const senderName =
                                message.senderId === session.helperId
                                    ? session.helper.name
                                    : session.requester.name;

                            return (
                                <MessageBubble
                                    key={message.id}
                                    message={message}
                                    isCurrentUser={isCurrentUser}
                                    senderName={senderName}
                                />
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Input area */}
            <div className="border-t border-zinc-200 p-4">
                <div className="flex gap-2">
                    <textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        rows={2}
                        className="flex-1 px-3 py-2 border border-zinc-300 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent resize-none"
                    />
                    <Button
                        onClick={handleSend}
                        disabled={!inputValue.trim()}
                        className="self-end"
                    >
                        <Send className="w-5 h-5" />
                    </Button>
                </div>
                <p className="text-xs text-zinc-500 mt-2">
                    Press Enter to send, Shift + Enter for new line
                </p>
            </div>
        </div>
    );
}
