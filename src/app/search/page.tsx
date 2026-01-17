"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { SearchBar } from "@/components/search/SearchBar";
import { SearchResults } from "@/components/search/SearchResults";
import { tmdbClient, MediaItem } from "@/lib/tmdb-client";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function search() {
      if (!query) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await tmdbClient.searchMulti(query);
        setResults(response.results || []);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }

    search();
  }, [query]);

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
        </div>
      ) : (
        <SearchResults results={results} query={query} />
      )}
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen">
      <div className="py-8">
        <SearchBar />
      </div>

      <Suspense fallback={
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
        </div>
      }>
        <SearchContent />
      </Suspense>
    </div>
  );
}
