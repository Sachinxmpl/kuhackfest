// lib/message.store.ts

export interface InMemoryMessage {
    id: string;
    sessionId: string;
    senderId: string;
    content: string;
    createdAt: Date;
    sender: {
        name: string;
        id: string;
        // Add avatar if you have it in profile
    };
}

class MessageStore {
    // Maps sessionId -> Array of Messages
    private store: Map<string, InMemoryMessage[]>;

    constructor() {
        this.store = new Map();
    }

    // Initialize an empty array when a session is created
    initSession(sessionId: string) {
        if (!this.store.has(sessionId)) {
            this.store.set(sessionId, []);
        }
    }

    addMessage(sessionId: string, message: InMemoryMessage) {
        if (!this.store.has(sessionId)) {
            this.initSession(sessionId);
        }
        const sessionMessages = this.store.get(sessionId)!;
        sessionMessages.push(message);
    }

    getMessages(sessionId: string): InMemoryMessage[] {
        return this.store.get(sessionId) || [];
    }

    // Optional: Clean up memory when session ends
    clearSession(sessionId: string) {
        this.store.delete(sessionId);
    }
}

// Export a single instance (Singleton)
export const messageStore = new MessageStore();