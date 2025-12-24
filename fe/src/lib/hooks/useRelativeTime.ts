// Client-only hook to compute human-friendly relative time and auto-update.
// Returns empty string on the server (so SSR output is stable), then sets the computed
// value in the browser.
import { useEffect, useState } from 'react';

export default function useRelativeTime(timestamp?: string | number | Date | null) {
  const [label, setLabel] = useState<string>('');

  useEffect(() => {
    if (!timestamp) {
      setLabel('');
      return;
    }

    const toDate = (t: string | number | Date) => (t instanceof Date ? t : new Date(t));
    const date = toDate(timestamp);

    const getLabel = () => {
      const now = Date.now();
      const diffMs = now - date.getTime();
      const diffSeconds = Math.floor(diffMs / 1000);

      if (diffSeconds < 5) return 'just now';
      if (diffSeconds < 60) return `${diffSeconds} ${diffSeconds === 1 ? 'second' : 'seconds'} ago`;

      const diffMinutes = Math.floor(diffSeconds / 60);
      if (diffMinutes < 60) return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;

      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;

      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;

      // fallback to locale date for older messages
      return date.toLocaleDateString();
    };

    // set immediately in browser
    setLabel(getLabel());

    // choose interval frequency based on age (updates per minute for recent messages)
    const intervalMs = (() => {
      const ageSeconds = Math.floor((Date.now() - date.getTime()) / 1000);
      if (ageSeconds < 60) return 5 * 1000; // update quickly for < 1min
      if (ageSeconds < 60 * 60) return 30 * 1000; // every 30s for < 1h
      return 60 * 1000; // every minute otherwise
    })();

    const iv = setInterval(() => {
      setLabel(getLabel());
    }, intervalMs);

    return () => clearInterval(iv);
  }, [timestamp]);

  return label; // empty string on server render; populated on client
}