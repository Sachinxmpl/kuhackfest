'use client';

import { useRouter } from 'next/navigation';
import { use, useState, useEffect } from "react"
import { ApplicationFormData } from '@/lib/validator';
import ApplicationForm from '@/components/beacon/ApplicationForm';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Beacon } from '@/lib/types';
import { API_BASE_URL } from '@/constants/constants';

export default function ApplyPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id: beaconId } = use(params);

    const [beacon, setBeacon] = useState<Beacon | null>(null);
    const [_beaconFetchError, setBeaconFetchError] = useState<string | null>(null);
    const [_beaconApplyError, setBeaconApplyError] = useState<string | null>(null);

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    useEffect(() => {
        const getBeacon = async (id: string) => {
            try {
                const response = await fetch(`${API_BASE_URL}/beacons/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token as string,
                    },
                });

                const result = await response.json();

                if (!result.success) {
                    setBeaconFetchError(result.message || 'Failed to fetch beacon details.');
                    return;
                }

                setBeacon(result.data as Beacon);
            } catch (e) {
                setBeaconFetchError('An error occurred while fetching beacon details.');
                console.error(e);
            }
        }

        if (token) {
            getBeacon(beaconId);
        }
    }, [beaconId, token])

    const handleSubmit = async (data: ApplicationFormData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/beacons/${beaconId}/apply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token as string,
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!result.success) {
                setBeaconApplyError(result.message || 'Failed to submit application.');
                return;
            }

            // On success, redirect to beacon page
            router.push(`/beacons/${beaconId}`);
        } catch (e) {
            setBeaconApplyError('An error occurred while submitting your application.');
            console.error(e);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50">
            <div className="max-w-3xl mx-auto px-4 py-8">
                {/* Back button */}
                <Link href={`/beacons/${beacon?.id}`}>
                    <Button variant="ghost" size="sm" className="mb-6">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Beacon
                    </Button>
                </Link>

                {/* Page header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-zinc-900 mb-2">
                        Apply to Help
                    </h1>
                    <p className="text-zinc-600">
                        Submit your application to help with this beacon
                    </p>
                </div>

                {/* Beacon summary */}
                <div className="bg-white border border-zinc-200 rounded-lg p-5 shadow-sm mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant="info">{beacon?.status}</Badge>
                    </div>
                    <h2 className="text-xl font-semibold text-zinc-900 mb-2">
                        {beacon?.title}
                    </h2>
                    <p className="text-sm text-zinc-600 line-clamp-2">
                        {beacon?.description}
                    </p>
                </div>

                {/* Application form */}
                <div className="bg-white border border-zinc-200 rounded-lg p-6 shadow-sm">
                    <ApplicationForm
                        beaconId={beacon?.id as string}
                        onSubmit={handleSubmit}
                        onCancel={() => router.back()}
                    />
                </div>
            </div>
        </div>
    );
}
