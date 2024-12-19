import React, { useEffect, useState, useCallback, useMemo } from "react";
import { MoviePlayerModalProps, SeasonData, EpisodeData } from "@/types";
import { X, Loader2, Film, Tv } from "lucide-react";

interface EnhancedMoviePlayerModalProps extends MoviePlayerModalProps {
  category?: "movie" | "tv";
}

const MoviePlayerModal: React.FC<EnhancedMoviePlayerModalProps> = ({
  isOpen,
  onClose,
  contentId,
  contentTitle,
  contentOverview,
  contentType,
}) => {
  const modalContentRef = React.useRef<HTMLDivElement>(null);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [selectedEpisode, setSelectedEpisode] = useState<number>(1);
  const [seasons, setSeasons] = useState<SeasonData[]>([]);
  const [episodes, setEpisodes] = useState<EpisodeData[]>([]);
  const [isLoadingSeasons, setIsLoadingSeasons] = useState(false);
  const [isLoadingEpisodes, setIsLoadingEpisodes] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const BASE_URL = "https://api.themoviedb.org/3";

  const fetchEpisodes = useCallback(
    async (seasonNumber: number) => {
      if (!process.env.NEXT_PUBLIC_TMDB_API_KEY) {
        setError("API key is missing");
        return;
      }

      setIsLoadingEpisodes(true);
      setError(null);
      try {
        const response = await fetch(
          `${BASE_URL}/tv/${contentId}/season/${seasonNumber}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch episodes");
        }

        const data = await response.json();
        setEpisodes(data.episodes || []);
        setSelectedEpisode(1);
      } catch (err) {
        console.error("Error fetching episodes:", err);
        setError("Unable to load episodes. Please try again.");
      } finally {
        setIsLoadingEpisodes(false);
      }
    },
    [contentId, process.env.NEXT_PUBLIC_TMDB_API_KEY]
  );

  const fetchSeasons = useCallback(async () => {
    if (!process.env.NEXT_PUBLIC_TMDB_API_KEY) {
      setError("API key is missing");
      return;
    }

    setIsLoadingSeasons(true);
    setError(null);
    try {
      const response = await fetch(
        `${BASE_URL}/tv/${contentId}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch seasons");
      }

      const data = await response.json();
      const filteredSeasons = data.seasons.filter(
        (season: SeasonData) => season.season_number > 0
      );

      setSeasons(filteredSeasons);

      if (filteredSeasons.length > 0) {
        await fetchEpisodes(filteredSeasons[0].season_number);
      }
    } catch (err) {
      console.error("Error fetching seasons:", err);
      setError("Unable to load seasons. Please try again.");
    } finally {
      setIsLoadingSeasons(false);
    }
  }, [contentId, process.env.NEXT_PUBLIC_TMDB_API_KEY, fetchEpisodes]);

  const embedUrl = useMemo(() => {
    return contentType === "movie"
      ? `https://vidsrc.icu/embed/movie/${contentId}`
      : `https://vidsrc.icu/embed/tv/${contentId}/${selectedSeason}/${selectedEpisode}`;
  }, [contentId, contentType, selectedSeason, selectedEpisode]);

  useEffect(() => {
    if (isOpen && contentType === "tv") {
      fetchSeasons();
    }
  }, [isOpen, contentType, fetchSeasons]);

  const handleSeasonChange = async (seasonNumber: number) => {
    setSelectedSeason(seasonNumber);
    await fetchEpisodes(seasonNumber);
  };

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleEscKey);

      return () => {
        document.body.style.overflow = "auto";
        document.removeEventListener("keydown", handleEscKey);
      };
    }
  }, [isOpen, onClose]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 
        bg-black/90 backdrop-blur-md overflow-y-auto"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalContentRef}
        className="relative w-full max-w-5xl bg-gray-900/95 backdrop-blur-xl rounded-2xl 
          shadow-2xl border border-gray-800/50 animate-fade-in-up"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 p-2 text-gray-400 hover:text-white 
            bg-gray-800/50 hover:bg-gray-700/50 rounded-full transition-all duration-300
            hover:rotate-90"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Section */}
        <div className="p-6 sm:p-8 border-b border-gray-800/50">
          <div className="flex items-center gap-3 mb-4">
            {contentType === "tv" ? (
              <Tv className="w-6 h-6 text-red-500" />
            ) : (
              <Film className="w-6 h-6 text-red-500" />
            )}
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              {contentTitle}
            </h3>
          </div>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            {contentOverview}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-900/20 border border-red-800/50 text-red-400 text-center">
            {error}
          </div>
        )}

        {/* TV Show Controls */}
        {contentType === "tv" && (
          <div className="p-6 sm:p-8 border-b border-gray-800/50 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Season Select */}
              <div className="space-y-2">
                <label className="block text-sm text-gray-400">
                  Select Season
                </label>
                <select
                  value={selectedSeason}
                  onChange={(e) => handleSeasonChange(Number(e.target.value))}
                  disabled={isLoadingSeasons}
                  className="w-full px-4 py-3 bg-gray-800/50 text-white border border-gray-700 
                    rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-transparent 
                    transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingSeasons ? (
                    <option>Loading seasons...</option>
                  ) : (
                    seasons.map((season) => (
                      <option
                        key={season.season_number}
                        value={season.season_number}
                        className="bg-gray-800"
                      >
                        {season.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Episode Select */}
              <div className="space-y-2">
                <label className="block text-sm text-gray-400">
                  Select Episode
                </label>
                <select
                  value={selectedEpisode}
                  onChange={(e) => setSelectedEpisode(Number(e.target.value))}
                  disabled={isLoadingEpisodes}
                  className="w-full px-4 py-3 bg-gray-800/50 text-white border border-gray-700 
                    rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-transparent 
                    transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingEpisodes ? (
                    <option>Loading episodes...</option>
                  ) : (
                    episodes.map((episode) => (
                      <option
                        key={episode.episode_number}
                        value={episode.episode_number}
                        className="bg-gray-800"
                      >
                        Ep {episode.episode_number}: {episode.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Video Player */}
        <div className="relative pt-[56.25%] bg-black/50 rounded-b-2xl overflow-hidden">
          {(isLoadingSeasons || isLoadingEpisodes) && !error ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/90">
              <div className="flex items-center gap-3">
                <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                <span className="text-gray-400">Loading content...</span>
              </div>
            </div>
          ) : error ? null : (
            <iframe
              src={embedUrl}
              className="absolute inset-0 w-full h-full"
              title={`${contentTitle} player`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MoviePlayerModal;
