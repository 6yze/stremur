"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../../../../../convex/_generated/api";
import { useUser } from "@/contexts/UserContext";
import { tmdbClient } from "@/lib/tmdb-client";

export default function WatchTVPage() {
  const params = useParams();
  const router = useRouter();
  const { currentUser } = useUser();
  const updateProgress = useMutation(api.watchHistory.updateWatchProgress);
  
  const [title, setTitle] = useState<string>("");
  const [posterPath, setPosterPath] = useState<string | null>(null);
  
  const showId = Number(params.id);
  const season = Number(params.season);
  const episode = Number(params.episode);

  // Fetch show details
  useEffect(() => {
    async function fetchShow() {
      try {
        const show = await tmdbClient.getTVShowDetails(showId);
        setTitle(show.name);
        setPosterPath(show.poster_path);
      } catch (err) {
        console.error("Failed to fetch show:", err);
      }
    }
    fetchShow();
  }, [showId]);

  // Save watch progress
  useEffect(() => {
    if (!currentUser || !title) return;

    let progress = 5;
    
    // Initial save
    updateProgress({
      userId: currentUser._id,
      mediaId: showId,
      mediaType: "tv",
      title,
      posterPath: posterPath || undefined,
      progress,
      duration: 3600,
      season,
      episode,
    });

    // Update progress periodically
    const interval = setInterval(() => {
      if (progress < 90) {
        progress = Math.min(progress + 15, 90);
        updateProgress({
          userId: currentUser._id,
          mediaId: showId,
          mediaType: "tv",
          title,
          posterPath: posterPath || undefined,
          progress,
          duration: 3600,
          season,
          episode,
        });
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [currentUser, showId, season, episode, title, posterPath, updateProgress]);

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black z-50">
      <button
        onClick={() => router.back()}
        className="absolute top-4 left-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-lg transition-colors"
      >
        <ArrowLeft className="w-6 h-6 text-white" />
      </button>
      <iframe
        src={`https://vidsrc.to/embed/tv/${showId}/${season}/${episode}`}
        className="w-full h-full"
        frameBorder="0"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="origin"
      />
    </div>
  );
}
