'use client';

import { useState, useEffect } from 'react';
import { Plus, Check } from 'lucide-react';

interface WatchlistButtonProps {
  mediaType: 'movie' | 'tv';
  mediaId: number;
  title: string;
  posterPath: string | null;
}

export function WatchlistButton({ mediaType, mediaId, title, posterPath }: WatchlistButtonProps) {
  const [inWatchlist, setInWatchlist] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/watchlist/${mediaType}/${mediaId}`)
      .then(res => res.json())
      .then(data => {
        setInWatchlist(data.inWatchlist);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [mediaType, mediaId]);

  const toggle = async () => {
    setLoading(true);
    try {
      if (inWatchlist) {
        await fetch('/api/watchlist', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mediaType, mediaId })
        });
        setInWatchlist(false);
      } else {
        await fetch('/api/watchlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mediaType, mediaId, title, posterPath })
        });
        setInWatchlist(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
        inWatchlist 
          ? 'bg-green-600 hover:bg-green-700 text-white' 
          : 'bg-zinc-700 hover:bg-zinc-600 text-white'
      } disabled:opacity-50`}
    >
      {inWatchlist ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
      {inWatchlist ? 'In Watchlist' : 'Watchlist'}
    </button>
  );
}
