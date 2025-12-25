'use client';

import { useState, useMemo, useEffect } from 'react';
import { Beacon, BeaconType } from '@/lib/types';
import { BeaconFormData } from '@/lib/validator';
import BeaconCard from '@/components/beacon/BeaconCard';
import BeaconFilter from '@/components/beacon/BeaconFilter';
import BeaconForm from '@/components/beacon/BeaconForm';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Plus, Lightbulb } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/constants/constants';

export default function DashboardPage() {
    const router = useRouter();

    const [beacons, setBeacons] = useState<Beacon[]>([]);
    const [beaconCreationError, setBeaconCreationError] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('');
    const [selectedType, setSelectedType] = useState<BeaconType | 'All'>('All');

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') as string : '';

    useEffect(() => {
        const getAllBeacons = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/beacons`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    },
                });

                const result = await response.json();

                if (!result.success) {
                    console.error("Failed to fetch beacons:", result.error);
                    return;
                }

                const beacons = (result.data as Beacon[]).map((b) => ({
                    ...b,
                    createdAt: new Date(b.createdAt),
                    expiresAt: b.expiresAt ? new Date(b.expiresAt) : undefined,
                }));

                setBeacons(beacons);
            } catch (e) {
                console.error("Failed to fetch beacons.")
                console.error(e);
            }
        }

        getAllBeacons();
    }, [token]);

    // Filter beacons
    const filteredBeacons = useMemo(() => {
        return beacons.filter((beacon) => {
            const matchesSearch =
                beacon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                beacon.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesTopic = !selectedTopic || beacon.title === selectedTopic;
            const matchesType = selectedType === 'All' || beacon.type === selectedType;

            return matchesSearch && matchesTopic && matchesType;
        });
    }, [beacons, searchQuery, selectedTopic, selectedType]);

    // Sort beacons - urgent first, then by date
    const sortedBeacons = useMemo(() => {
        return [...filteredBeacons].sort((a, b) => {
            // Urgent beacons first
            if (a.type === BeaconType.URGENT && b.type !== BeaconType.URGENT) return -1;
            if (a.type !== BeaconType.URGENT && b.type === BeaconType.URGENT) return 1;

            // Then by date (newest first)
            return b.createdAt.getTime() - a.createdAt.getTime();
        });
    }, [filteredBeacons]);

    const handleCreateBeacon = async (data: BeaconFormData) => {
        const newBeacon = {
            title: data.title,
            description: data.description,
            type: data.type,
            expiresInMinutes:
                data.type === BeaconType.URGENT ? data.urgentDuration : undefined,
            applications: [],
        };

        try {
            const token = localStorage.getItem('token') as string;

            const response = await fetch(`${API_BASE_URL}/beacons`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify(newBeacon),
            });

            const result = await response.json();

            if (!result.success) {
                setBeaconCreationError(result.error || 'Failed to create beacon');
                return;
            }

            const beacon = {
                ...result.data,
                createdAt: new Date(result.data.createdAt),
                expiresAt: result.data.expiresAt ? new Date(result.data.expiresAt) : undefined,
            }

            setIsCreateModalOpen(false);
            setBeacons([beacon, ...beacons]);
        } catch (e) {
            setBeaconCreationError("Failed to create beacon.")
            console.error("Failed to create beacon.", e)
        }
    };

    const handleApply = (beaconId: string) => {
        router.push(`/beacons/${beaconId}/apply`);
    };

    const handleView = (beaconId: string) => {
        router.push(`/beacons/${beaconId}`);
    };

    return (
        <div className="min-h-screen bg-zinc-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-zinc-900 flex items-center gap-2">
                            <Lightbulb className="w-8 h-8" />
                            Study Beacons
                        </h1>
                        <p className="text-zinc-600 mt-1">
                            Find help or offer your knowledge to others
                        </p>
                    </div>
                    <Button onClick={() => setIsCreateModalOpen(true)}>
                        <Plus className="w-5 h-5" />
                        Create Beacon
                    </Button>
                </div>

                {/* Filter */}
                <div className="mb-6">
                    <BeaconFilter
                        searchQuery={searchQuery}
                        selectedTopic={selectedTopic}
                        selectedType={selectedType}
                        onSearchChange={setSearchQuery}
                        onTopicChange={setSelectedTopic}
                        onTypeChange={setSelectedType}
                    />
                </div>

                {/* Beacons grid */}
                {sortedBeacons.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {sortedBeacons.map((beacon) => (
                            <BeaconCard
                                key={beacon.id}
                                beacon={beacon}
                                onApply={handleApply}
                                onView={handleView}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <Lightbulb className="w-16 h-16 mx-auto text-zinc-300 mb-4" />
                        <h3 className="text-lg font-medium text-zinc-900 mb-2">
                            No beacons found
                        </h3>
                        <p className="text-zinc-600 mb-4">
                            Try adjusting your filters or create a new beacon
                        </p>
                        <Button onClick={() => setIsCreateModalOpen(true)}>
                            <Plus className="w-5 h-5" />
                            Create Your First Beacon
                        </Button>
                    </div>
                )}
            </div>

            {/* Create beacon modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Create a Beacon"
                className="max-w-2xl"
            >
                <BeaconForm
                    onSubmit={handleCreateBeacon}
                    onCancel={() => setIsCreateModalOpen(false)}
                    error={beaconCreationError}
                />
            </Modal>
        </div>
    );
}