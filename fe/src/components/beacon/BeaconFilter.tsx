// BeaconFilter component for filtering beacons
'use client';

import { topicOptions } from '@/lib/mock-data';
import { BeaconType } from '@/lib/types';
import { Search } from 'lucide-react';

export interface BeaconFilterProps {
    searchQuery: string;
    selectedTopic: string;
    selectedType: BeaconType | 'All';
    onSearchChange: (query: string) => void;
    onTopicChange: (topic: string) => void;
    onTypeChange: (type: BeaconType | 'All') => void;
}

export default function BeaconFilter({
    searchQuery,
    selectedTopic,
    selectedType,
    onSearchChange,
    onTopicChange,
    onTypeChange,
}: BeaconFilterProps) {
    return (
        <div className="bg-white border border-zinc-200 rounded-lg p-4 shadow-sm space-y-4">
            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search beacons..."
                    className="w-full pl-10 pr-4 py-2 border border-zinc-300 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Topic filter */}
                <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                        Topic
                    </label>
                    <select
                        value={selectedTopic}
                        onChange={(e) => onTopicChange(e.target.value)}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                    >
                        <option value="">All Topics</option>
                        {topicOptions.map((topic) => (
                            <option key={topic} value={topic}>
                                {topic}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Type filter */}
                <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                        Type
                    </label>
                    <select
                        value={selectedType}
                        onChange={(e) => onTypeChange(e.target.value as BeaconType | 'All')}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-lg text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                    >
                        <option value="All">All Types</option>
                        <option value="Normal">Normal</option>
                        <option value="Urgent">Urgent</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
