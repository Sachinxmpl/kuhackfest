"use client"
import SessionList from "@/components/sessions/SessionList";
import type { Session } from '@/lib/types';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from "@/constants/constants";
import { useUser } from "@/contexts/UserContext";

export default function SessionLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { setCurrentSession } = useUser();

    const [sessions, setSessions] = useState<Session[]>();
    const [_sessionFetchError, setSessionFetchError] = useState<string | null>(null);
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);


    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    useEffect(() => {
        const fetchSessionsList = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/sessions`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token as string,
                    },
                });

                const result = await response.json();
                console.log(result)

                if (!result.success) {
                    setSessionFetchError(result.error || 'Failed to fetch sessions');
                    return;
                }

                setSessions(result.data);
            } catch (e) {
                console.error('Failed to fetch sessions list', e);
                setSessionFetchError('Failed to fetch sessions');
            }
        }

        if (token)
            fetchSessionsList();
    }, [token])

    const handleSelect = (id: string) => {
        setSelectedSessionId(id);
        setCurrentSession(sessions?.find(s => s.id === id) || null);
        router.push(`/sessions/${id}`);
    };

    return (
        <div className="h-[calc(100vh-64px)]">
            <div className="flex h-full border bg-zinc-50">
                <aside className="w-84 border-r bg-white">
                    <SessionList
                        sessions={sessions || []}
                        selectedId={selectedSessionId}
                        onSelect={handleSelect}
                    />
                </aside>
                {children}
            </div>
        </div>
    );
}