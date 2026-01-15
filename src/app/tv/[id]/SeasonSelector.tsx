'use client';

import { useState } from 'react';
import { Season } from '@/lib/tmdb';
import { ChevronDown, List, Play } from 'lucide-react';

interface SeasonSelectorProps {
  seasons: Season[];
}

export default function SeasonSelector({ seasons }: SeasonSelectorProps) {
  const [selectedSeason, setSelectedSeason] = useState<Season>(
    seasons.find(s => s.season_number === 1) || seasons[0] || null
  );
  const [isOpen, setIsOpen] = useState(false);

  if (!seasons || seasons.length === 0) {
    return null;
  }

  const handleSeasonSelect = (season: Season) => {
    setSelectedSeason(season);
    setIsOpen(false);
  };

  const getEpisodeCount = (season: Season) => {
    if (season.episodes) {
      return season.episodes.length;
    }
    // If episodes data isn't available yet, show season number instead
    return 'Season ' + season.season_number;
  };

  const episodeCountText = (season: Season) => {
    if (season.episodes) {
      const count = season.episodes.length;
      return `${count} ${count === 1 ? 'episode' : 'episodes'}`;
    }
    return 'Episodes';
  };

  return (
    <div className="space-y-4">
      {/* Season Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full md:w-auto min-w-[250px] flex items-center justify-between bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-3 rounded-lg transition-colors"
        >
          <span className="font-medium">{selectedSeason?.name || 'Select Season'}</span>
          <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 md:right-auto mt-2 bg-zinc-800 rounded-lg shadow-xl z-20 overflow-hidden border border-zinc-700">
            {seasons.map((season) => (
              <button
                key={season.id}
                onClick={() => handleSeasonSelect(season)}
                className={`w-full text-left px-4 py-3 hover:bg-zinc-700 transition-colors flex items-center justify-between ${selectedSeason?.id === season.id ? 'bg-zinc-700' : ''}`}
              >
                <span>{season.name}</span>
                <span className="text-zinc-400 text-sm">{episodeCountText(season)}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Season Info */}
      {selectedSeason && (
        <div className="bg-zinc-800/50 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <List className="w-5 h-5" />
              {selectedSeason.name}
            </h3>
            <span className="text-zinc-400 text-sm">{episodeCountText(selectedSeason)}</span>
          </div>

          {selectedSeason.overview && (
            <p className="text-zinc-300 text-sm">{selectedSeason.overview}</p>
          )}

          {selectedSeason.air_date && (
            <p className="text-zinc-400 text-sm">
              First aired: {new Date(selectedSeason.air_date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          )}

          {/* Episodes Preview */}
          {selectedSeason.episodes && selectedSeason.episodes.length > 0 && (
            <div className="pt-3 border-t border-zinc-700">
              <p className="text-zinc-400 text-sm mb-2">Episodes:</p>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {selectedSeason.episodes.slice(0, 5).map((episode) => (
                  <div 
                    key={episode.id}
                    className="flex items-center gap-3 p-2 hover:bg-zinc-700/50 rounded transition-colors"
                  >
                    <button className="flex-shrink-0 w-8 h-8 bg-zinc-700 hover:bg-zinc-600 rounded-full flex items-center justify-center transition-colors">
                      <Play className="w-4 h-4 fill-current" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {episode.episode_number}. {episode.name}
                      </p>
                      {episode.overview && (
                        <p className="text-zinc-400 text-xs truncate">{episode.overview}</p>
                      )}
                    </div>
                    {episode.runtime && (
                      <span className="text-zinc-500 text-xs flex-shrink-0">
                        {episode.runtime}m
                      </span>
                    )}
                  </div>
                ))}
                {selectedSeason.episodes.length > 5 && (
                  <p className="text-zinc-400 text-sm text-center pt-2">
                    +{selectedSeason.episodes.length - 5} more episodes
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
