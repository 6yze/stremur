"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useUser } from "@/contexts/UserContext";
import { tmdbClient } from "@/lib/tmdb-client";

export default function WatchMoviePage() {
  const params = useParams();
  const router = useRouter();
  const { currentUser } = useUser();
  const updateProgress = useMutation(api.watchHistory.updateWatchProgress);
  
  const [title, setTitle] = useState<string>("");
  const [posterPath, setPosterPath] = useState<string | null>(null);
  const movieId = Number(params.id);

  // Fetch movie details
  useEffect(() => {
    async function fetchMovie() {
      try {
        const movie = await tmdbClient.getMovieDetails(movieId);
        setTitle(movie.title);
        setPosterPath(movie.poster_path);
      } catch (err) {
        console.error("Failed to fetch movie:", err);
      }
    }
    fetchMovie();
  }, [movieId]);

  // Save watch progress
  useEffect(() => {
    if (!currentUser || !title) return;

    let progress = 5;
    
    // Initial save
    updateProgress({
      userId: currentUser._id,
      mediaId: movieId,
      mediaType: "movie",
      title,
      posterPath: posterPath || undefined,
      progress,
      duration: 7200,
    });

    // Update progress periodically
    const interval = setInterval(() => {
      if (progress < 90) {
        progress = Math.min(progress + 15, 90);
        updateProgress({
          userId: currentUser._id,
          mediaId: movieId,
          mediaType: "movie",
          title,
          posterPath: posterPath || undefined,
          progress,
          duration: 7200,
        });
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [currentUser, movieId, title, posterPath, updateProgress]);

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black z-50">
      <button
        onClick={() => router.back()}
        className="absolute top-4 left-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-lg transition-colors"
      >
        <ArrowLeft className="w-6 h-6 text-white" />
      </button>
      <iframe
        src={`https://vidsrc.to/embed/movie/${movieId}`}
        className="w-full h-full"
        frameBorder="0"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="origin"
      />
    </div>
  );
}
