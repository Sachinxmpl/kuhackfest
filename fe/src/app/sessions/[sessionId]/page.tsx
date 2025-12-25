"use client"
import ChatPane from "@/components/sessions/ChatPane";
import { useUser } from "@/contexts/UserContext";
import { ChatMessage, socketManager } from "@/lib/api";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/constants/constants";

export default function SessionChatPage() {
    const { currentSession, user } = useUser();

    const [messages, setMessages] = useState<ChatMessage[]>([])

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    useEffect(() => {
        if (!currentSession?.id || !user?.id) return;

        socketManager.joinSession(currentSession.id);

        const handle = (msg: ChatMessage) => {
            if (msg.sessionId === currentSession.id && msg.senderId !== user.id) {
                setMessages(prev => [...prev, msg]);
            }
        };

        socketManager.onNewMessage(handle);

        return () => {
            socketManager.leaveSession(currentSession.id);
            socketManager.getSocket()?.off("new-message", handle);
        };
    }, [currentSession, user]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/sessions/${currentSession?.id}/messages`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token as string,
                    },
                });

                const result = await response.json();

                if (!result.success) {
                    console.error("Failed to fetch messages:", result.error);
                    return;
                }

                setMessages(result.data || []);
            } catch (e) {
                console.error("Failed to fetch messages:", e);
            }
        }

        if (token && currentSession?.id)
            fetchMessages();
    }, [currentSession, token]);

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