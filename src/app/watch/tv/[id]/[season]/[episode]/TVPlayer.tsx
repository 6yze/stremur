'use client';
import { useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Props {
  showId: number;
  season: number;
  episode: number;
  title: string;
  posterPath: string | null;
}

export function TVPlayer({ showId, season, episode, title, posterPath }: Props) {
  const progressRef = useRef(5);
  const router = useRouter();

  useEffect(() => {
    // Initial save
    fetch('/api/watch-history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mediaType: 'tv',
        mediaId: showId,
        season,
        episode,
        progress: progressRef.current,
        duration: 2700,
        title,
        posterPath
      })
    });

    const interval = setInterval(() => {
      if (progressRef.current < 90) {
        progressRef.current = Math.min(progressRef.current + 15, 90);
        fetch('/api/watch-history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mediaType: 'tv',
            mediaId: showId,
            season,
            episode,
            progress: progressRef.current,
            duration: 2700,
            title,
            posterPath
          })
        });
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [showId, season, episode, title, posterPath]);

  return (
    <div className="relative w-screen h-screen bg-black">
      <button
        onClick={() => router.back()}
        className="absolute top-4 left-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-lg transition-colors"
      >
        <ArrowLeft className="w-6 h-6 text-white" />
      </button>
      <iframe
        src={`https://player.videasy.net/tv/${showId}/${season}/${episode}`}
        className="w-full h-full"
        frameBorder="0"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="origin"
      />
    </div>
  );
}
