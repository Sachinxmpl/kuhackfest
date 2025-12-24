'use client';

import { useRouter } from 'next/navigation';
import {use} from "react"
import { mockBeacons, currentUser } from '@/lib/mock-data';
import { ApplicationFormData } from '@/lib/validator';
import { generateId } from '@/lib/utils';
import ApplicationForm from '@/components/beacon/ApplicationForm';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ApplyPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id: beaconId } = use(params);
    const beacon = mockBeacons.find((b) => b.id === beaconId) || mockBeacons[0];

    const handleSubmit = async (data: ApplicationFormData) => {
        // Mock application submission
        await new Promise((resolve) => setTimeout(resolve, 1000));

        console.log('Application submitted:', {
            beaconId: beacon.id,
            helperId: currentUser.id,
            message: data.message,
        });

        // Redirect back to beacon details
        router.push(`/beacons/${beacon.id}`);
    };

    return (
        <div className="min-h-screen bg-zinc-50">
            <div className="max-w-3xl mx-auto px-4 py-8">
                {/* Back button */}
                <Link href={`/beacons/${beacon.id}`}>
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
                        <Badge variant="info">{beacon.status}</Badge>
                    </div>
                    <h2 className="text-xl font-semibold text-zinc-900 mb-2">
                        {beacon.title}
                    </h2>
                    <p className="text-sm text-zinc-600 line-clamp-2">
                        {beacon.description}
                    </p>
                </div>

                {/* Application form */}
                <div className="bg-white border border-zinc-200 rounded-lg p-6 shadow-sm">
                    <ApplicationForm
                        beaconId={beacon.id}
                        onSubmit={handleSubmit}
                        onCancel={() => router.back()}
                    />
                </div>
            </div>
        </div>
    );
}
