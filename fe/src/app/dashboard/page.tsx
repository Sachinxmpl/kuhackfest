// Dashboard page - main beacon feed
'use client';

import { useState, useMemo } from 'react';
import { mockBeacons, currentUser } from '@/lib/mock-data';
import { Beacon, BeaconStatus, BeaconType } from '@/lib/types';
import { BeaconFormData } from '@/lib/validator';
import BeaconCard from '@/components/beacons/BeaconCard';
import BeaconFilter from '@/components/beacons/BeaconFilter';
import BeaconForm from '@/components/beacons/BeaconForm';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { Plus, Lightbulb } from 'lucide-react';
import { generateId } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const router = useRouter();
    const [beacons, setBeacons] = useState<Beacon[]>(mockBeacons);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTopic, setSelectedTopic] = useState('');
    const [selectedType, setSelectedType] = useState<BeaconType | 'All'>('All');

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
            if (a.type === BeaconType.URGENT && b.type !== BeaconType.NORMAL) return -1;
            if (a.type !== BeaconType.NORMAL && b.type === BeaconType.URGENT) return 1;

            // Then by date (newest first)
            return b.createdAt.getTime() - a.createdAt.getTime();
        });
    }, [filteredBeacons]);

    const handleCreateBeacon = async (data: BeaconFormData) => {
        // Mock create - simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const newBeacon: Beacon = {
            id: generateId(),
            creatorId: currentUser.id,
            title: data.title,
            description: data.description,
            // topic: data.topic,
            type: data.type,
            status: BeaconStatus.OPEN,
            createdAt: new Date(),
            expiresAt:
                data.type === BeaconType.URGENT && data.urgentDuration
                    ? new Date(Date.now() + data.urgentDuration * 60 * 1000)
                    : undefined,
            applications: [],
        };

        setBeacons([newBeacon, ...beacons]);
        setIsCreateModalOpen(false);
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
                />
            </Modal>
        </div>
    );
}
