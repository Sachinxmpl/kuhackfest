"use client"
import ChatPane from "@/components/sessions/ChatPane";
import { useUser } from "@/contexts/UserContext";
import { ChatMessage, socketManager } from "@/lib/api";
import { useState, useEffect } from "react";

export default function SessionChatPage() {
    const { currentSession, user } = useUser();

    const [messages, setMessages] = useState<ChatMessage[]>([])

    useEffect(() => {
        if (!currentSession?.id || !user?.id) return;

        socketManager.joinSession(currentSession.id);

        const handle = (msg: ChatMessage) => {
            if (msg.sessionId === currentSession.id &&  msg.senderId !== user.id) {
                setMessages(prev => [...prev, msg]);
            }
        };

        socketManager.onNewMessage(handle);

        return () => {
            socketManager.leaveSession(currentSession.id);
            socketManager.getSocket()?.off("new-message", handle);
        };
    }, [currentSession, user]);

    // onSendMessage updates only the session whose id matches
    const handleSendMessage = (sessionId: string, content: string) => {
        if (!content.trim()) return;

        socketManager.sendMessage(sessionId, content);
        
        setMessages(prevMessages => [...prevMessages, {
            id: Date.now().toString(), // Temporary ID
            sessionId,
            senderId: user?.id as string,
            content: content.trim(),
            createdAt: new Date(),
            sender: {
                id: user?.id as string,
                name: user?.profile?.name as string,
            },
        }]);
    };

    return (
        <main className="flex-1">
            {currentSession ? (
                <ChatPane
                    session={currentSession}
                    onSendMessage={handleSendMessage}
                    messages={messages}
                />
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-zinc-400">
                    <p className="mb-2 font-medium">No conversation selected</p>
                    <p className="text-sm">Choose someone on the left to open their session</p>
                </div>
            )}
        </main>
    );
}