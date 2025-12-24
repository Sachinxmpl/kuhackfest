'use client';

import { useState } from 'react';
import { mockSession, currentUser } from '@/lib/mock-data';
import ChatWindow from '@/components/session/ChatWindow';
import RatingModal from '@/components/session/RatingModal';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { RatingFormData } from '@/lib/validator'; // fixed import path
import { useRouter } from 'next/navigation';
import { BeaconType } from '@/lib/types';

export default function SessionPage() {
    const router = useRouter();
    const [session] = useState(mockSession);
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
    const [sessionEnded, setSessionEnded] = useState(false);

    const isHelper = currentUser.id === session.helperId;
    // types use learner instead of requester
    const otherUser = isHelper ? session.learner ?? session.helper : session.helper ?? session.learner;

    const handleEndSession = () => {
        setSessionEnded(true);
        setIsRatingModalOpen(true);
    };

    const handleSubmitRating = async (data: RatingFormData) => {
        // Mock rating submission
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log('Rating submitted:', data);

        // Redirect to dashboard
        router.push('/dashboard');
    };

    return (
        <div className="min-h-screen bg-zinc-50">
            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="bg-white border border-zinc-200 rounded-lg p-6 shadow-sm mb-6">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <Badge variant={session.beacon?.type === BeaconType.URGENT ? 'warning' : 'default'}>
                                    {session.beacon?.type === BeaconType.URGENT ? 'Urgent' : 'Normal'}
                                </Badge>

                                {session.beacon?.type === BeaconType.URGENT && (
                                    <Badge variant="warning" className="gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        Urgent
                                    </Badge>
                                )}
                                {sessionEnded ? (
                                    <Badge variant="success" className="gap-1">
                                        <CheckCircle className="w-3 h-3" />
                                        Ended
                                    </Badge>
                                ) : (
                                    <Badge variant="info" className="gap-1">
                                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                                        Active
                                    </Badge>
                                )}
                            </div>
                            <h1 className="text-2xl font-bold text-zinc-900 mb-2">
                                {session.beacon?.title ?? session.beaconId}
                            </h1>
                            <p className="text-zinc-600">
                                {isHelper ? 'Helping' : 'Session with'}{' '}
                                <span className="font-medium">{otherUser?.name ?? 'Participant'}</span>
                            </p>
                        </div>

                        {!sessionEnded && (
                            <Button variant="danger" onClick={handleEndSession}>
                                End Session
                            </Button>
                        )}
                    </div>
                </div>

                {/* Chat window */}
                <ChatWindow
                    session={session}
                    currentUserId={currentUser.id}
                    onSendMessage={(content) => console.log('Send:', content)}
                />

                {/* Session ended message */}
                {sessionEnded && (
                    <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-green-800 text-center">
                            Session ended. Please rate your experience with {otherUser?.name ?? 'the participant'}.
                        </p>
                    </div>
                )}
            </div>

            {/* Rating modal */}
            <RatingModal
                isOpen={isRatingModalOpen}
                onClose={() => setIsRatingModalOpen(false)}
                recipientName={otherUser?.name ?? 'Participant'}
                onSubmit={handleSubmitRating}
            />
        </div>
    );
}