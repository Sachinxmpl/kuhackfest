// TagInput component for adding/removing tags
'use client';

import { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Badge from '@/components/ui/Badge';

export interface TagInputProps {
    label?: string;
    tags: string[];
    suggestions?: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
    error?: string;
    maxTags?: number;
}

export default function TagInput({
    label,
    tags,
    suggestions = [],
    onChange,
    placeholder = 'Type and press Enter',
    error,
    maxTags,
}: TagInputProps) {
    const [input, setInput] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const filteredSuggestions = suggestions.filter(
        (suggestion) =>
            !tags.includes(suggestion) &&
            suggestion.toLowerCase().includes(input.toLowerCase())
    );

    const addTag = (tag: string) => {
        const trimmedTag = tag.trim();
        if (trimmedTag && !tags.includes(trimmedTag)) {
            if (!maxTags || tags.length < maxTags) {
                onChange([...tags, trimmedTag]);
                setInput('');
            }
        }
    };

    const removeTag = (tagToRemove: string) => {
        onChange(tags.filter((tag) => tag !== tagToRemove));
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && input) {
            e.preventDefault();
            addTag(input);
        } else if (e.key === 'Backspace' && !input && tags.length > 0) {
            removeTag(tags[tags.length - 1]);
        }
    };

    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                    {label}
                </label>
            )}

            <div
                className={cn(
                    'min-h-[42px] px-3 py-2 border rounded-lg focus-within:ring-2 focus-within:ring-zinc-900 focus-within:border-transparent transition-shadow',
                    error ? 'border-red-500' : 'border-zinc-300'
                )}
            >
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <Badge key={tag} variant="default" className="gap-1">
                            {tag}
                            <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="hover:text-zinc-900"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </Badge>
                    ))}

                    <input
                        type="text"
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            setShowSuggestions(e.target.value.length > 0);
                        }}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setShowSuggestions(input.length > 0)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        placeholder={tags.length === 0 ? placeholder : ''}
                        className="flex-1 min-w-[120px] outline-none text-zinc-900 placeholder:text-zinc-400"
                        disabled={maxTags !== undefined && tags.length >= maxTags}
                    />
                </div>
            </div>

            {/* Suggestions dropdown */}
            {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="mt-1 bg-white border border-zinc-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {filteredSuggestions.map((suggestion) => (
                        <button
                            key={suggestion}
                            type="button"
                            onClick={() => addTag(suggestion)}
                            className="w-full px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            )}

            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            {maxTags && (
                <p className="mt-1 text-sm text-zinc-500">
                    {tags.length} / {maxTags} tags
                </p>
            )}
        </div>
    );
}
