"use client"
import ChatPane from "@/components/sessions/ChatPane";
import { useUser } from "@/contexts/UserContext";

// interface SessionChatPageProps {
//     params: Promise<{
//         sessionId: string;
//     }>;
// }

export default function SessionChatPage() {
    const { currentSession } = useUser();

    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

    // onSendMessage updates only the session whose id matches
    const handleSendMessage = (sessionId: string, content: string) => {
        if (!content.trim()) return;

        // const newMessage = {
        //     id: generateId(),
        //     sessionId,
        //     senderId: currentUser.id,
        //     content: content.trim(),
        //     timestamp: new Date(),
        // };
    };

    return (
        <main className="flex-1">
            {currentSession ? (
                <ChatPane
                    session={currentSession}
                    onSendMessage={handleSendMessage}
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